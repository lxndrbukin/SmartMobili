import "./i18n";
import "./assets/styles.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./components/App";

import { store } from "./store";

const rootDiv = document.querySelector("#root");

if (rootDiv) {
  const root = createRoot(rootDiv);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
