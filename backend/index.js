import { api, data } from "@serverless/cloud";
import { auth } from "@serverless/cloud-auth0";
import cors from "cors";
import ksuid from "ksuid";

api.use(cors());
api.use(auth());

api.get("/messages", async (req, res) => {
  const to = "conversation1";
  const messages = await data.get(`${to}:*`);
  res.json(messages);
});

api.post("/messages", async (req, res) => {
  const to = "conversation1";
  const id = await ksuid.random();
  const message = {
    id: `${to}:message_${id.string}`,
    text: req.body.text,
    from: req.user.sub,
    name: req.user.name,
    to,
  };

  console.log(message);

  await data.set(message.id, message);

  const messages = await data.get(`${to}:*`);
  res.json(messages);
});
