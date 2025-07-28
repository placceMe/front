import { useSelector } from "react-redux";
import type { RootState } from "@store/store";
import { Suspense, use, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./delete/footer";
import Header from "./delete/headerMain";
import { API_PORTS, useRequest } from "@shared/request/useRequest";
import { useAppDispatch } from "@store/hooks";
// Update the import path below to the correct relative path where userSlice actually exists.
// For example, if userSlice.ts is in src/entities/user/model/userSlice.ts, use:
import { setUser } from "../../entities/user/model/userSlice";

// import Footer from "../../components/good/footer";
// import Header from "../../components/MainScreen/headerMain";

export const MainLayout = () => {


    const currentLang = useSelector((state: RootState) => state.language);


    const { request, error, loading: requestLoading } = useRequest(API_PORTS.USERS);
    const dispatch = useAppDispatch();

    async function fetchUser() {
        const user = await request("/api/auth/me");
        if (user) {
            dispatch(setUser(user));
        } else {
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