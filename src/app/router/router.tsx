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
import { AboutSeller } from "@pages/AboutSeller.tsx";

const Home = lazy(() => import("@pages/Home/ui/HomePage"));
const CartPage = lazy(() => import("@pages/CartPage"));
const CheckoutPage = lazy(() => import("@pages/CheckoutPage"));
const AdminPage = lazy(() => import("@pages/Admin/ui/Admin"));

const CategoryAdmin = lazy(() => import("@features/admin/Category/ui/CategoryAdmin"));

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
