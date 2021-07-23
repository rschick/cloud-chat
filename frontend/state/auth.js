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

  async init() {
    if (auth0 || typeof window === "undefined") {
      return;
    }

    auth0 = await createAuth0Client({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
      client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
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
      this.user = await auth0.getUser();
      this.isAuthenticated = true;
      this.isLoading = false;
    } catch (error) {
      this.error = error;
      this.user = undefined;
      this.isAuthenticated = false;
      this.isLoading = false;
    }
  }

  async getToken() {
    return auth0.getTokenSilently({
      audience: process.env.NEXT_PUBLIC_BACKEND_API,
      scope: "read:posts",
    });
  }

  async login() {
    await auth0.loginWithRedirect();
  }

  async logout() {
    auth0.logout();
    this.user = undefined;
    this.isAuthenticated = false;
    this.isLoading = true;
    this.error = undefined;
  }
}

export default proxy(new Auth());
