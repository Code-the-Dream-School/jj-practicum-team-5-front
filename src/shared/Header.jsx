import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Header({
  leftLogoSize = 95, // 👈
  logoSize = 160,
  logoOffset = -60,
  titleOffset = 40,
  titleSize = 100,
}) {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

    const isHomePage = location.pathname === "/";
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
        position: "relative", // needed for absolute positioning
        height: "80px", // fixed header height
      }}
    >

      <Link to="/" className="flex items-center">
        <img
          src="/images/logo.png"
          alt="App Logo"
          style={{ height: `${leftLogoSize}px`, width: "auto" }}
        />
      </Link>

      {/* Left navigation */}
        <nav style={{ display: "flex", gap: "1rem" }}>
            {isAuthenticated && (
                <>
                    {isHomePage && (
                        <Link to="/dashboard" className={linkStyle}>
                            Dashboard
                        </Link>
                    )}
                    {isDashboardPage && (
                        <Link to="/" className={linkStyle}>
                            Home
                        </Link>
                    )}
                    {!isHomePage && !isDashboardPage && (
                        <>
                            <Link to="/" className={linkStyle}>
                                Home
                            </Link>
                            <Link to="/dashboard" className={linkStyle}>
                                Dashboard
                            </Link>
                        </>
                    )}
                </>
            )}
        </nav>

      {/* Center logo + title */}
      <div style={{ textAlign: "center", flexGrow: 1, position: "relative" }}>
        <img
          src="/images/MycelFlow.png"
          alt="MycelFlow logo"
          style={{
            height: `${logoSize}px`,
            position: "absolute",
            top: `${logoOffset}px`, // controlled by prop
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />
        <h1
          className="font-bold"
          style={{
            margin: 0,
            marginTop: `${titleOffset}px`, // controlled by prop
            color: "#333C00",
            fontSize: `${titleSize}%`, // controlled by prop
          }}
        >
          Project Management System
        </h1>
      </div>

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
