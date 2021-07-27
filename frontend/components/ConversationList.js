import { useCallback } from "react";
import { useSnapshot } from "valtio";
import messageState from "@state/messages";
import clsx from "clsx";

function ConversationItem({ title, last, selected, onClick }) {
  return (
    <div
      className={clsx(
        "list-group-item list-group-item-action bg-gray-200 border-0 p-2"
      )}
    >
      <a
        href="#"
        className={clsx(
          "list-group-item list-group-item-action bg-gray-200 border-0 rounded-3 mx-0",
          selected && "active"
        )}
        onClick={onClick}
      >
        <h1 className="fs-5 mb-1">{title}</h1>
        <p
          className={clsx(
            selected ? "text-light" : "text-black-50",
            "fs-6 mt-0 mb-1"
          )}
        >
          {last}
        </p>
      </a>
    </div>
  );
}

export default function ConversationList() {
  const { conversations, selectedConversationId } = useSnapshot(messageState);

  const handleItemClick = useCallback((id) => {
    messageState.selectConversation(id);
  }, []);

  return (
    <div>
      <ul className="list-group rounded-0">
        {conversations.map(({ key, value }) => (
          <ConversationItem
            key={key}
            {...value}
            selected={value.conv === selectedConversationId}
            onClick={() => handleItemClick(value.conv)}
          />
        ))}
      </ul>
    </div>
  );
}
