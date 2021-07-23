import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Posts = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: process.env.NEXT_PUBLIC_BACKEND_API,
          scope: "read:posts",
        });
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { posts } = await response.json();
        setPosts(posts);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {posts.map((post, index) => {
        return <li key={index}>{post}</li>;
      })}
    </ul>
  );
};

export default Posts;
