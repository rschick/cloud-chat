import { proxy } from "valtio";

import events from "@events/hub";

import { NEXT_PUBLIC_API_URL } from "./config";

import auth from "./auth";
import users from "./users";

class Messages {
  messages = [];
  conversations = [];

  selectedConversation;
  selectedConversationId;
  selectedUserId;

  selectConversation({ convId }) {
    if (convId !== this.selectedConversationId) {
      this.messages = [];
      this.selectedConversationId = convId;
      this.selectedConversation = this.conversations.find(
        (item) => item.value.convId === convId
      );
      this.selectedUserId = undefined;
      this.selectedUserName = undefined;

      this.conversations = this.conversations.filter(
        (c) => c.value.convId !== "new-conversation"
      );
      this.fetch();
    }
    events.emit("conversation.selected", [this.selectedConversationId]);
  }

  async findUserConversation(id) {
    return this.conversations.find((c) => c.value.userIds?.includes(id));
  }

  async selectUser({ id, name }) {
    const existing = await this.findUserConversation(id);
    if (existing) {
      this.selectConversation(existing.value);
      return;
    }

    this.selectedConversationId = "new-conversation";
    this.selectedConversation = {
      key: "new-conversation",
      value: {
        title: name,
        convId: "new-conversation",
        last: "New conversation",
      },
    };

    this.selectedUserId = id;
    this.selectedUserName = name;
    this.messages = [];

    const conversations = this.conversations.filter(
      (c) => c.value.convId !== "new-conversation"
    );

    this.conversations = [this.selectedConversation, ...conversations];

    events.emit("conversation.selected", [this.selectedConversationId]);
  }

  start() {
    if (!this.interval) {
      this.interval = setInterval(this.fetch.bind(this), 5000);
      this.fetch();
    }

    return () => {
      this.stop();
    };
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  async getConversations() {
    const token = await auth.getToken();
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }

  async getMessages(convId) {
    if (!convId) {
      return { items: [] };
    }
    const token = await auth.getToken();
    const url = new URL(`${NEXT_PUBLIC_API_URL}/messages`);
    url.searchParams.append("convId", convId);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }

  async fetch() {
    const conversationId = this.selectedConversationId;
    if (!conversationId) {
      this.messages = [];
    }

    const [messages, conversations] = await Promise.all([
      this.getMessages(conversationId),
      this.getConversations(),
    ]);

    this.messages = messages.items;
    this.conversations = conversations.items;

    await this.updateConversationTitles();

    this.selectedConversation =
      this.selectedConversationId &&
      this.conversations.find(
        (conv) => conv.value.convId === this.selectedConversationId
      );

    if (this.selectedUserId) {
      this.selectedConversationId = "new-conversation";
      this.selectedConversation = {
        key: "new-conversation",
        value: {
          title: this.selectedUserName,
          convId: "new-conversation",
          last: "New conversation",
        },
      };
      this.conversations = [this.selectedConversation, ...this.conversations];
    }

    if (
      !this.selectedUserId &&
      !this.selectedConversationId &&
      this.conversations[0]
    ) {
      this.selectedConversationId = this.conversations[0].value.convId;
      await this.fetch();
    }
  }

  async createConversation() {
    const token = await auth.getToken();
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/conversations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userIds: [this.selectedUserId, auth.user.id],
      }),
    });

    const { convId } = await response.json();

    return convId;
  }

  async send(text) {
    if (this.selectedConversationId === "new-conversation") {
      this.selectedConversationId = await this.createConversation();
    }

    const token = await auth.getToken();
    await fetch(`${NEXT_PUBLIC_API_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        convId: this.selectedConversationId,
        text,
      }),
    });

    this.selectedUserId = undefined;

    await this.fetch();
  }

  async getNames(userIds) {
    const items = await Promise.all(userIds.map((id) => users.getUser(id)));
    return items.map((item) => item.name);
  }

  async updateConversationTitles() {
    for (const conversation of this.conversations) {
      const names = await this.getNames(
        conversation.value.userIds.filter((id) => id !== auth.user.id)
      );
      conversation.value.title = names.join(",");
    }
  }
}

export default proxy(new Messages());
