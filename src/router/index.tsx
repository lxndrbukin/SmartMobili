import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";
import Categories from "../components/Categories/Categories";

export const router = createBrowserRouter([
  {
    path: "/:lang",
    element: <App />,
    children: [
      {
        index: true,
        element: <Categories />,
      },
      {
        path: "catalog",
        element: <>Catalog</>,
      },
    ],
  },
]);
