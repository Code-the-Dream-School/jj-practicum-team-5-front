import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Header({
                                   leftLogoSize = 95,
                                   logoSize = 160,
                                   logoOffset = -60,
                                   titleOffset = 40,
                                   titleSize = 100,
                               }) {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isHomePage = location.pathname === "/";
    const isDashboardPage = location.pathname === "/dashboard";

    const linkStyle = "font-semibold text-[#3C0032] text-base md:text-lg hover:text-[#5A004C] transition-colors duration-200";

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="relative border-b border-gray-300 bg-white">

            <div className="flex justify-between items-center px-4 md:px-8 h-16 md:h-20">


                <Link to="/" className="flex items-center flex-shrink-0">
                    <img
                        src="/images/logo.png"
                        alt="App Logo"
                        className="h-12 md:h-16 lg:h-20 w-auto"
                        style={{ height: `${Math.min(leftLogoSize * 0.7, leftLogoSize)}px` }}
                    />
                </Link>


                <nav className="hidden md:flex gap-4 lg:gap-6">
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


                <div className="hidden lg:block text-center flex-grow relative">
                    <img
                        src="/images/MycelFlow.png"
                        alt="MycelFlow logo"
                        className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none"
                        style={{
                            height: `${logoSize * 0.8}px`,
                            top: `${logoOffset * 0.8}px`,
                        }}
                    />
                    <h1
                        className="font-bold text-[#333C00] m-0"
                        style={{
                            marginTop: `${titleOffset * 0.8}px`,
                            fontSize: `${titleSize * 0.8}%`,
                        }}
                    >
                        Project Management System
                    </h1>
                </div>


                <div className="hidden md:block">
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

                {/* Mobile hamburger menu */}
                <button
                    className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-[#3C0032] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-[#3C0032] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-[#3C0032] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>
            </div>


            <div className="lg:hidden text-center py-2 border-t border-gray-200">
                <h1 className="font-bold text-[#333C00] text-sm sm:text-base">
                    Project Management System
                </h1>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-300 shadow-lg z-50">
                    <nav className="flex flex-col p-4 space-y-3">
                        {isAuthenticated && (
                            <>
                                {isHomePage && (
                                    <Link
                                        to="/dashboard"
                                        className={linkStyle}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                {isDashboardPage && (
                                    <Link
                                        to="/"
                                        className={linkStyle}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Home
                                    </Link>
                                )}
                                {!isHomePage && !isDashboardPage && (
                                    <>
                                        <Link
                                            to="/"
                                            className={linkStyle}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Home
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className={linkStyle}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    </>
                                )}
                            </>
                        )}

                        <div className="pt-2 border-t border-gray-200">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate("/login");
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={linkStyle}
                                >
                                    Log Out
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className={linkStyle}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}