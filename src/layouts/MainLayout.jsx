import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../shared/Header.jsx";
import Footer from  "../shared/Footer.jsx";


export default function MainLayout() {
    return (
        <div>
            <Header />
            <main>
                <Outlet />  
            </main>
            <Footer />
        </div>
    );
}
