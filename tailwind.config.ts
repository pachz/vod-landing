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
        pink: {
          900: '#B85C89',
          700: '#D774A0',
          500: '#EA8BB8', // main
          300: '#F4B6D1',
          100: '#FBE4EE',
        },
        purple: {
          900: '#2E0F38',
          800: '#3A1547',
          700: '#4A235A', // main
          500: '#6C3483',
          300: '#A569BD',
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
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
export default config
