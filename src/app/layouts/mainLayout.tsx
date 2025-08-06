import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./delete/footer";
import Header from "./delete/headerMain";
import { useRequest } from "@shared/request/useRequest";
import { useAppDispatch } from "@store/hooks";
// Update the import path below to the correct relative path where userSlice actually exists.
// For example, if userSlice.ts is in src/entities/user/model/userSlice.ts, use:
import { logout, setUser } from "../../entities/user/model/userSlice";
import { setCart, setUserId } from "@features/cart/model/cartSlice";
import type { Product, User } from "@shared/types/api";

// import Footer from "../../components/good/footer";
// import Header from "../../components/MainScreen/headerMain";

export const MainLayout = () => {

    const { request } = useRequest();
    const dispatch = useAppDispatch();

    async function fetchUser() {
        const user = await request<User>("/auth/me");
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
            dispatch(logout());
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="">
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};