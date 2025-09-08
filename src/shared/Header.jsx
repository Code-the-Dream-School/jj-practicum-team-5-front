import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardPage = location.pathname === "/dashboard";

  // Links: custom deep violet (#3C0032), font +10%
  const linkStyle = "font-semibold text-[#3C0032] text-lg hover:text-[#5A004C]";

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        borderBottom: "1px solid #ccc",
        alignItems: "center",
      }}
    >
      {/* Left navigation */}
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/" className={linkStyle}>
          Home
        </Link>
        {isAuthenticated && !isDashboardPage && (
          <Link to="/dashboard" className={linkStyle}>
            Dashboard
          </Link>
        )}
      </nav>

      {/* Center title */}
      <h1
        className="font-bold"
        style={{
          margin: 0,
          flexGrow: 1,
          textAlign: "center",
          color: "#333C00",
          fontSize: "130%", // +30% bigger
        }}
      >
        Project Management System
      </h1>

      {/* Right navigation */}
      <div>
        {isAuthenticated ? (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className={linkStyle}
          >
            Log Out
          </button>
        ) : (
          <Link to="/login" className={linkStyle}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
