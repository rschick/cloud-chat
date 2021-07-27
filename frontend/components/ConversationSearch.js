import { useCallback, useState } from "react";

import ConversationList from "@components/ConversationList";
import SearchInput from "@components/SearchInput";
import SearchResults from "@components/SearchResults";

import messages from "@state/messages";

export default function ConversationSearch() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const handleSearchingChange = useCallback((value) => {
    setSearching(value);
  }, []);

  const handleConversationClick = useCallback((id) => {
    messages.selectConversation(id);
    setSearching(false);
  }, []);

  const handleUserClick = useCallback((id) => {
    messages.newConversation(id);
    setSearching(false);
  }, []);

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
