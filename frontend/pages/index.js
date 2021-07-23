import { useSnapshot } from "valtio";

import Button from "react-bootstrap/Button";
import Messages from "@components/Messages";

import authState from "../state/auth";
import { Suspense } from "react";

export default function Index() {
  const auth = useSnapshot(authState);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return (
      <div>
        <p>Oops... {error.message}</p>
        <Button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </Button>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <p>Hello {auth.user.name}</p>
        <Button
          onClick={() => authState.logout({ returnTo: window.location.origin })}
        >
          Log out
        </Button>
        <Suspense fallback={<p>Loading...</p>}>
          <Messages />
        </Suspense>
      </div>
    );
  } else {
    return <Button onClick={() => authState.login()}>Log in</Button>;
  }
}
