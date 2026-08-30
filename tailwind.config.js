/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          navy: '#1a3a52',
          accent: '#0066cc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gov-sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'gov-md': '0 4px 6px -1px rgba(15, 23, 42, 0.1)',
        'gov-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
      },
      spacing: {
        'sidebar': '280px',
        'header': '72px',
      },
    },
  },
  plugins: [],
}
