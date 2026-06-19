import "./i18n";
import "@acrool/react-carousel/dist/index.css";
import "./assets/styles.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { router } from "./router";
import { store } from "./store";

const rootDiv = document.querySelector("#root");

if (rootDiv) {
  const root = createRoot(rootDiv);
  root.render(
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>,
  );
}
