import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";
import Categories from "../components/Categories/Categories";
import Carousel from "../components/Carousel/Carousel";
import Catalog from "../components/Catalog/Catalog";
import CreateItem from "../components/Catalog/CreateItem";

export const router = createBrowserRouter([
  {
    path: "/:lang",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <>
            <Carousel />
            <Categories />
          </>
        ),
      },
      {
        path: "catalog",
        element: <Catalog />,
      },
      {
        path: "catalog/add",
        element: <CreateItem />,
      },
    ],
  },
]);
