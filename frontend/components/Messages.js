import React, { useEffect } from "react";
import { useSnapshot } from "valtio";
import messages from "../state/messages";

export default function Messages() {
  const snap = useSnapshot(messages);

  useEffect(() => {
    messages.fetch();
  }, []);

  return (
    <ul>
      {snap.items.map((message, index) => {
        return <li key={index}>{message.value.text}</li>;
      })}
    </ul>
  );
}
