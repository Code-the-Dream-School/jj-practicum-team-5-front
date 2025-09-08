import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

    const isHomePage = location.pathname === "/";
  const isDashboardPage = location.pathname === "/dashboard";

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-300 bg-white shadow-sm">
      {/* Logo on the left */}
      <Link to="/" className="flex items-center">
        <img src="/images/logo.png" alt="App Logo" className="h-20 w-auto" />
      </Link>

      {/* Navigation menu */}
        {!isHomePage && (
      <nav className="flex gap-4 text-indigo-600 font-medium">
        <Link to="/" className="hover:text-indigo-800 transition">
          Home
        </Link>
        {isAuthenticated && !isDashboardPage && (
          <Link to="/dashboard" className="hover:text-indigo-800 transition">
            Dashboard
          </Link>
        )}
      </nav>
        )}

      {/* Title in the center */}
      <h1 className="flex-grow text-center text-lg md:text-xl font-bold text-gray-800">
        Project Management System
      </h1>

      {/* Authentication controls on the right */}
      <div>
        {isAuthenticated ? (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-red-600 hover:text-red-800 font-medium transition"
          >
            Log Out
          </button>
        ) : (
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
