# New Video Demo — Orthex 30s vertical ad

A 30-second, 9:16 (1080×1920, 30fps) motion-graphics ad. The design was planned with the [/brag](https://github.com/latent-spaces/brag) skill set: plan, storyboard, tone, music, SFX and delivery steps. Remotion is used only as the editor and renderer.

- Final video: `brag-output/brag.mp4` (poster baked into frame 0, audio mastered to −14 LUFS)
- Poster: `brag-output/brag.jpg`
- Plan and storyboard, with voiceover sync table: `brag-output/brag-plan.md`
- Share caption: `brag-output/share-copy.txt`

## Editing the text

Every word on screen is a prop (schema: `src/schema.ts`). There are two ways to edit it:

1. Run `npm run studio`, open the **Props** panel, edit, and press **Save** (this writes back into `defaultProps` in `src/Root.tsx`).
2. Edit `content.json` and render with `npx remotion render Ad brag-output/brag.mp4 --props=./content.json`.

| Field | What it is |
|---|---|
| `scenes[0].headline` / `.badge` | Scene 1 headline lines / the red "HẾT CREDIT" badge |
| `scenes[1].headline` / `.items` | Scene 2 lower-third lines (one per strike) / the 3 card labels |
| `scenes[2].headline[0]` / `.badge` | Scene 3 wordmark / tagline |
| `scenes[3].headline` / `.badge` / `.items` | Scene 4 lower-third lines / top-right chip / the 3 plan steps |
| `scenes[4].headline` | Scene 5 lines (joined by arrows) |
| `scenes[5].headline` / `.badge` | End-card headline / subline |
| `editor.fileName`, `editor.code` | IDE tab name and the code that scrolls |
| `ticket.key`, `.title`, `.statusBefore`, `.statusAfter` | Jira ticket |
| `log[].time`, `log[].text` | Log rows (the last row is the one undone) |
| `undoLabel`, `counterLabel`, `counterValue` | Undo button, token counter label and final value |
| `cta.button`, `cta.link` | End-card button and download link (`orthex.ai/download` is a placeholder) |

Headline lines appear on voiceover cues set in each scene's `HEADLINE_AT` (or `STRIKE_AT`). Text is auto-fitted to the 820px safe width, so longer copy shrinks instead of overflowing.

## Structure

```
src/timeline.ts      scene ranges, hard cut, voiceover speech map (all timing lives here
                     and in the *_AT constants at the top of each scene)
src/schema.ts        zod schema for every on-screen string (Props panel)
content.json         the same text, for CLI renders / batch versions
src/fonts.ts         Be Vietnam Pro (incl. Vietnamese subset) + JetBrains Mono, bundled locally
src/theme.ts         palette from the brief
src/scenes/S1–S6     one file per scene
src/Soundtrack.tsx   voiceover, ducked music stem, SFX cue list tied to scene events
scripts/prepare-audio.sh  builds the music stem (low-passed Act 1, open Act 2) and the
                          RMS data from the /brag audio library
```

## Commands

```bash
npm install
npm run studio                     # preview in Remotion Studio
BRAG_SKILL_DIR=/path/to/brag/skills/brag npm run audio   # rebuild music stem + SFX copies
npm run render                     # raw render (no poster bake / loudness master)
```

The delivered `brag.mp4` additionally went through the Brag delivery step: the poster frame (21.9s) was baked into frame 0, and the audio was two-pass loudnorm'd to −14 LUFS.

## Credits

- Orthex logo: supplied by the user (`public/brand/orthex-logo.png`).
- Jira mark: from [simple-icons](https://simpleicons.org/) (CC0 data). Jira is a trademark of Atlassian, so check you are allowed to show it in an ad.
- Fonts: Be Vietnam Pro and JetBrains Mono (SIL OFL), via @fontsource.
- Music: "Happy Beats / Business Moves vol. 12" by [ende.app](https://ende.app/en), bundled with /brag. Verify the license terms before publishing the ad commercially.
- SFX: [Kenney](https://kenney.nl/) (CC0) and the Keyboard Soundpack #1 by unicae_games (CC0), bundled with /brag.
