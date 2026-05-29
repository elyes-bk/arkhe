/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
<<<<<<< HEAD
      colors: {
        arkhe: {
          navy: "#04082e",
          blue: "#0738dc",
          lavender: "#e2e9ff",
          border: "#bdc5df",
        },
      },
      fontFamily: {
        kumbh: ["var(--font-kumbh)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      maxWidth: {
        content: "77.5rem",
=======
      fontFamily: {
        // Kumbh Sans pour les structures d'interface et les titres
        heading: ['var(--font-kumbh)', 'sans-serif'],
        // Montserrat pour la lecture globale
        sans: ['var(--font-montserrat)', 'sans-serif'],
>>>>>>> origin/main
      },
      colors: {
        arkhe: {
          primary: '#0738DC',   // Bleu Électrique
          dark: '#04082E',      // Bleu Nuit
          cyan: '#45DBE4',      // Turquoise/Cyan
          neutral: '#1B1B1D',   // Anthracite
          neutral2: '#FFFFFF', // Blanc
        },
      },
      backgroundImage: {
        // Recréation du gradient linéaire présent sur la maquette Figma
        'arkhe-gradient': 'linear-gradient(135deg, #04082E 0%, #1B1B1D 50%, #0738DC 100%)',
      }
    },
  },
  plugins: [],
};