// Single source of truth for self-hosted fonts (shared by the app and scripts/fetch-fonts.mjs).
export const SUBSETS = ["latin", "latin-ext", "vietnamese"];

export const FONTS = [
  {
    key: "sans",
    family: "Be Vietnam Pro",
    slug: "be-vietnam-pro",
    weights: ["400", "600", "800", "900"],
  },
  {
    key: "mono",
    family: "JetBrains Mono",
    slug: "jetbrains-mono",
    weights: ["400", "700"],
  },
];

export const fontFile = (slug, weight, subset) =>
  `fonts/${slug}-${weight}-${subset}.woff2`;
