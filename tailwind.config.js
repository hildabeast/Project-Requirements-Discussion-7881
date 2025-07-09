/** @type {import('tailwindcss').Config} */
export default {
  // FIXED: Ensure content includes all files that might contain Tailwind classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  // Add safelist for classes that might be dynamically generated
  safelist: [
    'bg-blue-50',
    'bg-blue-100',
    'bg-green-50',
    'bg-green-100',
    'bg-purple-50',
    'bg-purple-100',
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
  ],
  plugins: [],
}