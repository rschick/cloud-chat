import { api } from "@serverless/cloud";
import { auth } from "@serverless/cloud-auth0";
import cors from "cors";

api.use(cors());
api.use(auth());

api.get("/posts", async (req, res) => {
  const posts = ["hello", "and", "goodbye"];
  res.json({ posts });
});
