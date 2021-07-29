import { useCallback, useEffect, useState } from "react";

import ConversationList from "@components/ConversationList";
import SearchInput from "@components/SearchInput";
import SearchResults from "@components/SearchResults";

import messages from "@state/messages";
import users from "@state/users";

export default function ConversationSearch() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const handleSearchingChange = useCallback((value) => {
    setSearching(value);
  }, []);

  const handleConversationClick = useCallback((item) => {
    messages.selectConversation(item);
    setSearching(false);
    setQuery("");
  }, []);

  const handleUserClick = useCallback((item) => {
    messages.selectUser(item);
    setSearching(false);
    setQuery("");
  }, []);

  useEffect(() => {
    users.fetch();
  }, [query]);

  return (
    <div className="p-2">
      <SearchInput
        value={query}
        onChange={handleQueryChange}
        searching={searching}
        onSearchingChange={handleSearchingChange}
      />
      {searching && (
        <SearchResults
          onConversationClick={handleConversationClick}
          onUserClick={handleUserClick}
        />
      )}
      {!searching && <ConversationList />}
    </div>
  );
}
