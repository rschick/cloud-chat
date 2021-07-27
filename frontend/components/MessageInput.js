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
        console.log("submit");
        messages.send(message);
        setMessage("");
      })();
    },
    [message]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <style jsx>{`
        form {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <Form.Group className="mb-2 p-2">
        <Form.Control
          className="text-muted rounded-pill"
          type="text"
          value={message}
          placeholder="Message"
          onChange={(event) => setMessage(event.target.value)}
        />
      </Form.Group>
    </Form>
  );
}
