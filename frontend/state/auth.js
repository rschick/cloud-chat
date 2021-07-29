import { proxy } from "valtio";

import createAuth0Client from "@auth0/auth0-spa-js";

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

export const hasAuthParams = (searchParams = window.location.search) =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) &&
  STATE_RE.test(searchParams);

let auth0;

class Auth {
  user;
  isAuthenticated = false;
  isLoading = true;
  error;
  position;

  async init() {
    if (typeof window === "undefined") {
      this.isLoading = false;
      return;
    }

    if (auth0) {
      return;
    }

    this.watchPosition();

    auth0 = await createAuth0Client({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
      client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      audience: process.env.NEXT_PUBLIC_BACKEND_AUDIENCE,
      scope: "openid email profile",
      useRefreshTokens: true,
      cacheLocation: "localstorage",
    });

    try {
      if (hasAuthParams()) {
        const { appState } = await auth0.handleRedirectCallback();
        window.history.replaceState(
          {},
          document.title,
          appState?.returnTo || window.location.pathname
        );
      } else {
        await auth0.checkSession();
      }
      this.user = await this.getUser();
      if (this.user) {
        this.isAuthenticated = true;
      }
      this.isLoading = false;
      this.error = undefined;
    } catch (error) {
      console.log(error);
      this.error = error;
      this.user = undefined;
      this.isAuthenticated = false;
      this.isLoading = false;
    }
  }

  async getToken() {
    return auth0.getTokenSilently();
  }

  async login() {
    await auth0.loginWithRedirect();
  }

  async logout() {
    auth0.logout({
      returnTo: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI,
    });
    this.user = undefined;
    this.isAuthenticated = false;
    this.isLoading = true;
    this.error = undefined;
  }

  async getUser() {
    const identity = await auth0.getUser();
    if (!identity) {
      return;
    }
    const token = await this.getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(identity),
    });

    const user = await response.json();

    return user;
  }

  async updatePosition() {
    const identity = await auth0.getUser();
    if (!identity) {
      return;
    }

    const token = await this.getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.position),
    });

    this.user = await response.json();
  }

  watchPosition() {
    if (!"geolocation" in navigator) {
      console.warn("geolocation not supported");
      return;
    }

    navigator.geolocation.watchPosition(
      this.geolocationSuccess.bind(this),
      this.geolocationError.bind(this)
    );
  }

  geolocationSuccess({ coords }) {
    this.position = {
      lat: coords.latitude,
      lon: coords.longitude,
    };
    this.updatePosition();
  }

  geolocationError(error) {
    console.log("geolocationError", error);
  }
}

export default proxy(new Auth());
