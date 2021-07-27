import { useCallback, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import clsx from "clsx";
import { useSpring, config } from "@react-spring/web";

import MessageBubble from "@components/MessageBubble";

import messagesState from "@state/messages";
import authState from "@state/auth";

export default function Messages({ className }) {
  const messages = useSnapshot(messagesState);
  const auth = useSnapshot(authState);
  const root = useRef();
  const locked = useRef(false);

  const handleScroll = useCallback((event) => {
    console.log("scroll", {
      scrollTop: event.target.scrollTop,
      scrollHeight: event.target.scrollHeight,
      clientHeight: event.target.clientHeight,
      bottom: event.target.scrollTop + event.target.clientHeight,
    });
    locked.current =
      event.target.scrollTop + event.target.clientHeight !==
      root.current.scrollHeight;
    console.log("locked", locked.current);
  }, []);

  const [_, api] = useSpring(() => ({
    y: 0,
    onChange: ({ value }) => {
      root.current.scrollTop = value.y;
    },
  }));

  useEffect(() => {
    if (!locked.current) {
      // api.start({
      //   from: {
      //     y: root.current.scrollTop,
      //   },
      //   to: {
      //     y: root.current.scrollHeight - root.current.clientHeight,
      //   },
      // });
    }
    root.current.scrollTop =
      root.current.scrollHeight - root.current.clientHeight;
  }, [messages]);

  return (
    <ul
      className={clsx("list-unstyled p-2 mb-0", className)}
      onScroll={handleScroll}
      ref={root}
    >
      <style jsx>{`
        ul {
          overflow-y: scroll;
          overflow-x: hidden;
        }
      `}</style>

      {messages.items.map((message, index) => {
        return (
          <MessageBubble
            key={index}
            message={message}
            sent={auth.user.id === message.value.from}
          ></MessageBubble>
        );
      })}
    </ul>
  );
}
