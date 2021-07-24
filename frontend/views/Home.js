import { useEffect } from "react";

import MessageInput from "@components/MessageInput";
import Messages from "@components/Messages";
import TopNavbar from "@components/TopNavbar";

import Container from "@layout/Container";
import messages from "@state/messages";

export default function Home() {
  useEffect(() => messages.start(), []);

  return (
    <>
      <TopNavbar />
      <Container>
        <Messages />
        <MessageInput />
      </Container>
    </>
  );
}
