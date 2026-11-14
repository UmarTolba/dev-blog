import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--text-primary)",
        muted: "var(--text-muted)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        rule: "var(--border)",
        "rule-strong": "var(--border-strong)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      fontFamily: {
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        label: ["var(--step-label)", { lineHeight: "1.2" }],
        meta: ["var(--step-meta)", { lineHeight: "1.5" }],
        body: ["var(--step-body)", { lineHeight: "1.75" }],
        "display-sm": ["var(--step-display-sm)", { lineHeight: "1.05" }],
        display: ["var(--step-display)", { lineHeight: "1" }],
        "display-xl": ["var(--step-display-xl)", { lineHeight: "0.88" }],
      },
      letterSpacing: {
        display: "-0.03em",
        "display-tight": "-0.04em",
        label: "0.14em",
      },
      maxWidth: {
        shell: "76rem",
        measure: "64ch",
      },
      boxShadow: {
        offset: "4px 4px 0 0 var(--text-primary)",
        "offset-accent": "4px 4px 0 0 var(--accent)",
      },
    },
  },
  plugins: [],
}
export default config
