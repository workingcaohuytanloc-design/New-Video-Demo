import { Easing, interpolate, spring } from "remotion";
import rms from "./music-rms.json";
import { FPS } from "./timeline";

export const inOut = Easing.bezier(0.45, 0, 0.55, 1);
export const out = Easing.bezier(0.16, 1, 0.3, 1);

// Eased 0→1 (or a→b) between two frames, clamped.
export const tween = (frame: number, start: number, end: number, a = 0, b = 1, easing = inOut) =>
  interpolate(frame, [start, end], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// Soft bounce used for things that "settle".
export const settle = (frame: number, start: number, damping = 12, stiffness = 120) =>
  spring({ frame: frame - start, fps: FPS, config: { damping, stiffness, mass: 0.9 } });

// Crisp snap with almost no overshoot.
export const snap = (frame: number, start: number) =>
  spring({ frame: frame - start, fps: FPS, config: { damping: 18, stiffness: 320, mass: 0.6 } });

// Deterministic PRNG so every render is identical.
export const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Music energy at an absolute frame, smoothed over ±4 frames. 0..1.
const energy = rms as number[];
export const musicEnergy = (absFrame: number) => {
  let sum = 0;
  let n = 0;
  for (let i = absFrame - 4; i <= absFrame + 4; i++) {
    if (i >= 0 && i < energy.length) {
      sum += energy[i];
      n++;
    }
  }
  return n ? sum / n : 0;
};
