import { useCallback } from "react";
import { useSnapshot } from "valtio";
import conversations from "@state/conversations";
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
  const { items, selectedId } = useSnapshot(conversations);

  const handleItemClick = useCallback((id) => {
    conversations.select(id);
  }, []);

  return (
    <div>
      <ul className="list-group rounded-0">
        {items.map(({ key, value }) => (
          <ConversationItem
            key={key}
            {...value}
            selected={value.id === selectedId}
            onClick={() => handleItemClick(value.id)}
          />
        ))}
      </ul>
    </div>
  );
}
