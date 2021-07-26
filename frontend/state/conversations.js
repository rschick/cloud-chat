import { proxy } from "valtio";

import auth from "./auth";

class Conversations {
  items = [];
  selectedId;

  select(id) {
    this.selectedId = id;
  }

  updateLastMessage(id, text) {
    const item = this.items.find((item) => item.value.id === id);
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
    this.items = items;

    if (!this.selectedId && items[0]) {
      this.selectedId = items[0].value.id;
    }
  }
}

export default proxy(new Conversations());
