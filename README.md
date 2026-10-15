# Orthex Motion Showreel

A 15-second motion-design showreel for Orthex (1920×1080, 30 fps, 450 frames), built in Remotion.

| # | Scene | Technique |
|---|-------|-----------|
| 1 | Intro | Self-drawing blueprint grid, shockwave rings, masked character reveal |
| 2 | Manifesto | Kinetic type on the beat: camera shake, flash, outline marquee, rotating badge |
| 3 | SmartStore | Isometric boxes dropping and stacking with springs, synced checklist |
| 4 | Brands | CSS 3D cube with snap-and-hold rotation, orbit rings, particle field |
| 5 | Code | Typewriter JSX with syntax highlighting, stat count-up |
| 6 | Outro | Three dots merge and flood the frame, wordmark light sweep, CTA |

A REC/timecode HUD, film grain and vignette sit on top of every scene. Scenes are joined with push-cut, clock-wipe, iris, slide and wipe transitions.

## Commands

```bash
npm i
npm run dev      # Remotion Studio
npm run render   # render out/orthex-showreel.mp4 from content.json
npm run lint     # eslint + tsc
npm run fonts    # re-download self-hosted fonts into public/fonts
```

## Editing text (no code changes needed)

Every piece of on-screen text is a prop. You can change it in either of two places:

1. **Studio**: `npm run dev`, open `OrthexShowreel`, edit in the Props panel, then click Save to write it back to `src/Root.tsx`.
2. **`content.json`**: edit the file, then run `npm run render` (handy for rendering several versions in a batch).

| Field | Meaning |
|-------|---------|
| `brand` | Brand name (HUD, outro wordmark, file name in the editor) |
| `hudLeft` / `hudRight` | HUD labels at the top left and bottom left |
| `cta`, `url` | Call-to-action button in the last scene |
| `colors.ink / paper / accent / accent2` | Brand palette |
| `scenes[i].kicker` | Small label above the title |
| `scenes[i].title` | Scene title (in scene 5, a number is animated as a count-up) |
| `scenes[i].subtitle` | Short description |
| `scenes[i].items` | Scene 2: beat words · 3: checklist · 4: cube faces (up to 4) · 5: lines of code |

Long copy shrinks automatically (`fitFont`) and wraps by whole words. Fonts (Be Vietnam Pro and JetBrains Mono) include the Vietnamese subset.

## Code structure

```
src/
  Root.tsx              Composition + inline defaultProps
  schema.ts             Zod schema (single source of truth for props)
  Showreel.tsx          TransitionSeries for the 6 scenes + overlays
  lib/motion.ts         Shared motion vocabulary: tween, springAt, impact, fitFont, EASE
  lib/theme.tsx         Theme context (colors + fonts), loads self-hosted fonts
  lib/font-manifest.mjs Font list shared by the app and scripts/fetch-fonts.mjs
  components/           SplitText, Kicker, Hud, Grain (reused by every scene)
  scenes/               One file per scene
```
