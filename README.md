# New Video Demo — Ordex 30s vertical ad

A 30-second, 9:16 (1080×1920, 30fps) motion-graphics ad. The design was planned with the [/brag](https://github.com/latent-spaces/brag) skill set: plan, storyboard, tone, music, SFX and delivery steps. Remotion is used only as the editor and renderer.

- Final video: `brag-output/brag.mp4` (poster baked into frame 0, audio mastered to −14 LUFS)
- Poster: `brag-output/brag.jpg`
- Plan and storyboard, with voiceover sync table: `brag-output/brag-plan.md`
- Share caption: `brag-output/share-copy.txt`

The picture has no text, letters, numbers or logos, so headline and CTA copy can be laid over it in post. The empty middle band of the end card is reserved for that.

## Structure

```
src/timeline.ts      scene ranges, hard cut, voiceover speech map (all timing lives here
                     and in the *_AT constants at the top of each scene)
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

The delivered `brag.mp4` additionally went through the Brag delivery step: the poster frame (21.5s) was baked into frame 0, and the audio was two-pass loudnorm'd to −14 LUFS.

## Credits

- Music: "Happy Beats / Business Moves vol. 12" by [ende.app](https://ende.app/en), bundled with /brag. Verify the license terms before publishing the ad commercially.
- SFX: [Kenney](https://kenney.nl/) (CC0) and the Keyboard Soundpack #1 by unicae_games (CC0), bundled with /brag.
