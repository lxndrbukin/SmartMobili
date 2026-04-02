import { createBrowserRouter } from 'react-router-dom';
import App from '../components/App';
import Categories from '../components/Static/Categories';
import OrderSteps from '../components/Static/OrderSteps';
import Carousel from '../components/Carousel/Carousel';
import Catalog from '../components/Catalog/Catalog';
import CatalogSection from '../components/Catalog/CatalogSection';
import CatalogItemPage from '../components/Catalog/CatalogItemPage';
import CreateItem from '../components/Admin/Items/CreateItem';
import EditItem from '../components/Admin/Items/ItemForm';
import CreateCategory from '../components/Admin/Categories/CreateCategory';
import EditCategory from '../components/Admin/Categories/CategoryForm';
import ContactForm from '../components/Contact/ContactForm';

export const router = createBrowserRouter([
  {
    path: '/:lang',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <>
            <Carousel />
            <Categories />
            <OrderSteps />
          </>
        ),
      },
      {
        path: 'catalog',
        element: <Catalog />,
      },
      {
        path: 'catalog/:catSlug',
        element: <CatalogSection />,
      },
      {
        path: 'catalog/:catSlug/:itemId',
        element: <CatalogItemPage />,
      },
      {
        path: 'contact',
        element: <ContactForm />,
      },
    ],
  },
]);
