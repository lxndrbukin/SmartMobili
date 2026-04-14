import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../components/App';
import Categories from '../components/Catalog/Categories';
import PopularItems from '../components/Catalog/PopularItems';
import OrderSteps from '../components/Static/OrderSteps';
import Carousel from '../components/Carousel/Carousel';
import Catalog from '../components/Catalog/Catalog';
import CatalogSection from '../components/Catalog/CatalogSection';
import CatalogItemPage from '../components/Catalog/CatalogItemPage';
import ContactForm from '../components/Contact/ContactForm';
import Panel from '../components/Admin/Panel/Panel';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/ro' replace />,
  },
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
            <PopularItems />
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
        path: 'order',
        element: <ContactForm />,
      },
      {
        path: 'admin',
        element: <Panel />,
      },
    ],
  },
]);
