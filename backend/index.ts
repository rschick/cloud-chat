// @ts-ignore
import { api, data } from "@serverless/cloud";
import { auth } from "@serverless/cloud-auth0";
import { geo } from "@serverless/cloud-geo";
import cors from "cors";
import ksuid from "ksuid";
import { v5 as uuidv5 } from "uuid";

const USER_UUID_NAMESPACE = "9738E54D-3350-402B-9849-35F0ECEB772C";

api.use(cors());

api.get("/hash", async (req, res) => {
  const geohash = geo.hash(req.query.lat, req.query.lon);
  res.json({ geohash });
});

api.use(auth());

api.use(async (req, res, next) => {
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
});

api.get("/messages", async (req, res) => {
  const messages = await data.get(`conv_${req.query.conv}:msg_*`);
  res.json(messages);
});

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
    const covering = geo.coverRect(rect);

    const results = await Promise.all(
      covering.getGeoHashRanges(2).map((range) => {
        return data.getByLabel(
          "label1",
          `users:` +
            `geo_${range.rangeMin.toString(10)}|` +
            `geo_${range.rangeMax.toString(10)}`
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
    const covering = geo.coverCircle(center, radius);
    const ranges = covering.getGeoHashRanges(2);

    console.log(
      JSON.stringify(
        ranges.map(
          (range) =>
            `${range.rangeMin.toString(10)}-${range.rangeMax.toString(10)}`
        ),
        null,
        2
      )
    );

    const results = await Promise.all(
      ranges.map((range) => {
        return data.getByLabel(
          "label1",
          `users:` +
            `geo_${range.rangeMin.toString(10)}|` +
            `geo_${range.rangeMax.toString(10)}`
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
