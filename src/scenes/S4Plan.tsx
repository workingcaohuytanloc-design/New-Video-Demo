import { fitText } from "@remotion/layout-utils";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { musicEnergy, settle, tween } from "../anim";
import { DISPLAY, MONO } from "../fonts";
import { Check } from "../parts/Check";
import { Headline } from "../parts/Headline";
import { Logo } from "../parts/Logo";
import type { SceneText, VideoProps } from "../schema";
import { C, shadowSoft, textDark, textMuted } from "../theme";
import { SCENES } from "../timeline";

// 14.5–22.9s. Isometric file tree on the left lights up node by node; three nodes highlight
// with code scrolling inside them. The 3-step plan panel slides open on the right and checks
// off. Green diff bars flow down the tree and into the panel. The "fine-tuned for coding" chip
// lands top-right, the token counter ticks up slowly and flattens while a ghost spike fades.

export const LIGHT_START = 3; // "Ordex đọc hiểu codebase" 14.52s
export const LIGHT_STEP = 4;
export const PANEL_AT = 49; // beat-locked: 16.13s (track strong cue 15.84s), "tự lên kế hoạch"
export const HIGHLIGHT_AT = 72; // 16.9s, "sửa đúng chỗ"
export const STEP_AT = [98, 131, 164]; // beat-locked: 17.76 / 18.85 / 19.95s (strong cues)
export const CHIP_AT = 132; // "fine-tune" ≈ 18.9s
export const HEADLINE_AT = [3, 74, 210]; // "đọc hiểu codebase" / "sửa đúng chỗ" / "tốn ít token hơn"
const FLOW = [75, 226];
const METER_AT = 153; // 19.6s
const GHOST_AT = 192;

// Tree in (depth, spread) plane units; projected isometrically by CSS.
type Node = { id: string; d: number; s: number; parent?: string };
const NODES: Node[] = [
  { id: "R", d: -450, s: 0 },
  { id: "A", d: -150, s: -280, parent: "R" },
  { id: "B", d: -150, s: 280, parent: "R" },
  { id: "A1", d: 150, s: -440, parent: "A" },
  { id: "A2", d: 150, s: -140, parent: "A" },
  { id: "B1", d: 150, s: 140, parent: "B" },
  { id: "B2", d: 150, s: 440, parent: "B" },
  { id: "A2a", d: 450, s: -260, parent: "A2" },
  { id: "A2b", d: 450, s: -40, parent: "A2" },
  { id: "B1a", d: 450, s: 140, parent: "B1" },
  { id: "B2a", d: 450, s: 380, parent: "B2" },
];
const HIGHLIGHTED = ["A1", "A2b", "B2a"];
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const uv = (n: Node) => ({ u: (n.d + n.s) / 2, v: (n.d - n.s) / 2 });

const pathTo = (id: string): Node[] => {
  const out: Node[] = [];
  let n: Node | undefined = byId[id];
  while (n) {
    out.unshift(n);
    n = n.parent ? byId[n.parent] : undefined;
  }
  return out;
};
const onHighlightPath = new Set(HIGHLIGHTED.flatMap((id) => pathTo(id).map((n) => n.id)));

const TREE = { x: 440, y: 620, scale: 0.82 };
const TILE = 92;
const LAYERS = 7;

