import "./i18n";
import "./assets/styles.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { store } from "./store";

const rootDiv = document.querySelector("#root");

if (rootDiv) {
  const root = createRoot(rootDiv);
  root.render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
