import { useSnapshot } from "valtio";
import Button from "react-bootstrap/Button";
import authState from "../state/auth";

export default function Index() {
  const auth = useSnapshot(authState);

  if (auth.isLoading) {
    return null;
  }

  if (auth.error) {
    return (
      <div>
        <p>Oops... {auth.error.message}</p>
        <Button
          onClick={() => authState.logout({ returnTo: window.location.origin })}
        >
          Log out
        </Button>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 align-items-center">
      <div className="d-flex vw-100 flex-column align-items-center">
        <p>Welcome to the App!</p>
        <Button onClick={() => authState.login()}>Log in</Button>
      </div>
    </div>
  );
}
