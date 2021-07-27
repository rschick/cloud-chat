import { useEffect } from "react";

import MessageInput from "@components/MessageInput";
import Messages from "@components/Messages";
import TopNavbar from "@components/TopNavbar";
import ConversationSearch from "@components/ConversationSearch";

import Main from "@layout/Main";
import Sidebar from "@layout/Sidebar";
import FullPageView from "@layout/FullPageView";

import messages from "@state/messages";
import conversations from "@state/conversations";
import users from "@state/users";

export default function Home() {
  useEffect(() => messages.start(), []);
  useEffect(() => conversations.fetch(), []);
  useEffect(() => users.fetch(), []);

  return (
    <FullPageView>
      <Sidebar>
        <ConversationSearch />
      </Sidebar>
      <Main>
        <TopNavbar />
        <Messages />
        <MessageInput />
      </Main>
    </FullPageView>
  );
}
