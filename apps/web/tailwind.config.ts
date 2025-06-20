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
        primary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#0E7490',
          600: '#0891B2',
          700: '#0E7490',
        },
        accent: {
          orange: '#F97316',
        },
        neu: {
          bg: '#F5F7FA',
          card: '#FFFFFF',
          gray: '#94A3B8',
          'gray-dark': '#475569',
        },
      },
      boxShadow: {
        neu: '4px 4px 8px #CBD5E1, -4px -4px 8px #FFFFFF',
        neuInset: 'inset 4px 4px 8px #CBD5E1, inset -4px -4px 8px #FFFFFF',
        neuHover: '6px 6px 12px #CBD5E1, -6px -6px 12px #FFFFFF',
      },
      backgroundImage: {
        'neu-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 50%, #E2E8F0 100%)',
      },
    },
  },
  plugins: [],
}
export default config 