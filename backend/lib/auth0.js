import { params } from "@serverless/cloud";
import { initAuth0 } from "@auth0/nextjs-auth0";

const public = {
  NEXT_PUBLIC_AUTH0_CLIENT_ID: "7UhtPG3vhTehInOY0Fhlt3GcLfwT33BS",
  NEXT_PUBLIC_AUTH0_SCOPE: "openid profile",
  NEXT_PUBLIC_AUTH0_DOMAIN: "dev-jkn6ztxe.us.auth0.com",
  NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
  NEXT_PUBLIC_REDIRECT_URI:
    "https://heroic-build-u61j0.cloud.serverless-dev.com/api/callback",
  NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI:
    "https://heroic-build-u61j0.cloud.serverless-dev.com",
};

// export default initAuth0({
//   // Secrets
//   secret: params.SESSION_COOKIE_SECRET,
//   clientSecret: params.AUTH0_CLIENT_SECRET,

//   // Public
//   issuerBaseURL: public.NEXT_PUBLIC_AUTH0_DOMAIN,
//   baseURL: public.NEXT_PUBLIC_BASE_URL,
//   clientID: public.NEXT_PUBLIC_AUTH0_CLIENT_ID,
//   routes: {
//     callback:
//     public.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/api/callback",
//     postLogoutRedirect:
//     public.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI || "http://localhost:3000",
//   },
//   authorizationParams: {
//     response_type: "code",
//     scope: public.NEXT_PUBLIC_AUTH0_SCOPE,
//   },
//   session: {
//     absoluteDuration: public.SESSION_COOKIE_LIFETIME,
//   },
// });

console.log(params, public)

export default {}