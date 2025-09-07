import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Header() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: "1px solid #ccc" }}>
            <nav style={{ display: "flex", gap: "1rem" }}>
                <Link to="/">Home</Link>
                {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
            </nav>

            <h1 style={{ margin: 0, flexGrow: 1, textAlign: "center" }}>Project Management System</h1>

            <div>
                {isAuthenticated ? (
                    <button
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                    >
                        Log Out
                    </button>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </header>
    );
}
