import { data, params } from "@serverless/cloud";
import jwt from "express-jwt";
import jwks from "jwks-rsa";
import { v5 as uuidv5 } from "uuid";

const USER_UUID_NAMESPACE = "9738E54D-3350-402B-9849-35F0ECEB772C";

async function getUserProfile(req, res, next) {
  const { sub } = req.token;

  const id = uuidv5(sub, USER_UUID_NAMESPACE);
  let user = await data.get(`user:${id}`);

  try {
    if (!user) {
      user = { id, sub };
      await data.set(`user:${id}`, user);
    }
  } catch (error) {
    throw error;
  }

  req.user = user;
  return next();
}

export function auth() {
  return [
    jwt({
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${params.AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
      audience: params.AUTH0_AUDIENCE,
      issuer: `https://${params.AUTH0_DOMAIN}/`,
      algorithms: ["RS256"],
      userProperty: "token",
    }),
    getUserProfile,
  ];
}
