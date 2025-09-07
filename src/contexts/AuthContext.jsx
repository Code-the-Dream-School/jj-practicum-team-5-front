import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("authToken") || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token);
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem("authToken");
            setIsAuthenticated(false);
        }
    }, [token]);

    const login = (newToken) => setToken(newToken);
    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
