import { useCallback, useState } from "react";
import { Form } from "react-bootstrap";

import messages from "@state/messages";

export default function MessageInput() {
  const [message, setMessage] = useState("");

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

  return (
    <form onSubmit={handleSubmit} className="position-absolute bottom-0 w-100">
      <style jsx>{`
        * {
          background-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>

      <div className="p-2">
        <input
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
