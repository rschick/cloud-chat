import { useCallback } from "react";
import { useSnapshot } from "valtio";
import conversations from "@state/conversations";
import users from "@state/users";
import clsx from "clsx";

function UserItem({ name, onClick }) {
  return (
    <a
      href="#"
      className={clsx("list-group-item list-group-item-action bg-gray-200")}
      onClick={onClick}
    >
      <h1 className="fs-5 mb-1">{name}</h1>
    </a>
  );
}

function ConversationItem({ title, last, selected, onClick }) {
  return (
    <a
      href="#"
      className={clsx(
        "list-group-item list-group-item-action bg-gray-200",
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
  );
}

export default function SearchResults() {
  const { items: conversationList } = useSnapshot(conversations);
  const { items: userList } = useSnapshot(users);

  const handleConversationClick = useCallback((id) => {
    conversations.select(id);
  }, []);

  const handleUserClick = useCallback((id) => {
    console.log("user click", id);
  }, []);

  return (
    <div>
      <style jsx>{`
        ul {
          border-radius: 0;
        }
      `}</style>

      {conversationList.length && (
        <>
          <h4>Conversations</h4>
          <ul className="list-group">
            {conversationList.map(({ key, value }) => (
              <ConversationItem
                key={key}
                {...value}
                onClick={() => handleConversationClick(value.id)}
              />
            ))}
          </ul>
        </>
      )}

      {userList.length && (
        <>
          <h4>Users</h4>
          <ul className="list-group">
            {userList.map(({ key, value }) => (
              <UserItem
                key={key}
                {...value}
                onClick={() => handleUserClick(value.id)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
