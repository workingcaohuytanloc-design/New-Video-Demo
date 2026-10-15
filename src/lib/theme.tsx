import { loadFont } from "@remotion/fonts";
import { getInfo as sansInfo } from "@remotion/google-fonts/BeVietnamPro";
import { getInfo as monoInfo } from "@remotion/google-fonts/JetBrainsMono";
import { createContext, useContext } from "react";
import { staticFile } from "remotion";
import { ShowreelProps } from "../schema";
import { FONTS, SUBSETS, fontFile } from "./font-manifest.mjs";

// Fonts are self-hosted in public/fonts (see `npm run fonts`), so renders work
// offline. unicode-range comes from the Google Fonts metadata, so each subset —
// including Vietnamese diacritics — only downloads when a glyph needs it.
const ranges = {
  sans: sansInfo().unicodeRanges,
  mono: monoInfo().unicodeRanges,
};

for (const font of FONTS) {
  for (const weight of font.weights) {
    for (const subset of SUBSETS) {
      loadFont({
        family: font.family,
        url: staticFile(fontFile(font.slug, weight, subset)),
        weight,
        unicodeRange:
          ranges[font.key as keyof typeof ranges][subset as "latin"],
      });
    }
  }
}

const sans = `"${FONTS[0].family}", sans-serif`;
const mono = `"${FONTS[1].family}", monospace`;

export type Theme = ShowreelProps["colors"] & {
  brand: string;
  sans: string;
  mono: string;
};

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider: React.FC<{
  props: ShowreelProps;
  children: React.ReactNode;
}> = ({ props, children }) => (
  <ThemeContext.Provider
    value={{ ...props.colors, brand: props.brand, sans, mono }}
  >
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme() must be used inside <ThemeProvider>");
  }
  return theme;
};
