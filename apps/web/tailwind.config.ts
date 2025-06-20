import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: '#0E7490',
        accent: '#039be5',
        primary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#0E7490',
          600: '#0891B2',
          700: '#0E7490',
        },
        colors: {
          orange: '#F97316',
          teal: '#14B8A6',
          'light-blue': '#0EA5E9',
          cyan: '#06B6D4',
        },
        neu: {
          bg: '#F5F7FA',
          card: '#FFFFFF',
          gray: '#94A3B8',
          'gray-dark': '#475569',
        },
      },
      boxShadow: {
        neu: '4px 4px 8px #dbe7f5, -4px -4px 8px #ffffff',
        neuInset: 'inset 4px 4px 8px #CBD5E1, inset -4px -4px 8px #FFFFFF',
        neuHover: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
      },
      backgroundImage: {
        'neu-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 50%, #E2E8F0 100%)',
      },
    },
  },
  plugins: [],
}
export default config 