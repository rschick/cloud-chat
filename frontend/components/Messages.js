import React from "react";
import { useSnapshot } from "valtio";
import MessageBubble from "@components/MessageBubble";

import messagesState from "@state/messages";
import authState from "@state/auth";

export default function Messages() {
  const messages = useSnapshot(messagesState);
  const auth = useSnapshot(authState);

  return (
    <ul className="list-unstyled">
      {messages.items.map((message, index) => {
        return (
          <MessageBubble
            key={index}
            message={message}
            sent={auth.user.sub === message.value.from}
          ></MessageBubble>
        );
      })}
    </ul>
  );
}
