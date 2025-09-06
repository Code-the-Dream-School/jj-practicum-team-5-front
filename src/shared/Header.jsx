import { Link, useLocation } from "react-router-dom";
import React from "react";

export default function Header() {
    const location = useLocation();

    const isHome = location.pathname === "/";
    const isLogin = location.pathname === "/login";

    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 2rem",
                backgroundColor: "#f0f0f0",
                borderBottom: "1px solid #ccc"
            }}
        >
            <nav style={{ display: "flex", gap: "1rem" }}>
                {!isHome && <Link to="/">Home</Link>}
                {!isLogin && <Link to="/login">Login</Link>}
            </nav>

            <h1 style={{ margin: 0, flexGrow: 1, textAlign: "center" }}>
                Project Management System
            </h1>

            <div style={{ width: "100px" }}></div>
        </header>
    );
}
