import { Auth0Provider } from "@auth0/auth0-react";
import App from "../components/app";

export default function Index() {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      redirectUri={process.env.NEXT_PUBLIC_REDIRECT_URI}
      audience={process.env.NEXT_PUBLIC_BACKEND_API}
      scope="read:posts"
    >
      <App />
    </Auth0Provider>
  );
}