const Tile: React.FC<{ n: Node; lit: number; hi: number; idx: number; fr: number }> = ({ n, lit, hi, fr }) => {
  const { u, v } = uv(n);
  const lift = hi * 14 + (hi > 0 ? (1 - settle(fr, HIGHLIGHT_AT, 9, 170)) * -10 : 0);
  const face = hi > 0.5 ? C.accent : lit > 0.5 ? C.white : C.l1;
  const side = hi > 0.5 ? "#1F4FD6" : lit > 0.5 ? C.l3 : C.l2;
  return (
    <div
      style={{
        position: "absolute",
        left: u - TILE / 2,
        top: v - TILE / 2,
        width: TILE,
        height: TILE,
        transformStyle: "preserve-3d",
        transform: `translateZ(${lift}px)`,
      }}
    >
      {Array.from({ length: LAYERS }, (_, k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            background: k === LAYERS - 1 ? face : side,
            transform: `translateZ(${k * 3.2}px)`,
            boxShadow: k === 0 ? "0 0 0 1px rgba(11,15,20,0.04), 18px 18px 28px rgba(11,15,20,0.10)" : undefined,
            border: k === LAYERS - 1 && hi < 0.5 ? `4px solid ${lit > 0.5 ? C.accent : C.l3}` : undefined,
            boxSizing: "border-box",
            overflow: k === LAYERS - 1 ? "hidden" : undefined,
          }}
        >
          {/* code scrolling inside highlighted nodes */}
          {k === LAYERS - 1 && hi > 0.5 &&
            [0, 1, 2, 3, 4, 5, 6, 7].map((b) => (
              <div
                key={b}
                style={{
                  position: "absolute",
                  left: 16 + (b % 3) * 8,
                  top: ((b * 16 - fr * 1.4) % 128 + 128) % 128 - 18,
                  width: [44, 30, 52, 24, 40, 34, 48, 28][b],
                  height: 6,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.75)",
                }}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

// Point along a node path at progress p (0..1), with the heading angle in plane space.
const along = (path: Node[], p: number) => {
  const pts = path.map(uv);
  const segs = pts.slice(1).map((b, i) => {
    const a = pts[i];
    return { a, b, len: Math.hypot(b.u - a.u, b.v - a.v) };
  });
  const total = segs.reduce((s, x) => s + x.len, 0);
  let dist = p * total;
  for (const sg of segs) {
    if (dist <= sg.len) {
      const k = dist / sg.len;
      return {
        u: sg.a.u + (sg.b.u - sg.a.u) * k,
        v: sg.a.v + (sg.b.v - sg.a.v) * k,
        ang: (Math.atan2(sg.b.v - sg.a.v, sg.b.u - sg.a.u) * 180) / Math.PI,
      };
    }
    dist -= sg.len;
  }
  const last = segs[segs.length - 1];
  return { u: last.b.u, v: last.b.v, ang: (Math.atan2(last.b.v - last.a.v, last.b.u - last.a.u) * 180) / Math.PI };
};

const Tree: React.FC<{ fr: number }> = ({ fr }) => {
  const order = NODES.map((n) => n.id);
  const hiAll = tween(fr, HIGHLIGHT_AT, HIGHLIGHT_AT + 6, 0, 1);
  const flowing = fr >= FLOW[0] && fr < FLOW[1];
  const flowFade = tween(fr, FLOW[0], FLOW[0] + 8, 0, 1) * tween(fr, FLOW[1] - 14, FLOW[1], 1, 0);

  return (
    <div
      style={{
        position: "absolute",
        left: TREE.x,
        top: TREE.y,
        width: 0,
        height: 0,
        transformStyle: "preserve-3d",
        transform: `scale(${TREE.scale}) rotateX(54deg) rotateZ(45deg)`,
      }}
    >
      <svg width={1600} height={1600} style={{ position: "absolute", left: -800, top: -800, overflow: "visible" }}>
        {NODES.filter((n) => n.parent).map((n) => {
          const a = uv(byId[n.parent!]);
          const b = uv(n);
          const litLine = tween(fr, LIGHT_START + order.indexOf(n.id) * LIGHT_STEP, LIGHT_START + order.indexOf(n.id) * LIGHT_STEP + 6);
          const hiLine = onHighlightPath.has(n.id) ? hiAll : 0;
          return (
            <g key={n.id}>
              <line x1={a.u + 800} y1={a.v + 800} x2={b.u + 800} y2={b.v + 800} stroke={C.l2} strokeWidth={10} strokeLinecap="round" />
              <line
                x1={a.u + 800}
                y1={a.v + 800}
                x2={b.u + 800}
                y2={b.v + 800}
                stroke={hiLine > 0 ? C.accent : C.l4}
                strokeWidth={10}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - Math.max(litLine, hiLine)}
                opacity={hiLine > 0 ? 0.55 + hiLine * 0.45 : 0.7}
              />
            </g>
          );
        })}
      </svg>
      {flowing &&
        HIGHLIGHTED.flatMap((id, pi) =>
          [0, 1, 2, 3].map((k) => {
            const period = 42;
            const p = (((fr - FLOW[0] - pi * 9 - k * (period / 4)) % period) + period) % period / period;
            const pt = along(pathTo(id), p);
            const w = k % 2 ? 46 : 64;
            return (
              <div
                key={`${id}-${k}`}
                style={{
                  position: "absolute",
                  left: pt.u - w / 2,
                  top: pt.v - 9,
                  width: w,
                  height: 18,
                  borderRadius: 9,
                  background: C.diff,
                  opacity: flowFade * Math.min(1, p * 6, (1 - p) * 6),
                  transform: `translateZ(14px) rotate(${pt.ang}deg)`,
                }}
              />
            );
          }),
        )}
      {NODES.map((n, i) => (
        <Tile
          key={n.id}
          n={n}
          idx={i}
          fr={fr}
          lit={tween(fr, LIGHT_START + i * LIGHT_STEP, LIGHT_START + i * LIGHT_STEP + 4)}
          hi={HIGHLIGHTED.includes(n.id) ? hiAll : 0}
        />
      ))}
    </div>
  );
};

const PANEL = { x: 470, y: 900, w: 480, h: 390 };

// Screen position of a tree node (matches the CSS projection above), for the diff stream.
const screenOf = (id: string) => {
  const { u, v } = uv(byId[id]);
  const k = TREE.scale;
  return { x: TREE.x + ((u - v) / Math.SQRT2) * k, y: TREE.y + ((u + v) / Math.SQRT2) * Math.cos((54 * Math.PI) / 180) * k };
};

const DiffStream: React.FC<{ fr: number }> = ({ fr }) => {
  const from = screenOf("B2a");
  const top = from.y + 30;
  const bottom = PANEL.y + 4;
  const on = tween(fr, FLOW[0] + 6, FLOW[0] + 14, 0, 1) * tween(fr, FLOW[1] - 14, FLOW[1], 1, 0);
  return (
    <div style={{ position: "absolute", left: from.x - 8, top, width: 16, height: bottom - top, overflow: "hidden", opacity: on }}>
      {[0, 1, 2, 3].map((k) => {
        const y = (((fr - FLOW[0]) * 3.2 + k * 30) % 120) - 20;
        return <div key={k} style={{ position: "absolute", left: 3, top: y, width: 10, height: 22, borderRadius: 5, background: C.diff }} />;
      })}
    </div>
  );
};

const PlanPanel: React.FC<{ fr: number; steps: string[] }> = ({ fr, steps }) => {
  const open = tween(fr, PANEL_AT, PANEL_AT + 16, 0, 1);
  const textW = PANEL.w - 40 * 2 - 46 - 22;
  return (
    <div
      style={{
        position: "absolute",
        left: PANEL.x,
        top: PANEL.y,
        width: PANEL.w,
        height: PANEL.h,
        borderRadius: 32,
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 100%)",
        border: `1px solid ${C.l2}`,
        boxShadow: shadowSoft,
        clipPath: `inset(0 0 ${(1 - open) * 100}% 0 round 32px)`,
        transform: `translateX(${(1 - open) * 60}px)`,
        opacity: open > 0 ? 1 : 0,
      }}
    >
      <div style={{ position: "absolute", left: 32, top: 28, display: "flex", alignItems: "center", gap: 16 }}>
        <Logo size={46} />
        <div style={{ width: 150, height: 14, borderRadius: 7, background: C.l2 }} />
      </div>
      <div style={{ position: "absolute", right: 32, top: 40, display: "flex", gap: 8 }}>
        {[0, 1, 2].map((d) => (
          <div key={d} style={{ width: 10, height: 10, borderRadius: 5, background: d < STEP_AT.filter((t) => fr >= t).length ? C.accent : C.l2 }} />
        ))}
      </div>
      {steps.slice(0, 3).map((step, i) => {
        const p = tween(fr, STEP_AT[i], STEP_AT[i] + 12, 0, 1);
        const rowIn = tween(fr, PANEL_AT + 8 + i * 4, PANEL_AT + 18 + i * 4, 0, 1);
        const size = Math.min(30, fitText({ text: step, withinWidth: textW, fontFamily: DISPLAY, fontWeight: 700 }).fontSize);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 110 + i * 92,
              height: 76,
              display: "flex",
              alignItems: "center",
              gap: 22,
              borderRadius: 18,
              opacity: rowIn,
              transform: `translateY(${(1 - rowIn) * 14}px)`,
            }}
          >
            <Check size={46} p={p} />
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: size, color: p > 0.5 ? textDark : textMuted, whiteSpace: "nowrap" }}>{step}</div>
          </div>
        );
      })}
    </div>
  );
};

