import { useSelector } from "react-redux";
import type { RootState } from "@store/store";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Footer from "../../components/good/footer";
import Header from "../../components/MainScreen/headerMain";

export const MainLayout = () => {


    const currentLang = useSelector((state: RootState) => state.language);


    console.log("Current Language:", currentLang);
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