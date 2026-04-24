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
        // EOO Primaire kleuren
        'eoo-marine': '#03173d',
        'eoo-blue': '#208ad0',
        // EOO Secundaire kleuren
        'eoo-violet': '#cba2d6',
        'eoo-pink': '#f39ca4',
        'eoo-yellow': '#fdc652',
        'eoo-green': '#53d4a7',
        'eoo-orange': '#e07f51',
        'eoo-cyan': '#4fb7d2',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
