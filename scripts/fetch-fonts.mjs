// Downloads the Google Fonts used by the showreel into public/fonts so that
// rendering never depends on network access. Run: npm run fonts
import { mkdir, writeFile } from "node:fs/promises";
import { getInfo as sans } from "@remotion/google-fonts/BeVietnamPro";
import { getInfo as mono } from "@remotion/google-fonts/JetBrainsMono";
import { FONTS, SUBSETS, fontFile } from "../src/lib/font-manifest.mjs";

const infos = { sans: sans(), mono: mono() };
await mkdir("public/fonts", { recursive: true });

for (const font of FONTS) {
  for (const weight of font.weights) {
    for (const subset of SUBSETS) {
      const url = infos[font.key].fonts.normal[weight][subset];
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      const file = `public/${fontFile(font.slug, weight, subset)}`;
      await writeFile(file, Buffer.from(await res.arrayBuffer()));
      console.log("✓", file);
    }
  }
}
