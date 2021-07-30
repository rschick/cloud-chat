// @ts-ignore
import { api, data } from "@serverless/cloud";
import { auth } from "@serverless/cloud-auth";
import { geo } from "@serverless/cloud-geo";
import cors from "cors";
import ksuid from "ksuid";

api.use(cors());
api.use(auth());

api.get("/state", async (req, res) => {
  const [messages, conversations] = await Promise.all([
    data.get(`conv_${req.query.conv}:msg_*`),
    data.get(`user_${req.user.id}:conv_*`),
  ]);

  res.json({ messages, conversations });
});

api.post("/messages", async (req, res) => {
  let conv = req.body.conv;

  if (!conv || conv === "new-conversation") {
    // Start a new conversation
    const userId = req.body.userId;
    const user = await data.get(`user:${userId}`);
    const newid = await ksuid.random();
    conv = newid.string;
    await Promise.all([
      data.set(
        `user_${req.user.id}:conv_${conv}`,
        {
          conv,
          user: req.user.id,
          title: user.name,
        },
        { label1: `conv_${conv}:user_${req.user.id}` }
      ),
      data.set(
        `user_${user.id}:conv_${conv}`,
        {
          conv,
          user: user.id,
          title: req.user.name,
        },
        { label1: `conv_${conv}:user_${user.id}` }
      ),
      data.set(`user_${user.id}_${req.user.id}:conv_${conv}`, {
        conv,
        user: user.id,
        with: req.user.id,
        title: req.user.name,
      }),
      data.set(`user_${req.user.id}_${user.id}:conv_${conv}`, {
        conv,
        user: req.user.id,
        with: user.id,
        title: user.name,
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

  const { items: userConversations } = await data.getByLabel(
    "label1",
    `conv_${conv}:user_*`
  );

  await Promise.all([
    data.set(`conv_${conv}:msg_${message.id}`, message),
    ...userConversations.map(({ value }) =>
      data.set(`user_${value.user}:conv_${value.conv}`, {
        last: req.body.text,
      })
    ),
  ]);

  const [messages, conversations] = await Promise.all([
    data.get(`conv_${conv}:msg_*`),
    data.get(`user_${req.user.id}:conv_*`),
  ]);

  res.json({ conv, messages, conversations });
});

api.get("/conversations", async (req, res) => {
  let conversations;

  if (req.query.with) {
    conversations = await data.get(
      `user_${req.user.id}_${req.query.with}:conv_*`
    );
  } else {
    conversations = await data.get(`user_${req.user.id}:conv_*`);
  }

  res.json(conversations);
});

api.put("/me", async (req, res) => {
  const geohash = geo.hash(req.body.lat, req.body.lon);
  await data.set(
    `user:${req.user.id}`,
    {
      ...req.body,
      id: req.user.id,
      geohash,
    },
    { label1: `users:geo_${geohash}` }
  );
  const user = await data.get(`user:${req.user.id}`);
  res.json(user);
});

api.get("/users", async (req, res) => {
  if (req.query["sw.lat"]) {
    const sw = {
      latitude: Number.parseFloat(req.query["sw.lat"]),
      longitude: Number.parseFloat(req.query["sw.lon"]),
    };
    const ne = {
      latitude: Number.parseFloat(req.query["ne.lat"]),
      longitude: Number.parseFloat(req.query["ne.lon"]),
    };

    const rect = geo.rect(sw, ne);
    const cells = geo.coverRect(rect);

    const results = await Promise.all(
      cells.map((cell) => {
        return data.getByLabel(
          "label1",
          `users:` +
            `geo_${cell.rangeMin().toToken()}|` +
            `geo_${cell.rangeMax().toToken()}`
        );
      })
    );

    const items = [];
    for (var result of results) {
      items.push(
        ...result.items.filter(({ value }) => {
          return rect.containsLL(geo.point(value.lat, value.lon));
        })
      );
    }

    res.json({ items });
    return;
  }

  if (req.query["center.lat"]) {
    const center = {
      latitude: Number.parseFloat(req.query["center.lat"]),
      longitude: Number.parseFloat(req.query["center.lon"]),
    };
    const radius = Number.parseFloat(req.query.radius);
    const cells = geo.coverCircle(center, radius);

    const results = await Promise.all(
      cells.map((cell) => {
        return data.getByLabel(
          "label1",
          `users:` +
            `geo_${cell.rangeMin().toToken()}|` +
            `geo_${cell.rangeMax().toToken()}`
        );
      })
    );

    const items = [];
    for (var result of results) {
      items.push(
        ...result.items.filter(({ value }) =>
          geo.pointInCircle(
            { latitude: value.lat, longitude: value.lon },
            center,
            radius
          )
        )
      );
    }
    res.json({ items });
    return;
  }

  const users = await data.get("user:*");
  res.json(users);
});
