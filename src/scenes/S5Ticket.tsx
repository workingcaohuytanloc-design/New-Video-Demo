import { fitText } from "@remotion/layout-utils";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { siJira } from "simple-icons";
import { out, settle, tween } from "../anim";
import { DISPLAY, MONO } from "../fonts";
import { Check } from "../parts/Check";
import { Headline } from "../parts/Headline";
import type { SceneText, VideoProps } from "../schema";
import { C, shadowSoft, textDark, textMuted } from "../theme";

// 22.3–27.5s. A Jira ticket flies in and docks into the results panel, which expands into a
// log list. Rows tick in one by one with timestamp pills while the camera drifts. The undo
// control taps the last row and the list steps back exactly one position.

export const FLY_AT = 4;
export const DOCK_AT = 28; // beat-locked: 23.22s (track strong cue 22.93s), "Giao ticket"
export const ROW_STEP = 8; // half beats from 24.31s, "có log để theo dõi"
export const ROW_START = 56;
export const UNDO_IN = 104; // "dễ dàng"
export const UNDO_TAP = 126; // beat-grid: 26.49s, "hoàn tác"
export const HEADLINE_AT = [26, 48, 69]; // "Giao ticket" / "nhận kết quả" / "có log để theo dõi"

const PANEL = { x: 130, y: 330, w: 820 };
const TICKET = { w: 740, h: 200 };
const ROW_Y = 270;
const ROW_H = 86;

const TICKET_PATH =
  "M28,0 H712 A28,28 0 0 1 740,28 V78 A22,22 0 0 0 740,122 V172 A28,28 0 0 1 712,200 H28 A28,28 0 0 1 0,172 V122 A22,22 0 0 0 0,78 V28 A28,28 0 0 1 28,0 Z";

