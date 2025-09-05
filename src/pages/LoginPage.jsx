import { useState } from "react";
import {useNavigate} from "react-router-dom";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("")

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Login submitted:", {email, password});

        setTimeout(() => setIsSubmitting(false), 1500);

        try {
            const response = await fetch('/api/v1/authRoutes/loginUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }

                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                console.log("Login successful:", data);

                navigate('/dashboard');
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Please enter your credentials to login</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-xl rounded-2xl p-8 backdrop-blur-sm bg-opacity-90"
                >
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
                            isSubmitting
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}

                    <div className="mt-6 text-center">
                        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}