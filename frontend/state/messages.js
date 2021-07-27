import { proxy } from "valtio";

import events from "@events/hub";

import auth from "./auth";

class Messages {
  messages = [];
  conversations = [];

  selectedConversation;
  selectedConversationId;
  selectedUserId;

  selectConversation(id) {
    this.selectedConversationId = id;
    this.selectedConversation = this.conversations.find(
      (conv) => conv.value.conv === id
    );

    events.emit("conversation.selected", id);
  }

  newConversation(userId) {
    this.selectedConversationId = undefined;
    this.selectedConversation = undefined;
    this.selectedUserId = userId;
    this.messages = [];

    events.emit("user.selected", [userId]);
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

  updateLastMessage(id, text) {
    const conversation = this.conversations.find(
      (conv) => conv.value.conv === id
    );
    if (!conversation) {
      console.warn("updateLastMessage(): missing conversation:", id);
      return;
    }
    conversation.value.last = text;
  }

  async fetch() {
    const conversationId = this.selectedConversationId;
    if (!conversationId) {
      this.messages = [];
    }

    const token = await auth.getToken();
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/state`);
    if (conversationId) {
      url.searchParams.append("conv", conversationId);
    }
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { messages, conversations } = await response.json();
    this.messages = messages.items;
    this.conversations = conversations.items;

    this.selectedConversation =
      this.selectedConversationId &&
      this.conversations.find(
        (conv) => conv.value.conv === this.selectedConversationId
      );

    if (this.selectedConversation && this.messages.length > 0) {
      this.updateLastMessage(
        conversationId,
        this.messages[this.messages.length - 1].value.text
      );
    }

    if (
      !this.selectedUserId &&
      !this.selectedConversationId &&
      this.conversations[0]
    ) {
      this.selectedConversationId = this.conversations[0].value.conv;
      await this.fetch();
    }
  }

  async send(text) {
    const conv = this.selectedConversationId;
    const userId = this.selectedUserId;
    const token = await auth.getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conv,
          userId,
          text,
          name: auth.user.name,
        }),
      }
    );

    const { messages, conversations } = await response.json();
    this.messages = messages.items;
    this.conversations = conversations.items;

    if (this.messages.length > 0) {
      this.updateLastMessage(
        conv,
        this.messages[this.messages.length - 1].value.text
      );
    }
  }
}

export default proxy(new Messages());
