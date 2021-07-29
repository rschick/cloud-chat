import { proxy } from "valtio";
import { debounce } from "lodash";

import auth from "./auth";

class Users {
  items = [];
  bounds;
  center;
  radius;

  fetch = debounce(this.fetchInternal, 1000);

  setSearchBounds(bounds) {
    this.bounds = bounds;
    this.fetch();
  }

  setSearchRadius(center, radius) {
    this.center = center;
    this.radius = radius;
    this.bounds = undefined;
    this.fetch();
  }

  async fetchInternal() {
    const token = await auth.getToken();
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API}/users`);
    if (this.bounds?.sw) {
      url.searchParams.append("sw.lat", this.bounds.sw.lat);
      url.searchParams.append("sw.lon", this.bounds.sw.lon);
      url.searchParams.append("ne.lat", this.bounds.ne.lat);
      url.searchParams.append("ne.lon", this.bounds.ne.lon);
    }
    if (this.center) {
      url.searchParams.append("center.lat", this.center.lat);
      url.searchParams.append("center.lon", this.center.lon);
      url.searchParams.append("radius", this.radius);
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
