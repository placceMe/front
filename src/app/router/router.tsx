import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../layouts/mainLayout";
import { lazy } from "react";


const Home = lazy(() => import("@pages/Home/ui/HomePage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