const TokenCounter: React.FC<{ fr: number; label: string; value: number }> = ({ fr, label, value }) => {
  const show = tween(fr, METER_AT, METER_AT + 12, 0, 1);
  const count = tween(fr, METER_AT + 4, METER_AT + 64, 0, 1, (x) => 1 - Math.pow(1 - x, 3));
  const ghostDraw = tween(fr, GHOST_AT, GHOST_AT + 20, 0, 1);
  const ghostFade = tween(fr, GHOST_AT + 22, GHOST_AT + 42, 1, 0);
  const flat = tween(fr, METER_AT + 4, METER_AT + 64, 0, 1);
  return (
    <div
      style={{
        position: "absolute",
        left: 130,
        top: 980,
        width: 310,
        height: 210,
        borderRadius: 30,
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 100%)",
        border: `1px solid ${C.l2}`,
        boxShadow: shadowSoft,
        opacity: show,
        transform: `translateY(${(1 - show) * 24}px)`,
        overflow: "hidden",
      }}
    >
      <svg width={310} height={210} style={{ position: "absolute", inset: 0 }}>
        <polyline
          points="24,170 120,168 170,160 205,120 228,40 248,140 272,118 290,126"
          fill="none"
          stroke={C.l4}
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - ghostDraw}
          opacity={0.55 * ghostFade * (ghostDraw > 0 ? 1 : 0)}
        />
        <line x1={24} y1={172} x2={24 + 262 * flat} y2={172} stroke={C.accent} strokeWidth={6} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 28, top: 26, fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: "0.16em", color: textMuted, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ position: "absolute", left: 26, top: 62, fontFamily: MONO, fontWeight: 500, fontSize: 64, color: textDark, fontVariantNumeric: "tabular-nums" }}>
        {Math.round(value * count).toLocaleString("vi-VN")}
      </div>
    </div>
  );
};

