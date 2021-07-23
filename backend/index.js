import { api } from "@serverless/cloud";
import cors from "cors";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

api.use(cors());

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-jkn6ztxe.us.auth0.com/.well-known/jwks.json`,
  }),
  audience: "https://heroic-build-u61j0.cloud.serverless-dev.com",
  issuer: "https://dev-jkn6ztxe.us.auth0.com/",
  algorithms: ["RS256"],
});

api.use(jwtCheck);

api.get("/posts", async (req, res) => {
  const posts = ["hello", "and", "goodbye"];
  res.json({ posts });
});
