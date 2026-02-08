/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        samarth: {
          bg: "#F8FAFC",
          white: "#FFFFFF",
          "blue-900": "#0B3D91",
          "blue-700": "#1565D8",
          "blue-500": "#2B7CE9",
          "blue-300": "#90C3FF",
          "red-600": "#E53935",
          "red-400": "#FF7A75",
          gray: {
            600: "#6B7280",
            200: "#E5E7EB",
          },
        },
      },
    },
  },
  plugins: [],
}
