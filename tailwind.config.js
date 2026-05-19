/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'iskcon-orange': '#FF7F00',
        'iskcon-orange-dark': '#CC6600',
        'iskcon-blue': '#0066CC',
        'iskcon-green': '#228B22',
        'iskcon-gold': '#FFD700',
        'iskcon-saffron': '#FF9933',
      },
      fontFamily: {
        sanskrit: ['var(--font-tiro-bangla)', 'var(--font-poppins)', 'Poppins', 'serif'],
        primary: ['var(--font-inter)', 'Inter', 'sans-serif'],
        bangla: ['var(--font-tiro-bangla)', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'lotus-pattern': "none",
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        shimmer: 'shimmer 1.5s infinite',
        'aura': 'aura 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '-100% 0' },
        },
        aura: {
          '0%, 100%': { opacity: 0.5, scale: 1 },
          '50%': { opacity: 0.8, scale: 1.05 },
        }
      },
    },
  },
  plugins: [],
}