import { useCallback, useEffect, useRef, useState } from "react";

import messages from "@state/messages";
import events from "@events/hub";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const input = useRef();

  const handleSubmit = useCallback(
    (event) => {
      (async () => {
        event.preventDefault();
        event.stopPropagation();
        messages.send(message);
        setMessage("");
      })();
    },
    [message]
  );

  const handleStartConversation = useCallback((id) => {
    input.current.focus();
  }, []);

  useEffect(() => {
    events.on("user.selected", handleStartConversation);
    events.on("conversation.selected", handleStartConversation);
    return () => {
      events.off("user.selected", handleStartConversation);
      events.off("conversation.selected", handleStartConversation);
    };
  }, [handleStartConversation]);

  return (
    <form onSubmit={handleSubmit} className="position-absolute bottom-0 w-100">
      <style jsx>{`
        * {
          background-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>

      <div className="p-2">
        <input
          ref={input}
          className="text-muted rounded-pill form-control"
          type="text"
          value={message}
          placeholder="Message"
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>
    </form>
  );
}
