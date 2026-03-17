/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          light: '#eff6ff',
          muted: '#bfdbfe',
        },
        surface: {
          DEFAULT: '#ffffff',
          raised: '#f1f5f9',
        },
        border: {
          DEFAULT: '#e2e8f0',
          subtle: '#f1f5f9',
        },
        sidebar: {
          DEFAULT: '#0f172a',
          hover: '#1e293b',
          active: '#2563eb',
          text: '#cbd5e1',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.08)',
        header: '0 1px 0 0 #e2e8f0',
      },
    },
  },
  plugins: [],
}
