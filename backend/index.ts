// @ts-ignore
import { api } from "@serverless/cloud";
import { auth } from "./middleware/auth";
import { user } from "./middleware/user";
import data from "./lib/data";
import cors from "cors";
import { GeoPoint } from "./lib/geo";

api.use(cors());
api.use(auth());
api.use(user());

api.get("/state", async (req, res) => {
  const state = await data.getState(req.user.id, req.query.convId);
  res.json(state);
});

api.post("/messages", async (req, res) => {
  await data.sendMessage(req.body.convId, req.user.id, req.body.text);
  const state = await data.getState(req.user.id, req.body.convId);
  res.json(state);
});

api.post("/conversations", async (req, res) => {
  const { value } = await data.createConversation(req.body.userIds);
  const state = await data.getState(req.user.id, value.convId);
  res.json(state);
});

api.put("/me", async (req, res) => {
  await data.updateUser(req.user, req.body);
  const user = await data.getUser(req.user.id);
  res.json(user);
});

api.get("/users/:userId", async (req, res) => {
  const user = await data.getUser(req.params.userId);
  res.json(user);
});

api.get("/users", async (req, res) => {
  if (req.query["sw.lat"]) {
    const result = await data.listUsersInRect({
      sw: {
        lat: Number.parseFloat(req.query["sw.lat"]),
        lon: Number.parseFloat(req.query["sw.lon"]),
      },
      ne: {
        lat: Number.parseFloat(req.query["ne.lat"]),
        lon: Number.parseFloat(req.query["ne.lon"]),
      },
    });

    res.json(result);
    return;
  }

  if (req.query["center.lat"]) {
    const center: GeoPoint = {
      lat: Number.parseFloat(req.query["center.lat"]),
      lon: Number.parseFloat(req.query["center.lon"]),
    };
    const radius = Number.parseFloat(req.query.radius);
    const result = await data.listUsersInCircle(center, radius);
    res.json(result);
    return;
  }

  const users = await data.listAllUsers();
  res.json(users);
});
