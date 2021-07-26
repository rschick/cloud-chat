import { proxy, subscribe } from "valtio";

import auth from "./auth";
import conversations from "./conversations";

class Messages {
  items = [];

  start() {
    if (!this.interval) {
      this.interval = setInterval(this.fetch.bind(this), 5000);
      this.fetch();
    }

    const unsubscribe = subscribe(conversations, () => {
      this.fetch();
    });

    return () => {
      this.stop();
      unsubscribe();
    };
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  async fetch() {
    const conversationId = conversations.selectedId;
    if (!conversationId) {
      return;
    }

    const token = await auth.getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/messages?conv=${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { items } = await response.json();
    this.items = items;

    conversations.updateLastMessage(
      conversationId,
      items[items.length - 1].value.text
    );
  }

  async send(text) {
    const conversationId = conversations.selectedId;
    if (!conversationId) {
      return;
    }

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
          to: conversationId,
          text,
        }),
      }
    );

    const { items } = await response.json();
    this.items = items;

    conversations.updateLastMessage(
      conversationId,
      items[items.length - 1].value.text
    );
  }
}

export default proxy(new Messages());
