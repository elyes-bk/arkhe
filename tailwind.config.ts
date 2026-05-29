/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arkhe: {
          // Landing
          navy: "#04082e",
          blue: "#0738dc",
          lavender: "#e2e9ff",
          border: "#bdc5df",
          // Main / auth
          primary: "#0738DC",
          dark: "#04082E",
          cyan: "#45DBE4",
          neutral: "#1B1B1D",
          neutral2: "#FFFFFF",
        },
      },
      fontFamily: {
        kumbh: ["var(--font-kumbh)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        heading: ["var(--font-kumbh)", "sans-serif"],
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
      maxWidth: {
        content: "77.5rem",
      },
      backgroundImage: {
        "arkhe-gradient":
          "linear-gradient(135deg, #04082E 0%, #1B1B1D 50%, #0738DC 100%)",
      },
    },
  },
  plugins: [],
};
