import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'primary-pattern' : "url('/bg-pattern.png')",
      },
      colors :{
        'primary-200' : '#6ee7b7',
        'primary-400' : '#22c55e',
        'primary-800' : '#15803d'
      },
    },
  },
  plugins: [],
}
export default config
