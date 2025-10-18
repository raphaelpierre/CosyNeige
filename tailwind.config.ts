import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAFAF8',
        // DEPRECATED: 'forest' colors replaced by 'slate' for modern design system
        // Remove after full migration to slate-based design
        /* forest: {
          50: '#f0f7ed',
          100: '#dcecd5',
          200: '#b8d9ab',
          300: '#8ec07b',
          400: '#67a451',
          500: '#4a8736',
          600: '#3a6c2a',
          700: '#2d5016',
          800: '#264419',
          900: '#213a17',
        }, */
        // Accent colors - can be used sparingly for specific elements
        wood: {
          50: '#faf6f3',
          100: '#f0e6db',
          200: '#e1cdb6',
          300: '#cfac8a',
          400: '#be8e68',
          500: '#b07654',
          600: '#a36549',
          700: '#8b4513',
          800: '#723c1a',
          900: '#5d3318',
        },
        alpine: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e293b',
        },
        gold: {
          50: '#fdfbf7',
          100: '#f9f4e8',
          200: '#f3e8cd',
          300: '#ead6a8',
          400: '#e0c080',
          500: '#d4af37',
          600: '#c49a2e',
          700: '#a37f27',
          800: '#856725',
          900: '#6d5521',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
