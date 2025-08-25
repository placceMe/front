import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./delete/footer";
import Header from "./delete/headerMain";
import { useRequest } from "@shared/request/useRequest";
import { useAppDispatch } from "@store/hooks";
// Update the import path below to the correct relative path where userSlice actually exists.
// For example, if userSlice.ts is in src/entities/user/model/userSlice.ts, use:
import {  logoutAction, setUser } from "../../entities/user/model/userSlice";
import { setCart, setUserId } from "@features/cart/model/cartSlice";
import type { Category, Product, User } from "@shared/types/api";
import { setCategories } from "../../entities/category/model/categoriesSlice";
import { useCurrency } from "@features/currencySwitcher/model/useCurrency";

// import Footer from "../../components/good/footer";
// import Header from "../../components/MainScreen/headerMain";

export const MainLayout = () => {
/*
    const { request } = useRequest();
    const dispatch = useAppDispatch();

    async function fetchUser() {
        const user = await request<User>("/api/auth/me");
        if (user) {
            dispatch(setUser(user));
            dispatch(setUserId(user.id));

            const cartKey = `cart_${user.id}`;
            const localCart = localStorage.getItem(cartKey);
            if (localCart) {
                try {
                    const parsed: { id: string; quantity: number }[] = JSON.parse(localCart);

                    const products = await Promise.all(
                        parsed.map(async ({ id }) => await request<Product>(`/api/products/${id}`))
                    );

                    const fullCart = parsed
                        .map((item, index) => {
                            const product = products[index];
                            if (!product) return null;
                            return {
                                product,
                                quantity: item.quantity,
                            };
                        })
                        .filter((item): item is { product: Product; quantity: number } => item !== null);
                    dispatch(setCart(fullCart));
                } catch {
                    console.warn("Cart recovery failed");
                }
            }
        } else {
            dispatch(setUserId("guest"));
            dispatch(logoutAction());
        }
    }

    useEffect(() => {
        fetchUser();

        const fetchCategories = async () => {
    const data = await request<Category[]>("/api/category");
    console.log("Fetched :", data);
    if (data) {
      dispatch(setCategories(data));
    }
  };

  fetchCategories();
    }, []);
*/

const { request } = useRequest();
const dispatch = useAppDispatch();

 useCurrency(); 
async function fetchUser() {
  try {
    const user = await request<User>("/api/auth/me");

    if (!user) {
      // нет активной сессии
      dispatch(setUserId("guest"));
      dispatch(logoutAction());
      return;
    }

    // есть сессия — кладём юзера
    dispatch(setUser(user));
    dispatch(setUserId(user.id));

    // подтянем корзину из локалки
    const cartKey = `cart_${user.id}`;
    const localCart = localStorage.getItem(cartKey);

    if (localCart) {
      try {
        const parsed: { id: string; quantity: number }[] = JSON.parse(localCart);

        // получаем товары параллельно
        const products = await Promise.all(
          parsed.map(async ({ id }) => await request<Product>(`/api/products/${id}`))
        );

        const fullCart = parsed
          .map((item, index) => {
            const product = products[index];
            if (!product) return null;
            return { product, quantity: item.quantity };
          })
          .filter((x): x is { product: Product; quantity: number } => x !== null);

        dispatch(setCart(fullCart));
      } catch (e) {
        console.warn("Cart recovery failed", e);
      }
    }
  } catch (e) {
    // Любая ошибка (включая 401) — считаем гостем и чистим состояние
    dispatch(setUserId("guest"));
    dispatch(logoutAction());
    console.log(e)
  }
}

useEffect(() => {
  let isMounted = true;

  // запускаем параллельно: юзер и категории
  (async () => {
    await fetchUser();

    try {
      const data = await request<Category[]>("/api/category");
      if (isMounted && data) {
        dispatch(setCategories(data));
      }
    } catch (e) {
      console.warn("Fetch categories failed", e);
    }
  })();

  return () => {
    isMounted = false;
  };
}, []);

    return (
         <div className="flex flex-col min-h-screen"> 
           
            <Header />
            <main className="flex-grow" >
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};