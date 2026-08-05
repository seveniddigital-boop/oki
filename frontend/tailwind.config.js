/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        sans: ['"Satoshi"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        oki: {
          black: 'var(--oki-bg)',
          surface: 'var(--oki-surface)',
          elevated: 'var(--oki-elevated)',
          crimson: '#991B1B',
          crimsonbright: '#C62828',
          gold: 'var(--oki-gold)',
          goldbright: '#E3C888',
          text: 'var(--oki-text)',
          muted: 'var(--oki-muted)',
          faint: 'var(--oki-faint)',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'grid-drift': { from: { backgroundPosition: '0 0' }, to: { backgroundPosition: '120px 120px' } },
        'pulse-slow': { '0%, 100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'grid-drift': 'grid-drift 24s linear infinite',
        'pulse-slow': 'pulse-slow 5s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
