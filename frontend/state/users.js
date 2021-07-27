import { proxy } from "valtio";

import auth from "./auth";

class Users {
  items = [];

  async fetch() {
    const token = await auth.getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { items } = await response.json();
    this.items = (items || []).filter((item) => item.value.id !== auth.user.id);
  }
}

export default proxy(new Users());
