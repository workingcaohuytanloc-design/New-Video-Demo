import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { musicEnergy, settle, tween } from "../anim";
import { Check } from "../parts/Check";
import { C, shadowSoft } from "../theme";
import { SCENES } from "../timeline";

// 14.3–22.9s. Isometric file tree lights up node by node, three nodes highlight,
// a 3-step plan panel slides open and checks off, green diff bars flow down the tree,
// a cost meter stays flat while a ghost spike rises and fades behind it.

export const LIGHT_START = 7; // "Ordex đọc hiểu codebase" 14.52s
export const LIGHT_STEP = 4;
export const PANEL_AT = 55; // beat-locked: 16.13s (track strong cue 15.84s), "tự lên kế hoạch"
export const HIGHLIGHT_AT = 78; // 16.9s, "sửa đúng chỗ"
export const STEP_AT = [104, 137, 170]; // beat-locked: 17.76 / 18.85 / 19.95s (strong cues)
const FLOW = [81, 230];
const METER_AT = 160; // 19.6s, ahead of "nhanh hơn và tốn ít token hơn"
const GHOST_AT = 196;

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
          }}
        />
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
        left: 540,
        top: 640,
        width: 0,
        height: 0,
        transformStyle: "preserve-3d",
        transform: "rotateX(54deg) rotateZ(45deg)",
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

const PlanPanel: React.FC<{ fr: number }> = ({ fr }) => {
  const open = tween(fr, PANEL_AT, PANEL_AT + 18, 0, 1);
  const widths = [
    [430, 260],
    [360, 300],
    [470, 210],
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 130,
        top: 1030,
        width: 820,
        height: 410,
        borderRadius: 32,
        background: C.white,
        boxShadow: shadowSoft,
        clipPath: `inset(0 0 ${(1 - open) * 100}% 0 round 32px)`,
        transform: `translateY(${(1 - open) * 40}px)`,
        opacity: open > 0 ? 1 : 0,
      }}
    >
      <div style={{ position: "absolute", left: 44, top: 44, width: 18, height: 18, borderRadius: 9, background: C.accent }} />
      <div style={{ position: "absolute", left: 80, top: 44, width: 220, height: 18, borderRadius: 9, background: C.l2 }} />
      <div style={{ position: "absolute", right: 44, top: 40, width: 96, height: 26, borderRadius: 13, background: C.l1 }} />
      {STEP_AT.map((at, i) => {
        const p = tween(fr, at, at + 12, 0, 1);
        const rowIn = tween(fr, PANEL_AT + 8 + i * 4, PANEL_AT + 20 + i * 4, 0, 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 44,
              top: 118 + i * 96,
              right: 44,
              height: 72,
              display: "flex",
              alignItems: "center",
              gap: 26,
              opacity: rowIn,
              transform: `translateY(${(1 - rowIn) * 14}px)`,
            }}
          >
            <Check size={48} p={p} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ width: widths[i][0], height: 18, borderRadius: 9, background: interpolateColor(p, C.l2, C.l4) }} />
              <div style={{ width: widths[i][1], height: 12, borderRadius: 6, background: C.l1 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const interpolateColor = (p: number, a: string, b: string) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [x, y] = [h(a), h(b)];
  return `rgb(${x.map((c, i) => Math.round(c + (y[i] - c) * p)).join(",")})`;
};

const CostMeter: React.FC<{ fr: number }> = ({ fr }) => {
  const show = tween(fr, METER_AT, METER_AT + 14, 0, 1);
  const flat = tween(fr, METER_AT + 6, METER_AT + 28, 0, 1);
  const ghostDraw = tween(fr, GHOST_AT, GHOST_AT + 22, 0, 1);
  const ghostFade = tween(fr, GHOST_AT + 24, GHOST_AT + 44, 1, 0);
  return (
    <div
      style={{
        position: "absolute",
        left: 690,
        top: 1500,
        width: 260,
        height: 150,
        borderRadius: 26,
        background: C.white,
        boxShadow: shadowSoft,
        opacity: show,
        transform: `translateY(${(1 - show) * 20}px)`,
      }}
    >
      <div style={{ position: "absolute", left: 26, top: 26, width: 14, height: 14, borderRadius: 7, background: C.accent }} />
      <div style={{ position: "absolute", left: 50, top: 27, width: 90, height: 12, borderRadius: 6, background: C.l2 }} />
      <svg width={208} height={70} style={{ position: "absolute", left: 26, top: 58, overflow: "visible" }}>
        <polyline
          points="0,48 70,47 112,44 140,30 160,-18 176,26 196,14 208,18"
          fill="none"
          stroke={C.l4}
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="1"
          pathLength={1}
          strokeDashoffset={1 - ghostDraw}
          opacity={0.6 * ghostFade * (ghostDraw > 0 ? 1 : 0)}
        />
        <line x1={0} y1={48} x2={208 * flat} y2={48} stroke={C.accent} strokeWidth={6} strokeLinecap="round" />
        <circle cx={208 * flat} cy={48} r={8} fill={C.accent} opacity={flat > 0 ? 1 : 0} />
      </svg>
    </div>
  );
};

export const S4Plan: React.FC = () => {
  const fr = useCurrentFrame();
  const enter = tween(fr, 0, 14, 0, 1);
  const exit = tween(fr, 226, 244, 0, 1);
  const glow = musicEnergy(SCENES.plan[0] + fr);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: enter * (1 - exit), transform: `translateX(${exit * -140}px)` }}>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 300,
            width: 800,
            height: 680,
            background: `radial-gradient(ellipse at 50% 55%, rgba(47,107,255,${0.05 + 0.1 * glow * tween(fr, HIGHLIGHT_AT, HIGHLIGHT_AT + 10)}) 0%, rgba(47,107,255,0) 60%)`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - enter) * 50}px)` }}>
          <Tree fr={fr} />
        </div>
        <PlanPanel fr={fr} />
        <CostMeter fr={fr} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

