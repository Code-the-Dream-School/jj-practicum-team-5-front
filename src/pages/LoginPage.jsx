import { useState, useEffect, useContext } from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("")
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        console.log('Current location:', location.pathname);
        console.log('Navigate function:', typeof navigate);
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        console.log("Login submitted:", {email, password});

        try {
            const response = await fetch(`${API_URL}/api/v1/auth/loginUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();
            console.log("Login response:", data);

            if (response.ok && data.success) {
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                localStorage.setItem('isAuthenticated', 'true');

                console.log("Login successful, navigating to dashboard...");
                login(data.token);
                navigate('/dashboard', { replace: true });
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div
                className="absolute inset-0"
                style={{
                    background: `
                      linear-gradient(to bottom,
                        rgba(171, 212, 246, 1) 0%,
                        rgba(171, 212, 246, 0.7) 60%,
                        rgba(171, 212, 246, 0.3) 100%
                      )
                    `,
                }}
            />

            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `url('/images/mycelium.webp')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            Welcome
                            <span className="block" style={{ color: "#007A8E" }}>
                                Back
                            </span>
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            Please enter your credentials to login
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-xl border border-gray-200 backdrop-blur-sm"
                    >
                        {error && (
                            <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50">
                                <p className="text-red-800 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                style={{
                                    focusRingColor: "#007A8E"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#007A8E"}
                                onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                            />
                        </div>

                        <div className="mb-8">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                style={{
                                    focusRingColor: "#007A8E"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#007A8E"}
                                onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                            style={{
                                background: "linear-gradient(to right, #008096, #96007E)",
                            }}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <div
                                        className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"
                                    ></div>
                                    Processing...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <a
                                href="#"
                                className="text-sm font-medium hover:underline transition-colors duration-200"
                                style={{ color: "#007A8E" }}
                            >
                                Forgot password?
                            </a>
                        </div>
                    </form>

                    <div className="mt-8 text-center bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg border border-gray-200">
                        <p className="text-gray-700">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/signup')}
                                className="font-semibold hover:underline transition-colors duration-200"
                                style={{ color: "#007A8E" }}
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}