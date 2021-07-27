import { useCallback, useState } from "react";
import ConversationList from "@components/ConversationList";
import SearchInput from "@components/SearchInput";
import SearchResults from "@components/SearchResults";

export default function ConversationSearch() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const handleSearchingChange = useCallback((value) => {
    setSearching(value);
  }, []);

  return (
    <>
      <SearchInput
        value={query}
        onChange={handleQueryChange}
        searching={searching}
        onSearchingChange={handleSearchingChange}
      />
      {searching && <SearchResults />}
      {!searching && <ConversationList />}
    </>
  );
}
