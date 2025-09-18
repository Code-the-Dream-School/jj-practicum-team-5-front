import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../shared/Header.jsx";
import Footer from  "../shared/Footer.jsx";


export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}