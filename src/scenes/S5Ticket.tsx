import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { out, settle, tween } from "../anim";
import { Check } from "../parts/Check";
import { C, shadowSoft } from "../theme";

// 22.3–27.5s. A ticket flies in and docks, the panel expands into a list of completed steps
// that tick one by one, an undo tap steps the list back exactly one position.

export const FLY_AT = 4;
export const DOCK_AT = 28; // beat-locked: 23.22s (track strong cue 22.93s), "Giao ticket"
export const ROW_AT = [60, 68, 76, 85, 93]; // beat-grid (half beats from 24.31s), "có log để theo dõi"
export const UNDO_IN = 100; // "dễ dàng"
export const UNDO_TAP = 126; // beat-grid: 26.49s, "hoàn tác"

const PANEL_X = 130;
const PANEL_Y = 360;
const PANEL_W = 820;
const TICKET_W = 740;
const TICKET_H = 220;
const ROW_Y = 300;
const ROW_H = 118;

const TICKET_PATH =
  "M28,0 H712 A28,28 0 0 1 740,28 V88 A22,22 0 0 0 740,132 V192 A28,28 0 0 1 712,220 H28 A28,28 0 0 1 0,192 V132 A22,22 0 0 0 0,88 V28 A28,28 0 0 1 28,0 Z";

const Ticket: React.FC<{ docked: number }> = ({ docked }) => (
  <svg width={TICKET_W} height={TICKET_H} style={{ overflow: "visible" }}>
    <defs>
      <clipPath id="ticket">
        <path d={TICKET_PATH} />
      </clipPath>
    </defs>
    <path d={TICKET_PATH} fill={C.white} stroke={C.l2} strokeWidth={3} />
    <g clipPath="url(#ticket)">
      <rect x={0} y={0} width={26} height={TICKET_H} fill={C.accent} />
    </g>
    <circle cx={100} cy={110} r={38} fill={C.accentSoft} />
    <circle cx={100} cy={110} r={14} fill={C.accent} />
    <rect x={164} y={72} width={300} height={20} rx={10} fill={C.l3} />
    <rect x={164} y={112} width={210} height={14} rx={7} fill={C.l2} />
    <rect x={164} y={146} width={120} height={14} rx={7} fill={C.l1} />
    <line x1={560} y1={24} x2={560} y2={196} stroke={C.l2} strokeWidth={4} strokeDasharray="10 12" strokeLinecap="round" />
    <rect x={604} y={82} width={96} height={56} rx={28} fill={docked > 0.5 ? C.accent : C.l1} />
  </svg>
);

const UndoArrow: React.FC = () => (
  <svg width={46} height={46} viewBox="0 0 46 46">
    <path d="M15 17 H29 A10 10 0 0 1 29 37 H19" fill="none" stroke={C.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 9 L13 17 L21 25" fill="none" stroke={C.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const S5Ticket: React.FC = () => {
  const fr = useCurrentFrame();

  const panelIn = tween(fr, 0, 16, 0, 1, out);
  const exit = tween(fr, 144, 155, 0, 1);

  // ticket flight on an arc, then a small settle in the slot
  const p = tween(fr, FLY_AT, DOCK_AT, 0, 1);
  const land = settle(fr, DOCK_AT, 10, 220);
  const tx = (1 - p) * -760;
  const ty = (1 - p) * -520 - Math.sin(p * Math.PI) * 150 + (fr >= DOCK_AT ? (1 - land) * 10 : 0);
  const rot = (1 - p) * -24;
  const docked = fr >= DOCK_AT ? 1 : 0;

  const expand = tween(fr, DOCK_AT + 4, DOCK_AT + 22, 0, 1);
  const panelH = 300 + expand * (ROW_H * 5 + 20);

  const undoBack = tween(fr, UNDO_TAP + 2, UNDO_TAP + 14, 0, 1);
  const done = ROW_AT.filter((at) => fr >= at).length;
  const bandRow = Math.max(0, done - 1) - undoBack;
  const bandShow = tween(fr, ROW_AT[0], ROW_AT[0] + 6, 0, 1);

  const undoShow = settle(fr, UNDO_IN, 11, 160);
  const press = fr < UNDO_TAP ? 1 : fr < UNDO_TAP + 3 ? 1 - tween(fr, UNDO_TAP, UNDO_TAP + 3, 0, 0.12) : 0.88 + tween(fr, UNDO_TAP + 3, UNDO_TAP + 9, 0, 0.12);
  const ripple = tween(fr, UNDO_TAP, UNDO_TAP + 18, 0, 1);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateY(${exit * -60}px)` }}>
        <div
          style={{
            position: "absolute",
            left: PANEL_X,
            top: PANEL_Y,
            width: PANEL_W,
            height: panelH,
            borderRadius: 36,
            background: C.white,
            boxShadow: shadowSoft,
            transform: `translateX(${(1 - panelIn) * 300}px)`,
            opacity: panelIn,
          }}
        >
          {/* dock slot */}
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 40,
              width: TICKET_W,
              height: TICKET_H,
              borderRadius: 28,
              border: `3px dashed ${C.l3}`,
              boxSizing: "border-box",
              opacity: 1 - tween(fr, DOCK_AT - 2, DOCK_AT + 4, 0, 1),
            }}
          />
          {/* current-position band */}
          <div
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              top: ROW_Y + bandRow * ROW_H - 8,
              height: ROW_H - 14,
              borderRadius: 22,
              background: "#EEF3FF",
              opacity: bandShow * expand,
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 18, bottom: 18, width: 8, borderRadius: 4, background: C.accent }} />
          </div>
          {ROW_AT.map((at, i) => {
            const rowIn = tween(fr, at - 4, at + 6, 0, 1);
            const isLast = i === ROW_AT.length - 1;
            const tick = tween(fr, at, at + 10, 0, 1) - (isLast ? undoBack : 0);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 56,
                  top: ROW_Y + i * ROW_H,
                  height: ROW_H - 30,
                  right: 56,
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  opacity: rowIn * (isLast ? 1 - undoBack * 0.45 : 1),
                  transform: `translateY(${(1 - rowIn) * 18}px)`,
                }}
              >
                <Check size={48} p={tick} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ width: [420, 360, 450, 310, 390][i], height: 18, borderRadius: 9, background: C.l3 }} />
                  <div style={{ width: [240, 280, 200, 260, 220][i], height: 12, borderRadius: 6, background: C.l1 }} />
                </div>
              </div>
            );
          })}
          {/* undo control beside the last line */}
          <div
            style={{
              position: "absolute",
              right: 48,
              top: ROW_Y + 4 * ROW_H - 4,
              width: 96,
              height: 96,
              transform: `scale(${undoShow * press})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `3px solid ${C.accent}`,
                transform: `scale(${1 + ripple * 0.7})`,
                opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.6 : 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: C.white,
                boxShadow: shadowSoft,
                border: `2px solid ${C.l2}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UndoArrow />
            </div>
          </div>
        </div>
        {/* flying ticket, positioned over the slot */}
        <div
          style={{
            position: "absolute",
            left: PANEL_X + 40,
            top: PANEL_Y + 40,
            transform: `translate(${tx + (1 - panelIn) * 300 * docked}px, ${ty}px) rotate(${rot}deg) scale(${0.86 + p * 0.14})`,
            filter: `drop-shadow(0 ${24 - p * 16}px ${30 - p * 18}px rgba(11,15,20,${0.18 - p * 0.08}))`,
            opacity: fr >= FLY_AT ? 1 : 0,
          }}
        >
          <Ticket docked={docked} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
