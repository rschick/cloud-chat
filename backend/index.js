import { api, data } from "@serverless/cloud";
import { auth } from "@serverless/cloud-auth0";
import cors from "cors";
import ksuid from "ksuid";
import { v5 as uuidv5 } from "uuid";

const USER_UUID_NAMESPACE = "9738E54D-3350-402B-9849-35F0ECEB772C";

api.use(cors());
api.use(auth());

api.use(async (req, res, next) => {
  const id = uuidv5(req.token.sub, USER_UUID_NAMESPACE);
  const user = await data.get(`user:${id}`);

  if (!user) {
    await data.set(`user:${id}`, {
      id,
      sub: req.token.sub,
    });
  }

  req.user = user;

  return next();
});

api.get("/messages", async (req, res) => {
  const to = req.query.conv;
  const messages = await data.get(`${to}:*`);
  res.json(messages);
});

api.post("/messages", async (req, res) => {
  const to = req.body.to;
  const id = await ksuid.random();
  const message = {
    id: `${to}:message_${id.string}`,
    text: req.body.text,
    from: req.user.id,
    to,
  };

  await Promise.all([
    data.set(message.id, message),
    data.set(`conversation:${to}`, {
      last: req.body.text,
    }),
  ]);

  const messages = await data.get(`${to}:*`);
  res.json(messages);
});

api.get("/conversations", async (req, res) => {
  const conversations = await data.get("conversation:*");
  res.json(conversations);
});

api.put("/me", async (req, res) => {
  await data.set(`user:${req.user.id}`, {
    ...req.body,
    id: req.user.id,
  });
  const user = await data.get(`user:${req.user.id}`);
  res.json(user);
});

api.get("/users", async (req, res) => {
  const users = await data.get("user:*");
  res.json(users);
});
