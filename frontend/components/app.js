import { useAuth0 } from "@auth0/auth0-react";

import Posts from "../components/posts";

function App() {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout } =
    useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Oops... {error.message}</p>
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>Hello {user.name}</p>
        <div>{JSON.stringify(user)}</div>
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
        <Posts />
      </div>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
}

export default App;
