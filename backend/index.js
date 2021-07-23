import { api, data } from "@serverless/cloud";
import { auth } from "@serverless/cloud-auth0";
import cors from "cors";

api.use(cors());
api.use(auth());

api.get("/messages", async (req, res) => {
  const messages = await data.get("message:*");
  res.json(messages);
});
