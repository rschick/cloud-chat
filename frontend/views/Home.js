import { useEffect } from "react";

import MessageInput from "@components/MessageInput";
import Messages from "@components/Messages";
import TopNavbar from "@components/TopNavbar";
import ConversationSearch from "@components/ConversationSearch";

import Main from "@layout/Main";
import Sidebar from "@layout/Sidebar";
import FullPageView from "@layout/FullPageView";

import messages from "@state/messages";

export default function Home() {
  useEffect(() => messages.start(), []);

  return (
    <FullPageView>
      <Sidebar>
        <ConversationSearch />
      </Sidebar>
      <Main className="vh-100 d-flex flex-column">
        <TopNavbar />
        <Messages className="flex-grow-1" />
        <MessageInput />
      </Main>
    </FullPageView>
  );
}
