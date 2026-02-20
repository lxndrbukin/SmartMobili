import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";

export const router = createBrowserRouter([
  {
    path: "/:lang",
    element: <App />,
    children: [
      {
        path: "catalog",
        element: <>Catalog</>,
      },
    ],
  },
]);
