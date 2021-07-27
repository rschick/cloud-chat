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
  const messages = await data.get(`conv_${req.query.conv}:*`);
  res.json(messages);
});

api.get("/state", async (req, res) => {
  const [messages, conversations] = await Promise.all([
    data.get(`conv_${req.query.conv}:*`),
    data.get(`user_${req.user.id}:conv_*`),
  ]);

  res.json({ messages, conversations });
});

api.post("/messages", async (req, res) => {
  let conv = req.body.conv;

  if (!conv) {
    // Start a new conversation
    const userId = req.body.userId;
    const user = await data.get(`user:${userId}`);
    const newid = await ksuid.random();
    conv = newid.string;
    await Promise.all([
      data.set(`user_${req.user.id}:conv_${conv}`, {
        id: conv,
        title: user.name,
      }),
      data.set(`user_${user.id}:conv_${conv}`, {
        id: conv,
        title: req.user.name,
      }),
    ]);
  }

  const id = await ksuid.random();
  const message = {
    id: id.string,
    text: req.body.text,
    from: req.user.id,
    conv,
  };

  await Promise.all([
    data.set(`conv_${conv}:msg_${message.id}`, message),
    data.set(`conversation:${conv}`, {
      last: req.body.text,
    }),
  ]);

  const [messages, conversations] = await Promise.all([
    data.get(`conv_${conv}:*`),
    data.get(`user_${req.user.id}:conv_*`),
  ]);

  res.json({ messages, conversations });
});

api.get("/conversations", async (req, res) => {
  const conversations = await data.get(`user_${req.user.id}:conv_*`);
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
