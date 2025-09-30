import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#08152B',
          800: '#0A1F44',
          700: '#0F2E6E',
        },
        gold: {
          DEFAULT: '#C49A3A',
          700: '#A97C18',
          300: '#E0C063',
        },
        neutral: {
          bg: '#F5F7FA',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
        },
        dark: {
          bg: '#0F1115',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
