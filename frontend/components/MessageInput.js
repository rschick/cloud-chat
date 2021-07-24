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
      <Form.Group className="mb-3">
        <Form.Control
          className="text-muted"
          type="text"
          value={message}
          placeholder="iMessage"
          onChange={(event) => setMessage(event.target.value)}
        />
      </Form.Group>
    </Form>
  );
}
