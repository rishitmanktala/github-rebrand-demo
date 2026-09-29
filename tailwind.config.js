/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0D1117",
        paper: "#F0F6FC",
        "paper-warm": "#EDECE9",
        ink: "#0A0A0A",
        "ship-green": "#2EA043",
        "merge-purple": "#A371F7",
        "review-amber": "#D29922",
        "ai-blue": "#58A6FF",
        "highlight-yellow": "#FFF9A3",
        "diff-red": "#F85149",
        contrib: {
          0: "#161B22",
          1: "#0E4429",
          2: "#006D32",
          3: "#26A641",
          4: "#39D353",
        }
      },
      fontFamily: {
        code: ['"JetBrains Mono"', 'monospace'],
        people: ['Figtree', '"Source Sans 3"', 'sans-serif'],
        display: ['"Inter Tight"', 'sans-serif'],
        classic: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
      }
    },
  },
  plugins: [],
}
