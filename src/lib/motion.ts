import { Easing, interpolate, spring, SpringConfig } from "remotion";

// Shared motion vocabulary. Every scene animates through these few helpers so
// timing feels consistent and each scene file stays about layout, not math.

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  anticipate: Easing.bezier(0.68, -0.4, 0.27, 1.4),
};

/** 0 → 1 over [start, end], clamped. */
export const tween = (
  frame: number,
  start: number,
  end: number,
  easing: (t: number) => number = EASE.out,
) => interpolate(frame, [start, end], [0, 1], { ...CLAMP, easing });

/** Spring that starts at `delay` frames. Safe to call inside .map(). */
export const springAt = (
  frame: number,
  fps: number,
  delay: number,
  config: Partial<SpringConfig> = {},
) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, mass: 0.7, ...config },
  });

/** Shrinks a font size for long copy so edited text never breaks the layout. */
export const fitFont = (text: string, base: number, maxChars: number) =>
  Math.round(base * Math.min(1, maxChars / Math.max(1, text.length)));

/** Decaying impact (1 → 0 over `length` frames) for each hit frame. */
export const impact = (frame: number, hits: number[], length = 10) =>
  hits.reduce((acc, hit) => {
    const d = frame - hit;
    return d >= 0 && d < length ? Math.max(acc, 1 - d / length) : acc;
  }, 0);
