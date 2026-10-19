import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { BADGE_AT, FREEZE_AT, HEADLINE_AT as S1_LINES } from "./scenes/S1Stall";
import { CARD_IN, SNAP_AT, STRIKE_AT } from "./scenes/S2Blocked";
import { JOIN_AT, MARK_AT } from "./scenes/S3Reconnect";
import { CHIP_AT, HIGHLIGHT_AT, LIGHT_START, LIGHT_STEP, PANEL_AT, STEP_AT } from "./scenes/S4Plan";
import { DOCK_AT, FLY_AT, ROW_START, ROW_STEP, UNDO_TAP } from "./scenes/S5Ticket";
import { BUTTON_AT } from "./scenes/S6EndCard";
import { FPS, SCENES, VO_SPEECH } from "./timeline";

// Voiceover on top. Music stem (built by scripts/prepare-audio.sh): muffled through Act 1,
// opened at the cut, ducked under speech and lifted in the longer pauses.
// SFX from the /brag library, placed on the visual events they belong to, mixed under the bed.

type Cue = { at: number; src: string; vol: number };

const at = (scene: keyof typeof SCENES, local: number) => SCENES[scene][0] + local;
const KEYS = ["003", "012", "007", "024", "018", "029"];

const cues = (rows: number): Cue[] => [
  // Act 1: soft key ticks under the headline wipes, then the badge slams in
  ...S1_LINES.map((t, i) => ({ at: t, src: `keyboard/keypress-${KEYS[i % KEYS.length]}.wav`, vol: 0.22 })),
  { at: BADGE_AT, src: "impact/impactSoft_medium_001.ogg", vol: 0.6 },
  { at: BADGE_AT + 1, src: "interface/error_005.ogg", vol: 0.4 },
  { at: FREEZE_AT, src: "impact/impactSoft_heavy_003.ogg", vol: 0.55 },
  ...CARD_IN.map((t) => ({ at: at("blocked", t), src: "casino/card-slide-1.ogg", vol: 0.28 })),
  ...STRIKE_AT.map((t) => ({ at: at("blocked", t), src: "impact/impactSoft_medium_002.ogg", vol: 0.6 })),
  { at: at("blocked", SNAP_AT), src: "impact/impactWood_medium_003.ogg", vol: 0.55 },
  // Act 2
  { at: at("reconnect", 0), src: "impact/impactSoft_medium_001.ogg", vol: 0.7 },
  { at: at("reconnect", JOIN_AT), src: "ui/rollover2.ogg", vol: 0.35 },
  { at: at("reconnect", MARK_AT), src: "impact/impactBell_heavy_000.ogg", vol: 0.42 },
  { at: at("plan", LIGHT_START), src: "ui/click2.ogg", vol: 0.28 },
  { at: at("plan", LIGHT_START + LIGHT_STEP * 10), src: "ui/click2.ogg", vol: 0.28 },
  { at: at("plan", PANEL_AT), src: "interface/drop_001.ogg", vol: 0.5 },
  { at: at("plan", HIGHLIGHT_AT), src: "interface/switch_002.ogg", vol: 0.4 },
  { at: at("plan", CHIP_AT), src: "ui/rollover2.ogg", vol: 0.3 },
  ...STEP_AT.map((t) => ({ at: at("plan", t), src: "interface/click_003.ogg", vol: 0.55 })),
  { at: at("ticket", FLY_AT), src: "casino/card-slide-1.ogg", vol: 0.32 },
  { at: at("ticket", DOCK_AT), src: "interface/drop_001.ogg", vol: 0.6 },
  ...Array.from({ length: rows }, (_, i) => ({ at: at("ticket", ROW_START + i * ROW_STEP), src: "interface/click_002.ogg", vol: 0.4 })),
  { at: at("ticket", UNDO_TAP), src: "ui/mouseclick1.ogg", vol: 0.5 },
  { at: at("ticket", UNDO_TAP + 3), src: "interface/switch_002.ogg", vol: 0.35 },
  { at: at("endCard", 0), src: "impact/impactBell_heavy_003.ogg", vol: 0.45 },
  { at: at("endCard", BUTTON_AT), src: "interface/drop_001.ogg", vol: 0.45 },
];

// Ducking: gaps under 0.8s count as speech, so the bed does not pump between phrases.
const MUSIC_UP = 0.32;
const MUSIC_DUCKED = 0.16;
const RAMP = 8;
const ducked = VO_SPEECH.reduce<[number, number][]>((acc, [a, b]) => {
  const last = acc[acc.length - 1];
  if (last && a - last[1] < 0.8) last[1] = b;
  else acc.push([a, b]);
  return acc;
}, []).map(([a, b]) => [Math.round(a * FPS), Math.round(b * FPS)] as const);

const musicVolume = (fr: number) => {
  let duck = 0;
  for (const [a, b] of ducked) {
    duck = Math.max(
      duck,
      interpolate(fr, [a - RAMP, a, b, b + RAMP * 2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    );
  }
  return MUSIC_UP + (MUSIC_DUCKED - MUSIC_UP) * duck;
};

export const Soundtrack: React.FC<{ rows: number }> = ({ rows }) => (
  <>
    <Audio src={staticFile("audio/voiceover.mp3")} volume={1} />
    <Audio src={staticFile("audio/music-stem.m4a")} volume={musicVolume} />
    {cues(rows).map((c, i) => (
      <Sequence key={i} from={c.at} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${c.src}`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
