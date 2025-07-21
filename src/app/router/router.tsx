import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../layouts/mainLayout";
import { lazy } from "react";
import { ProductPage } from "@pages/ProductPage";

import { OrderSuccessPage } from "@pages/OrderSuccessPage/OrderSuccessPage";
import { ProfilePage } from "@pages/ProfilePage/ui/ProfilePage";
import CategoryProductsPage from "@pages/CategoryProductsPage";
import { CabinetPage } from "@pages/CabinetPage";
import { Wishlist } from "@pages/Wishlist";
import { CabinetLayout } from "../../app/layouts/CabinetLayout";
import OrdersTab from "../../widgets/OrdersTab";
import ViewedProducts from "@pages/ViewedProducts";
//import CabinetLayout from "../../app/layouts/CabinetLayout";



const Home = lazy(() => import("@pages/Home/ui/HomePage"));
const CartPage = lazy(() => import("@pages/CartPage"));
const CheckoutPage = lazy(() => import("@pages/CheckoutPage"));
/*
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: 'product/:id',
        element: <ProductPage />,
      },
      //TODO REname to Profile 
      {
        path: 'profile',
        element: <CabinetPage />,
      },
      {
      path: 'order-success/:orderId',
      element: <OrderSuccessPage />,
      },
      {
        path:'/category/:categoryId',
       element:<CategoryProductsPage />,
      },
       {
        path:'/wishlist',
       element:<Wishlist />,
      },
    ],
  },
]);
*/
/*
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: 'product/:id', element: <ProductPage /> },
      { path: 'order-success/:orderId', element: <OrderSuccessPage /> },
      { path: 'category/:categoryId', element: <CategoryProductsPage /> },
  //    { path: 'wishlist', element: <Wishlist /> },
      // ...все публичные
    ],
  },
  // Кабинет — отдельный layout!
  {
    path: "/profile",
    element: <CabinetLayout />,   // Кабинетный layout
    children: [
      { index: true, element: <CabinetPage /> }, // Главная кабинета
      { path: "orders", element: <div>Мои заказы</div> }, // пример
      { path: "wishlist", element: <Wishlist /> },
      { path: "settings", element: <ProfilePage /> },
      // другие табы кабинета
    ],
  },
]);


*/
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,        // <-- Header/Footer
    children: [
      { index: true, element: <Home /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: 'product/:id', element: <ProductPage /> },
      { path: 'order-success/:orderId', element: <OrderSuccessPage /> },
      { path: 'category/:categoryId', element: <CategoryProductsPage /> },
  //    { path: 'wishlist', element: <Wishlist /> },
      // ...другие страницы...
      {
        path: "profile",
        element: <CabinetLayout />, // <-- вложенный layout (кабинет)
        children: [
          { index: true, element: <ProfilePage /> },
          { path: "orders", element: <OrdersTab /> },
          { path: "favourite", element: <Wishlist /> },
          { path: "viewed", element: <ViewedProducts /> },
        ],
      },
    ],
  },
]);



export const AppRouter = () => <RouterProvider router={router} />;
