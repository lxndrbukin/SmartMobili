import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";
import Categories from "../components/Categories/Categories";
import Carousel from "../components/Carousel/Carousel";
import Catalog from "../components/Catalog/Catalog";
import CatalogSection from "../components/Catalog/CatalogSection";
import CatalogItemPage from "../components/Catalog/CatalogItemPage";
import CreateItem from "../components/Admin/CreateItem";
import CreateCategory from "../components/Admin/CreateCategory";
import ContactForm from "../components/Contact/ContactForm";

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
        path: "catalog/:catSlug",
        element: <CatalogSection />,
      },
      {
        path: "catalog/:catSlug/:itemId",
        element: <CatalogItemPage />,
      },
      {
        path: "contact",
        element: <ContactForm />,
      },
      {
        path: "admin",
        children: [
          {
            path: "items/create",
            element: <CreateItem />,
          },
          {
            path: "categories/create",
            element: <CreateCategory />,
          },
        ],
      },
    ],
  },
]);