const Chip: React.FC<{ fr: number; label: string }> = ({ fr, label }) => {
  const p = tween(fr, CHIP_AT, CHIP_AT + 7, 0, 1);
  if (!label) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 130,
        top: 236,
        height: 64,
        padding: "0 26px 0 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        borderRadius: 32,
        background: C.white,
        border: `2px solid ${C.accentSoft}`,
        boxShadow: shadowSoft,
        clipPath: `inset(-30% ${(1 - p) * 100}% -30% 0 round 32px)`,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 28,
        color: textDark,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: 7, background: C.accent }} />
      {label}
    </div>
  );
};

export const S4Plan: React.FC<{ text: SceneText; counter: { label: string; value: VideoProps["counterValue"] } }> = ({ text, counter }) => {
  const fr = useCurrentFrame();
  const enter = tween(fr, 0, 14, 0, 1);
  const exit = tween(fr, 226, 244, 0, 1);
  const glow = musicEnergy(SCENES.plan[0] + fr);
  const drift = tween(fr, 0, 252, 0, 1);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - exit), transform: `translateX(${exit * -140}px)` }}>
      <AbsoluteFill style={{ transform: `translateY(${-drift * 16}px) scale(${1 + drift * 0.02})` }}>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 300,
            width: 760,
            height: 660,
            background: `radial-gradient(ellipse at 50% 55%, rgba(28,155,255,${0.05 + 0.12 * glow * tween(fr, HIGHLIGHT_AT, HIGHLIGHT_AT + 10)}) 0%, rgba(28,155,255,0) 60%)`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - enter) * 50}px)` }}>
          <Tree fr={fr} />
        </div>
        <DiffStream fr={fr} />
        <PlanPanel fr={fr} steps={text.items} />
        <TokenCounter fr={fr} label={counter.label} value={counter.value} />
      </AbsoluteFill>
      <Chip fr={fr} label={text.badge} />
      <Headline fr={fr} lines={text.headline} at={HEADLINE_AT} top={1360} color={textDark} maxSize={76} separator="dot" />
    </AbsoluteFill>
  );
};
