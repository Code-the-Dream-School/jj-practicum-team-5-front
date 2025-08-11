/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // badges
    "border-green-500",
    "text-green-600",
    "bg-green-100",
    "border-orange-500",
    "text-orange-600",
    "bg-orange-100",
    "border-red-500",
    "text-red-600",
    "bg-red-100",
    "border-gray-400",
    "text-gray-600",
    "bg-white",
    // bars
    "bg-green-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-white",
    "border",
    "border-gray-400",
  ],
  theme: { extend: {} },
  plugins: [],
};
