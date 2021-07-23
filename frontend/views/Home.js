import { useEffect } from "react";

import Messages from "@components/Messages";
import TopNavbar from "@components/TopNavbar";

import Container from "@layout/Container";
import messages from "@state/messages";

export default function Home() {
  useEffect(() => {
    messages.fetch();
  });

  return (
    <>
      <TopNavbar />
      <Container>
        <Messages />
      </Container>
    </>
  );
}
