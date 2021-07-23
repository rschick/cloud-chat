import { params } from "@serverless/cloud";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

export function auth() {
  return jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${params.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: params.CLOUD_URL,
    issuer: `https://${params.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
  });
}
