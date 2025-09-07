import { useState, useEffect,  } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function SignUpForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    useEffect(() => {
        if (!formData.email) return;

        const timer = setTimeout(async () => {
            if (!validateEmail(formData.email)) {
                setErrors(prev => ({ ...prev, email: "Enter a valid email" }));
                return;
            }

            try {
                setIsCheckingEmail(true);
                const res = await fetch(`${API_URL}/api/v1/auth/check-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email })
                });
                const data = await res.json();
                if (data.exists) setErrors(prev => ({ ...prev, email: "This email is already in use" }));
            } catch (err) {
                console.error(err);
            } finally {
                setIsCheckingEmail(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.email]);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;
        return {
            isValid: passwordRegex.test(password),
            message: passwordRegex.test(password)
                ? ""
                : "Password must be at least 10 characters, include uppercase, lowercase, number, and special character"
        };
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!validateEmail(formData.email)) newErrors.email = 'Enter a valid email';

        if (!formData.password) newErrors.password = 'Password is required';
        else {
            const passwordValidation = validatePassword(formData.password);
            if (!passwordValidation.isValid) newErrors.password = passwordValidation.message;
        }

        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {

            const res = await fetch(`${API_URL}/api/v1/auth`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first: formData.firstName,
                    last: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            console.log('Status:', res.status);
            console.log('Response data:', data);

            if (res.ok) {
                localStorage.setItem("token", data.token);

                navigate('/dashboard', { replace: true });
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Please try again.');

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 py-12">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-8">
                    <p className="text-gray-600">Create your account to get started using</p>
                    <p className="text-gray-600 font-bold">Event Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-400'}`}
                                placeholder="John"
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-400'}`}
                                placeholder="Doe"
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-400'}`}
                            placeholder="test@example.com"
                        />
                        {isCheckingEmail && <p className="text-gray-500 text-sm">Checking...</p>}
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-400'}`}
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-400'}`}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 mt-1"
                        />
                        <label className="ml-3 text-sm text-gray-600">
                            I agree to the{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-500 font-semibold">Terms and Conditions</a> and{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-500 font-semibold">Privacy Policy</a>
                        </label>
                    </div>
                    {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-2xl'} text-white`}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                    <div className="text-center mt-6 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button type="button" onClick={() => navigate('/login')} className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                                Sign in here
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
