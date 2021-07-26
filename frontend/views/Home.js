import { useEffect } from "react";

import MessageInput from "@components/MessageInput";
import Messages from "@components/Messages";
import TopNavbar from "@components/TopNavbar";
import ConversationList from "@components/ConversationList";

import Main from "@layout/Main";
import Sidebar from "@layout/Sidebar";
import FullPageView from "@layout/FullPageView";

import messages from "@state/messages";
import conversations from "@state/conversations";

export default function Home() {
  useEffect(() => messages.start(), []);
  useEffect(() => conversations.fetch(), []);

  return (
    <FullPageView>
      <Sidebar>
        <ConversationList />
      </Sidebar>
      <Main>
        <TopNavbar />
        <Messages />
        <MessageInput />
      </Main>
    </FullPageView>
  );
}
