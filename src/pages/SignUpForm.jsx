import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    if (!formData.email) return;

    const timer = setTimeout(async () => {
      if (!validateEmail(formData.email)) {
        setErrors((prev) => ({ ...prev, email: "Enter a valid email" }));
        return;
      }

      try {
        setIsCheckingEmail(true);
        const res = await fetch(`${API_URL}/api/v1/auth/check-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();
        if (data.exists)
          setErrors((prev) => ({
            ...prev,
            email: "This email is already in use",
          }));
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
        : "Password must be at least 10 characters, include uppercase, lowercase, number, and special character",
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid)
        newErrors.password = passwordValidation.message;
    }

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first: formData.firstName,
          last: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      console.log("Status:", res.status);
      console.log("Response data:", data);

      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard", { replace: true });
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="max-w-lg w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Create Your
              <span className="block" style={{ color: "#007A8E" }}>
                Account
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-2">
              Join our Event Management System
            </p>
            <p className="text-gray-600">
              Get started with organizing your projects efficiently
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-xl border border-gray-200 backdrop-blur-sm space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white shadow-sm ${
                    errors.firstName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{
                    focusRingColor: "#007A8E",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#007A8E")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.firstName
                      ? "#FCA5A5"
                      : "#D1D5DB")
                  }
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white shadow-sm ${
                    errors.lastName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{
                    focusRingColor: "#007A8E",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#007A8E")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.lastName
                      ? "#FCA5A5"
                      : "#D1D5DB")
                  }
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white shadow-sm ${
                  errors.email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{
                  focusRingColor: "#007A8E",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#007A8E")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.email
                    ? "#FCA5A5"
                    : "#D1D5DB")
                }
                placeholder="your@email.com"
              />
              {isCheckingEmail && (
                <div className="flex items-center mt-2">
                  <div
                    className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2"
                    style={{ borderColor: "#007A8E" }}
                  ></div>
                  <p className="text-gray-600 text-sm">
                    Checking availability...
                  </p>
                </div>
              )}
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white shadow-sm ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{
                    focusRingColor: "#007A8E",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#007A8E")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.password
                      ? "#FCA5A5"
                      : "#D1D5DB")
                  }
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white shadow-sm ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{
                    focusRingColor: "#007A8E",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#007A8E")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.confirmPassword
                      ? "#FCA5A5"
                      : "#D1D5DB")
                  }
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="bg-white bg-opacity-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-5 h-5 text-white border-2 border-gray-300 rounded focus:ring-2 mt-1"
                  style={{
                    accentColor: "#007A8E",
                    focusRingColor: "#007A8E",
                  }}
                />
                <label className="ml-3 text-sm text-gray-700 leading-relaxed">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-semibold hover:underline transition-colors duration-200"
                    style={{ color: "#007A8E" }}
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-semibold hover:underline transition-colors duration-200"
                    style={{ color: "#007A8E" }}
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-600 text-sm mt-2 font-medium">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              style={{
                background: "linear-gradient(to right, #008096, #96007E)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg border border-gray-200">
            <p className="text-gray-700">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold hover:underline transition-colors duration-200"
                style={{ color: "#007A8E" }}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