const JiraTicket: React.FC<{ ticket: VideoProps["ticket"]; done: number }> = ({ ticket, done }) => {
  const titleSize = Math.min(34, fitText({ text: ticket.title, withinWidth: 470, fontFamily: DISPLAY, fontWeight: 700 }).fontSize);
  const status = done > 0.5 ? ticket.statusAfter : ticket.statusBefore;
  return (
    <div style={{ position: "relative", width: TICKET.w, height: TICKET.h }}>
      <svg width={TICKET.w} height={TICKET.h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <clipPath id="ticket">
            <path d={TICKET_PATH} />
          </clipPath>
        </defs>
        <path d={TICKET_PATH} fill={C.white} stroke={C.l2} strokeWidth={2} />
        <g clipPath="url(#ticket)">
          <rect x={0} y={0} width={14} height={TICKET.h} fill={`#${siJira.hex}`} />
        </g>
        <line x1={572} y1={22} x2={572} y2={178} stroke={C.l2} strokeWidth={3} strokeDasharray="8 10" strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 14 }}>
        <svg width={40} height={40} viewBox="0 0 24 24">
          <path d={siJira.path} fill={`#${siJira.hex}`} />
        </svg>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 26, color: textMuted }}>{ticket.key}</div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 92, width: 500, fontFamily: DISPLAY, fontWeight: 700, fontSize: titleSize, lineHeight: 1.2, color: textDark, whiteSpace: "nowrap" }}>
        {ticket.title}
      </div>
      <div style={{ position: "absolute", left: 40, top: 150, display: "flex", gap: 10 }}>
        {[90, 60].map((w) => (
          <div key={w} style={{ width: w, height: 12, borderRadius: 6, background: C.l1 }} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 594,
          top: 76,
          width: 124,
          height: 48,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: done > 0.5 ? "#E3FCEF" : C.l1,
          color: done > 0.5 ? "#006644" : textMuted,
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {status}
      </div>
    </div>
  );
};

const UndoArrow: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 46 46">
    <path d="M15 17 H29 A10 10 0 0 1 29 37 H19" fill="none" stroke={C.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 9 L13 17 L21 25" fill="none" stroke={C.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const S5Ticket: React.FC<{ text: SceneText; ticket: VideoProps["ticket"]; log: VideoProps["log"]; undoLabel: string }> = ({
  text,
  ticket,
  log,
  undoLabel,
}) => {
  const fr = useCurrentFrame();
  const rows = log.slice(0, 6);
  const rowAt = rows.map((_, i) => ROW_START + i * ROW_STEP);

  const panelIn = tween(fr, 0, 16, 0, 1, out);
  const exit = tween(fr, 144, 155, 0, 1);

  const p = tween(fr, FLY_AT, DOCK_AT, 0, 1);
  const land = settle(fr, DOCK_AT, 10, 220);
  const tx = (1 - p) * -760;
  const ty = (1 - p) * -520 - Math.sin(p * Math.PI) * 150 + (fr >= DOCK_AT ? (1 - land) * 10 : 0);
  const rot = (1 - p) * -24;
  const docked = fr >= DOCK_AT ? 1 : 0;

  const expand = tween(fr, DOCK_AT + 4, DOCK_AT + 22, 0, 1);
  const panelH = 250 + expand * (ROW_H * rows.length + 30);

  const undoBack = tween(fr, UNDO_TAP + 2, UNDO_TAP + 14, 0, 1);
  const done = rowAt.filter((at) => fr >= at).length;
  const bandRow = Math.max(0, done - 1) - undoBack;
  const bandShow = tween(fr, rowAt[0], rowAt[0] + 6, 0, 1);

  const undoShow = settle(fr, UNDO_IN, 11, 160);
  const press = fr < UNDO_TAP ? 1 : fr < UNDO_TAP + 3 ? 1 - tween(fr, UNDO_TAP, UNDO_TAP + 3, 0, 0.1) : 0.9 + tween(fr, UNDO_TAP + 3, UNDO_TAP + 9, 0, 0.1);
  const ripple = tween(fr, UNDO_TAP, UNDO_TAP + 18, 0, 1);
  const camera = tween(fr, 0, 157, 0, 1);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateY(${exit * -60}px)` }}>
      <AbsoluteFill style={{ transform: `translateY(${-camera * 22}px) scale(${1 + camera * 0.025})` }}>
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: panelH,
            borderRadius: 36,
            background: "linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 100%)",
            border: `1px solid ${C.l2}`,
            boxShadow: shadowSoft,
            transform: `translateX(${(1 - panelIn) * 300}px)`,
            opacity: panelIn,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 30,
              width: TICKET.w,
              height: TICKET.h,
              borderRadius: 28,
              border: `3px dashed ${C.l3}`,
              boxSizing: "border-box",
              opacity: 1 - tween(fr, DOCK_AT - 2, DOCK_AT + 4, 0, 1),
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              top: ROW_Y + bandRow * ROW_H - 6,
              height: ROW_H - 10,
              borderRadius: 20,
              background: "#EAF5FF",
              opacity: bandShow * expand,
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 16, bottom: 16, width: 7, borderRadius: 4, background: C.accent }} />
          </div>
          {rows.map((row, i) => {
            const at = rowAt[i];
            const rowIn = tween(fr, at - 4, at + 5, 0, 1);
            const isLast = i === rows.length - 1;
            const tick = tween(fr, at, at + 9, 0, 1) - (isLast ? undoBack : 0);
            const size = Math.min(30, fitText({ text: row.text, withinWidth: 430, fontFamily: DISPLAY, fontWeight: 600 }).fontSize);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 46,
                  right: isLast ? 210 : 46,
                  top: ROW_Y + i * ROW_H,
                  height: ROW_H - 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: rowIn * (isLast ? 1 - undoBack * 0.5 : 1),
                  transform: `translateY(${(1 - rowIn) * 16}px)`,
                }}
              >
                <Check size={40} p={tick} />
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 22,
                    color: textMuted,
                    background: C.l1,
                    borderRadius: 10,
                    padding: "6px 12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.time}
                </div>
                <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: size, color: textDark, whiteSpace: "nowrap" }}>{row.text}</div>
              </div>
            );
          })}
          {/* undo control beside the last row */}
          <div
            style={{
              position: "absolute",
              right: 30,
              top: ROW_Y + (rows.length - 1) * ROW_H - 4,
              height: 72,
              transform: `scale(${undoShow * press})`,
              transformOrigin: "100% 50%",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 36,
                border: `3px solid ${C.accent}`,
                transform: `scale(${1 + ripple * 0.35})`,
                opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.6 : 0,
              }}
            />
            <div
              style={{
                position: "relative",
                height: 72,
                padding: "0 24px 0 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 36,
                background: C.white,
                border: `2px solid ${C.accentSoft}`,
                boxShadow: shadowSoft,
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 26,
                color: C.accentDeep,
                whiteSpace: "nowrap",
              }}
            >
              <UndoArrow />
              {undoLabel}
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: PANEL.x + 40,
            top: PANEL.y + 30,
            transform: `translate(${tx + (1 - panelIn) * 300 * docked}px, ${ty}px) rotate(${rot}deg) scale(${0.86 + p * 0.14})`,
            filter: `drop-shadow(0 ${24 - p * 16}px ${30 - p * 18}px rgba(11,15,20,${0.2 - p * 0.1}))`,
            opacity: fr >= FLY_AT ? 1 : 0,
          }}
        >
          <JiraTicket ticket={ticket} done={tween(fr, rowAt[rowAt.length - 1] ?? 999, (rowAt[rowAt.length - 1] ?? 999) + 1, 0, 1)} />
        </div>
      </AbsoluteFill>
      <Headline fr={fr} lines={text.headline} at={HEADLINE_AT} top={1330} color={textDark} maxSize={76} separator="arrow" />
    </AbsoluteFill>
  );
};
