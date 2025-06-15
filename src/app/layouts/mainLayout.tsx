import { useSelector } from "react-redux";
import type { RootState } from "@store/store";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {


    const currentLang = useSelector((state: RootState) => state.language);


    console.log("Current Language:", currentLang);
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-blue-600 text-white p-4">
                <h1 className="text-2xl">Main Layout Header</h1>
                <p>Current Language: {currentLang.language}</p>
            </header>
            <main className="flex-grow p-4">
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>Footer Content</p>
            </footer>
        </div>
    );
};