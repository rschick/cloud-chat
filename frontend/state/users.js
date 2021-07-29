import { proxy } from "valtio";

import auth from "./auth";

class Users {
  items = [];
  bounds = { sw: undefined, ne: undefined };

  setSearchBounds(bounds) {
    this.bounds = bounds;
    this.fetch();
  }

  async fetch() {
    const token = await auth.getToken();
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/users`);
    if (this.bounds.sw) {
      url.searchParams.append("sw.lat", this.bounds.sw.lat);
      url.searchParams.append("sw.lon", this.bounds.sw.lon);
      url.searchParams.append("ne.lat", this.bounds.ne.lat);
      url.searchParams.append("ne.lon", this.bounds.ne.lon);
    }
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { items } = await response.json();
    this.items = (items || []).filter((item) => item.value.id !== auth.user.id);
  }
}

export default proxy(new Users());
