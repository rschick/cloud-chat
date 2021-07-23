import React from "react";
import { useSnapshot } from "valtio";
import messages from "@state/messages";
import MessageBubble from "@components/MessageBubble";

export default function Messages() {
  const snap = useSnapshot(messages);

  return (
    <ul className="list-unstyled">
      {snap.items.map((message, index) => {
        return <MessageBubble key={index} message={message}></MessageBubble>;
      })}
    </ul>
  );
}
