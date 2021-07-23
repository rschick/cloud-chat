import "../style/index.css";

import auth from "../state/auth";

auth.init();

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
