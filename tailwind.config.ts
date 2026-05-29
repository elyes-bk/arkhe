import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      },
    },
  },
  plugins: [],
};
export default config;
