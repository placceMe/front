import { useSelector } from "react-redux";
import type { RootState } from "@store/store";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./delete/footer";
import Header from "./delete/headerMain";

export const MainLayout = () => {


    const currentLang = useSelector((state: RootState) => state.language);


    console.log("Current Language:", currentLang);
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            {/** TODO - LEFT BRACKETS 
            <header className="bg-blue-600 text-white p-4">
                <h1 className="text-2xl">Main Layout Header</h1>
                <p>Current Language: {currentLang.language}</p>
            </header>
            */}
            {/** <main className="flex-grow p-20">  */}
             <main className="flex-grow"> 
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer/>
            {/**
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>Footer Content</p>
            </footer>
            */}
        </div>
    );
};