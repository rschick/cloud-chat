// @ts-ignore
import { api, data } from "@serverless/cloud";

beforeAll(async () => {
  await data.set("user:7215ce0f-20a3-4b56-a0fb-00161f42f4f8", {
    geohash: "5486f83fc32b3bcf",
    id: "7215ce0f-20a3-4b56-a0fb-00161f42f4f8",
    lat: 49.7041763,
    lon: -123.15608540000001,
    name: "Another User",
    sub: "test-user|99999999",
  });
});

async function deleteMessage(to, { id, from, conv }) {
  await Promise.all([
    data.remove(`conv_${conv}:msg_${id}`),
    data.remove(`user_${to}_${from}:conv_${conv}`),
    data.remove(`user_${from}_${to}:conv_${conv}`),
  ]);
}

async function deleteConversation({ conv, user }) {
  const { items: messages } = await data.get(`conv_${conv}:msg_*`);
  await Promise.all(messages.map((item) => deleteMessage(user, item.value)));
  await data.remove(`user_${user}:conv_${conv}`);
}

async function deleteUser(user) {
  await data.remove(`user:${user}`);
  const { items: conversations } = await data.get(`user_${user}:conv_*`);
  await Promise.all(
    conversations.map((item) => deleteConversation(item.value))
  );
}

afterAll(async () => {
  await Promise.all([
    deleteUser("7215ce0f-20a3-4b56-a0fb-00161f42f4f8"),
    deleteUser("b23b3aeb-15aa-5527-9e4f-7094fe053410"),
  ]);
});

test("should create user and update profile", async () => {
  const { body } = await api.put("/me").invoke({
    lat: 49.7041763,
    lon: -123.15608540000001,
    name: "Test User",
    other_property: "something",
  });

  expect(body).toEqual({
    geohash: "5486f83fc32b3bcf",
    id: "b23b3aeb-15aa-5527-9e4f-7094fe053410",
    lat: 49.7041763,
    lon: -123.15608540000001,
    name: "Test User",
    other_property: "something",
    sub: "cloud-auth0-mock|123456789",
  });
});

test("should get no messages or conversations", async () => {
  const { body } = await api.get("/state").invoke();

  expect(body).toEqual({
    conversations: { items: [] },
    messages: { items: [] },
  });
});

test("should start a new conversation", async () => {
  const { body } = await api.post("/messages").invoke({
    userId: "7215ce0f-20a3-4b56-a0fb-00161f42f4f8",
    text: "Hi!",
  });

  expect(body).toEqual({
    conv: expect.any(String),
    conversations: {
      items: [
        {
          key: expect.stringMatching(/user_.+\:conv_.*/),
          value: {
            conv: expect.any(String),
            last: "Hi!",
            title: "Another User",
            user: "b23b3aeb-15aa-5527-9e4f-7094fe053410",
          },
        },
      ],
    },
    messages: {
      items: [
        {
          key: expect.stringMatching(/conv_.*\:msg_.*/),
          value: {
            conv: expect.any(String),
            from: "b23b3aeb-15aa-5527-9e4f-7094fe053410",
            id: expect.any(String),
            text: "Hi!",
          },
        },
      ],
    },
  });
});

test("should return conversations with a user", async () => {
  const { body } = await api
    .get("/conversations?with=7215ce0f-20a3-4b56-a0fb-00161f42f4f8")
    .invoke();

  expect(body).toEqual({
    items: [
      {
        key: expect.stringMatching(
          /user_b23b3aeb-15aa-5527-9e4f-7094fe053410_7215ce0f-20a3-4b56-a0fb-00161f42f4f8:conv_.+/
        ),
        value: {
          conv: expect.any(String),
          title: "Another User",
          user: "b23b3aeb-15aa-5527-9e4f-7094fe053410",
          with: "7215ce0f-20a3-4b56-a0fb-00161f42f4f8",
        },
      },
    ],
  });
});

test("should get nearby users", async () => {
  const { body } = await api
    .get(
      `/users?` +
        `sw.lat=49.61515904368315&` +
        `sw.lon=-123.36547851562501&` +
        `ne.lat=49.79279036138332&` +
        `ne.lon=-122.94662475585939`
    )
    .invoke();

  expect(body.items).toContainEqual({
    key: "user:b23b3aeb-15aa-5527-9e4f-7094fe053410",
    value: {
      geohash: "5486f83fc32b3bcf",
      id: "b23b3aeb-15aa-5527-9e4f-7094fe053410",
      lat: 49.7041763,
      lon: -123.15608540000001,
      name: "Test User",
      other_property: "something",
      sub: "cloud-auth0-mock|123456789",
    },
  });
});

test("should not find user not in bounds", async () => {
  const { body } = await api
    .get(
      `/users?` +
        `sw.lat=49.62091153920056&` +
        `sw.lon=-122.98860381278503&` +
        `ne.lat=49.798521862069435&` +
        `ne.lon=-122.5697500530194`
    )
    .invoke();

  expect(body.items).not.toContainEqual({
    key: "user:b23b3aeb-15aa-5527-9e4f-7094fe053410",
  });
});
