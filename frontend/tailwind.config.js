/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parvaii: {
          navy: "#0B162A",
          'navy-light': "#162544",
          'navy-hover': "#111f38",
          beige: "#C9B7A5",
          'beige-light': "#F5F0EB",
          'beige-dark': "#A8927E",
          bg: "#F8F9FC",
          card: "#FFFFFF",
          border: "#E5E7EB",
          muted: "#64748B",
          text: "#0B162A",
        },
        status: {
          sold: { bg: "#EBFDF3", text: "#027A48", border: "#A6F4C5" },
          processing: { bg: "#FFFAEB", text: "#B54708", border: "#FEDF89" },
          pending: { bg: "#EFF8FF", text: "#175CD3", border: "#B2DDFF" },
          cancelled: { bg: "#FEF3F2", text: "#B42318", border: "#FECDCA" },
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(11, 22, 42, 0.04), 0 1px 2px -1px rgba(11, 22, 42, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(11, 22, 42, 0.08), 0 2px 4px -2px rgba(11, 22, 42, 0.06)',
      }
    },
  },
  plugins: [],
}

