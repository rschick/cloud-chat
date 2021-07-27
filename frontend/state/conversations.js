import { proxy } from "valtio";

import auth from "./auth";

class Conversations {
  items = [];
  selectedId;
  userId;

  select(id) {
    this.selectedId = id;
  }

  new(userId) {
    this.selectedId = undefined;
    this.userId = userId;
  }

  updateLastMessage(id, text) {
    const item = this.items.find((item) => item.value.id === id);
    if (!item) {
      console.warn("updateLastMessage(): missing conversation:", id);
      return;
    }
    item.value.last = text;
  }

  async fetch() {
    const token = await auth.getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/conversations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { items } = await response.json();
    this.items = items || [];

    if (!this.selectedId && this.items[0]) {
      this.selectedId = this.items[0].value.id;
    }
  }
}

export default proxy(new Conversations());
