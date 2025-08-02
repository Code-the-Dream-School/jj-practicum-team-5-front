import { Link } from "react-router-dom";

export default function Header() {
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
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
            </nav>

            <h1 style={{ margin: 0, flexGrow: 1, textAlign: "center" }}>
                Project Management System
            </h1>

            <div style={{ width: "100px" }}></div>
        </header>
    );
}
