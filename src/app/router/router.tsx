import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/mainLayout";
import { lazy, useMemo } from "react";
import { ProductPage } from "@pages/ProductPage";
import { OrderSuccessPage } from "@pages/OrderSuccessPage/OrderSuccessPage";
import { ProfilePage } from "@pages/ProfilePage/ui/ProfilePage";
import CategoryProductsPage from "@pages/CategoryProductsPage";
import { Wishlist } from "@pages/Wishlist";
import { CabinetLayout } from "../../app/layouts/CabinetLayout";
import OrdersTab from "../../widgets/OrdersTab";
import ViewedProducts from "@pages/ViewedProducts";
import { useAppSelector } from "@store/hooks";

import AboutUsPage from "@pages/AboutUs/AboutUsPage";
import Comparison from "@pages/ComparsionProductPage/ComparsionProductPage";
import { FAQ } from "@pages/FAQ/FAQ";

import PrivacyPolicy from "@pages/Policy/Policy";
import UsersAdmin from "@pages/Admin/UsersPageAdmin";
import OrderAdmin from "@pages/Admin/OrderPageAdmin";
import CategoryAdmin from "@pages/Admin/CategoryPageAdmin";
import CharacteristicAdmin from "@pages/Admin/CharacteristicPageAdmin";
import OrderModer from "@pages/Admin/OrderPageModeration";
import OrderModerationDetailsPage from "@pages/Admin/OrderDetailPageModeration";
import SearchResultsPage from "@features/searchProducts/ui/SearchResultsPage";
import DeliveryInfoPage from "@pages/Delivery/DeliveryInfoPage";
import { AboutSeller } from "@pages/AboutSeller.tsx";
import EditProductPage from "@pages/EditProductPage/EditProductPage";
import PaymentTestPage from "@pages/PaymentTestPage";


const Home = lazy(() => import("@pages/Home/ui/HomePage"));
const CartPage = lazy(() => import("@pages/CartPage"));
const CheckoutPage = lazy(() => import("@pages/CheckoutPage"));
const AdminPage = lazy(() => import("@pages/Admin/ui/Admin"));

export const AppRouter = () => {
  const user = useAppSelector(state => state.user.user);

  const router = useMemo(() => {
    return createBrowserRouter([
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
          { path: 'wishlist', element: <Wishlist /> },
          { path: 'seller/:sellerId', element: <AboutSeller /> },
          { path: 'aboutus', element: <AboutUsPage /> },
          { path: 'delivery', element: <DeliveryInfoPage /> },
          { path: 'faq', element: <FAQ /> },
          { path: 'policy', element: <PrivacyPolicy /> },
          {path: 'comparison', element: <Comparison />}, // Assuming compare is similar to wishlist
          { path: 'search', element: <SearchResultsPage /> },
          { path: "products/:productId/edit", element: <EditProductPage /> },
           { path: "pay-test", element: <PaymentTestPage  /> },
          
           
          

          ...(user?.id ? [{
            path: "/profile",
            element: <CabinetLayout />,
            children: [
              { index: true, element: <ProfilePage /> },
              { path: "orders", element: <OrdersTab /> },
              { path: "favourite", element: <Wishlist /> },
              { path: "viewed", element: <ViewedProducts /> },
            ],
          }] : []),
        ],

      },
      {
        path: "admin",
        element: <AdminPage />,
        children: [
          { path: "categories", element: <CategoryAdmin /> },
          { path: "characteristics", element: <CharacteristicAdmin /> },
          { path: "users", element: <UsersAdmin /> },
          { path: "orders", element: <OrderAdmin /> },
          { path: "ordersmoder", element: <OrderModer /> },
          { path: "ordersmoder/:id", element: <OrderModerationDetailsPage /> },
        ]
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      }
    ]);
  }, [user]);

  return <RouterProvider router={router} />;
};
