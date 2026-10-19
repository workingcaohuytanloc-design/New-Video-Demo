import { fitText } from "@remotion/layout-utils";
import React from "react";
import { out, tween } from "../anim";
import { DISPLAY } from "../fonts";
import { C } from "../theme";

// Uppercase headline lines. Each line enters with a fast wipe at its own frame and then
// holds perfectly still. Size is fitted so edited copy never overflows the safe width.

const WIPE = 7;

export const Headline: React.FC<{
  fr: number;
  lines: string[];
  at: number[]; // entry frame per line; extra lines follow the last one
  top: number;
  color: string;
  maxSize?: number;
  width?: number;
  separator?: "none" | "dot" | "arrow";
  outAt?: number;
}> = ({ fr, lines, at, top, color, maxSize = 84, width = 820, separator = "none", outAt }) => {
  const markW = separator === "none" ? 0 : 56;
  const size = Math.min(
    maxSize,
    ...lines.map(
      (text, i) =>
        fitText({
          text,
          withinWidth: width - (i > 0 || separator === "dot" ? markW : 0),
          fontFamily: DISPLAY,
          fontWeight: 800,
          textTransform: "uppercase",
        }).fontSize,
    ),
  );
  const startOf = (i: number) => at[Math.min(i, at.length - 1)] + Math.max(0, i - at.length + 1) * 6;
  const gone = outAt === undefined ? 0 : tween(fr, outAt, outAt + WIPE, 0, 1, out);

  return (
    <div style={{ position: "absolute", left: 540 - width / 2, top, width, display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.16 }}>
      {lines.map((text, i) => {
        const p = tween(fr, startOf(i), startOf(i) + WIPE, 0, 1, out);
        const showMark = separator === "dot" || (separator === "arrow" && i > 0);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              clipPath: `inset(-20% ${(1 - p) * 100}% -20% ${gone * 100}%)`,
              position: "relative",
            }}
          >
            {showMark && separator === "dot" && (
              <div style={{ width: size * 0.26, height: size * 0.26, borderRadius: 6, background: C.accent, flexShrink: 0 }} />
            )}
            {showMark && separator === "arrow" && (
              <svg width={size * 0.6} height={size * 0.5} viewBox="0 0 30 24" style={{ flexShrink: 0 }}>
                <path d="M2 12 H25 M17 4 L26 12 L17 20" fill="none" stroke={C.accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: size,
                lineHeight: 1.08,
                color,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
            {/* accent edge riding the wipe */}
            {p > 0 && p < 1 && (
              <div style={{ position: "absolute", top: "8%", bottom: "8%", width: 8, borderRadius: 4, background: C.accent, left: `calc(${p * 100}% - 8px)` }} />
            )}
          </div>
        );
      })}
    </div>
  );
};
