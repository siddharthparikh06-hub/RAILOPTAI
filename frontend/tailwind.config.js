/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          blue: '#0F2C59',
          navy: '#0B192C',
          dark: '#080E18',
          card: '#111C2E',
          cardLight: '#FFFFFF',
          border: '#1E293B',
          accent: '#0066FF',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          engineering: '#3B82F6', // Engineering blue
          traction: '#F59E0B',     // Traction amber/yellow
          signal: '#10B981',       // Signal green
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
        sans: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
