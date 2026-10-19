import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rng, settle, tween } from "../anim";
import { C } from "../theme";

// 0–6s. Editor types itself in, red badge expands once, everything freezes at 60%,
// scene desaturates. One slow push-in, no cuts.

export const BADGE_AT = 146; // "...Copilot báo hết credit"
export const FREEZE_AT = 150;
const TYPE_START = 4;
const SPEED = 30; // px per frame

const WIN_W = 780;
const WIN_H = 1020;
const LINE_H = 50;
const CODE_X = 96;
const CODE_W = WIN_W - CODE_X - 48;

type Seg = { w: number; color: string };
type Line = { indent: number; segs: Seg[]; start: number; len: number };

const LINES: Line[] = (() => {
  const r = rng(7);
  const palette = [C.d5, C.d5, C.dAccent, "#4E5A6C", "#5B4F7A"];
  const indents = [0, 1, 2, 2, 1, 2, 3, 3, 2, 1, 0, 1, 2, 2, 1, 0];
  let t = TYPE_START;
  return indents.map((indent) => {
    const n = 1 + Math.floor(r() * 3);
    const segs = Array.from({ length: n }, () => ({
      w: 50 + Math.floor(r() * 150),
      color: palette[Math.floor(r() * palette.length)],
    }));
    const len = Math.min(
      CODE_W - indent * 40,
      segs.reduce((a, s) => a + s.w + 14, 0),
    );
    const line = { indent, segs, start: t, len };
    t += len / SPEED + 1.5;
    return line;
  });
})();

// Frames where a new line starts typing before the freeze (for keyboard SFX).
export const TYPE_TICKS = LINES.filter((l) => l.start < FREEZE_AT).map((l) => Math.round(l.start));

export const S1Stall: React.FC = () => {
  const fr = useCurrentFrame();
  const t = Math.min(fr, FREEZE_AT); // everything that "works" stops at the freeze
  const frozen = fr >= FREEZE_AT;

  const push = tween(fr, 0, 186, 1, 1.1);
  const desat = tween(fr, FREEZE_AT + 2, FREEZE_AT + 34, 1, 0.16);
  const dim = tween(fr, FREEZE_AT + 2, FREEZE_AT + 34, 1, 0.8);
  const exit = tween(fr, 176, 186, 1, 0);
  const progress = tween(t, 8, 148, 0, 0.6);

  // typing head
  let headLine = 0;
  let headX = 0;
  LINES.forEach((l, i) => {
    if (t >= l.start) {
      headLine = i;
      headX = Math.min(l.len, (t - l.start) * SPEED);
    }
  });

  const badge = settle(fr, BADGE_AT, 9, 160);
  const ring = tween(fr, BADGE_AT, BADGE_AT + 26, 0, 1);

  return (
    <AbsoluteFill style={{ filter: `saturate(${desat}) brightness(${dim})` }}>
      <AbsoluteFill style={{ opacity: exit, transform: `scale(${push})` }}>
        <div
          style={{
            position: "absolute",
            left: (1080 - WIN_W) / 2,
            top: 410,
            width: WIN_W,
            height: WIN_H,
            transform: "perspective(5200px) rotateX(16deg) rotateY(-14deg) rotateZ(3deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* stacked slabs give the window isometric depth */}
          {[3, 2, 1].map((k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 34,
                background: k === 1 ? C.d2 : C.d1,
                border: `2px solid ${C.d3}`,
                transform: `translate(${-16 * k}px, ${18 * k}px)`,
                opacity: 1 - k * 0.22,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 34,
              background: C.d2,
              border: `2px solid ${C.d4}`,
              overflow: "hidden",
            }}
          >
            {/* title bar */}
            <div style={{ height: 70, borderBottom: `2px solid ${C.d3}`, display: "flex", alignItems: "center", paddingLeft: 30, gap: 14 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: C.d4 }} />
              ))}
              <div style={{ marginLeft: 36, width: 170, height: 34, borderRadius: 10, background: C.d3 }} />
              <div style={{ width: 120, height: 34, borderRadius: 10, background: C.d1 }} />
            </div>
            {/* gutter + code */}
            {LINES.map((l, i) => {
              const shown = t >= l.start ? Math.min(l.len, (t - l.start) * SPEED) : 0;
              let x = 0;
              return (
                <div key={i} style={{ position: "absolute", top: 104 + i * LINE_H, left: 0, width: WIN_W, height: LINE_H }}>
                  <div style={{ position: "absolute", left: 34, top: 20, width: 26, height: 8, borderRadius: 4, background: t >= l.start ? C.d4 : C.d3 }} />
                  <div style={{ position: "absolute", left: CODE_X + l.indent * 40, top: 16, height: 16, width: shown, overflow: "hidden" }}>
                    {l.segs.map((s, j) => {
                      const el = (
                        <div key={j} style={{ position: "absolute", left: x, top: 0, width: s.w, height: 16, borderRadius: 8, background: s.color }} />
                      );
                      x += s.w + 14;
                      return el;
                    })}
                  </div>
                </div>
              );
            })}
            {/* cursor: solid while typing, greyed once frozen */}
            <div
              style={{
                position: "absolute",
                left: CODE_X + LINES[headLine].indent * 40 + headX + 6,
                top: 104 + headLine * LINE_H + 8,
                width: 14,
                height: 32,
                borderRadius: 3,
                background: frozen ? C.d5 : C.accent,
              }}
            />
            {/* status bar with progress */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 86, borderTop: `2px solid ${C.d3}`, background: C.d1 }}>
              <div style={{ position: "absolute", left: 36, top: 36, width: 380, height: 14, borderRadius: 7, background: C.d3 }}>
                <div style={{ width: `${(progress / 1) * 100}%`, height: "100%", borderRadius: 7, background: C.accent }} />
              </div>
              <div style={{ position: "absolute", right: 36, top: 34, width: 90, height: 18, borderRadius: 9, background: C.d3 }} />
            </div>
          </div>
          {/* blocked badge, expands once */}
          <div style={{ position: "absolute", right: 22, top: -4, width: 78, height: 78 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `4px solid ${C.blocked}`,
                transform: `scale(${1 + ring * 1.4})`,
                opacity: (1 - ring) * 0.8 * (ring > 0 ? 1 : 0),
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: C.blocked,
                transform: `scale(${badge})`,
                boxShadow: "0 0 40px rgba(255,59,74,0.45)",
              }}
            >
              <div style={{ position: "absolute", left: 20, top: 34, width: 38, height: 10, borderRadius: 5, background: C.white }} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
