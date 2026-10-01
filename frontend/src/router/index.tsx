import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../components/App';
import HomePage from '../components/HomePage';
import Catalog from '../components/Catalog/Catalog';
import CatalogSection from '../components/Catalog/CatalogSection';
import CatalogItemPage from '../components/Catalog/CatalogItemPage';
import Services from '../components/Services/Services';
import ServiceSection from '../components/Services/ServiceSection';
import ServiceItemPage from '../components/Services/ServiceItemPage';
import Panel from '../components/Admin/Panel/Panel';
import About from '../components/Static/About';

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
        element: <HomePage />,
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
        path: 'catalog/:catSlug/:subSlug',
        element: <CatalogSection />,
      },
      {
        path: 'catalog/:catSlug/:subSlug?/item/:itemId',
        element: <CatalogItemPage />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'services/:catSlug',
        element: <ServiceSection />,
      },
      {
        path: 'services/:catSlug/:subSlug',
        element: <ServiceSection />,
      },
      {
        path: 'services/:catSlug/:subSlug?/service/:serviceId',
        element: <ServiceItemPage />,
      },
      {
        path: 'services/:catSlug/:subSlug?/item/:itemId',
        element: <ServiceItemPage />,
      },
      {
        path: 'admin',
        element: <Panel />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
]);

