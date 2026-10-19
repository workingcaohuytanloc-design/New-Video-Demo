import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { musicEnergy, settle, tween } from "../anim";
import { Mark } from "../parts/Mark";
import { C, shadowSoft } from "../theme";
import { FPS, SCENES } from "../timeline";

// 27.5–30s ("Tải Ordex. Miễn phí ngay hôm nay."). Minimal end card: app icon placeholder, QR placeholder (frame only, no pattern),
// a pill button pulsing gently. The empty middle band is left for text in post.

const PULSE = Math.round((60 / 109.96) * 2 * FPS); // two beats

const Corner: React.FC<{ rot: number; x: number; y: number }> = ({ rot, x, y }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 54,
      height: 54,
      borderLeft: `8px solid ${C.l4}`,
      borderTop: `8px solid ${C.l4}`,
      borderTopLeftRadius: 18,
      transform: `rotate(${rot}deg)`,
    }}
  />
);

export const S6EndCard: React.FC = () => {
  const fr = useCurrentFrame();
  const icon = settle(fr, 0, 11, 140);
  const qr = settle(fr, 6, 12, 140);
  const btn = settle(fr, 12, 12, 140);
  const beat = Math.max(0, fr - 26);
  const pulse = fr > 26 ? 0.5 - 0.5 * Math.cos((2 * Math.PI * beat) / PULSE) : 0;
  const ring = fr > 26 ? (beat % PULSE) / PULSE : 0;
  const glow = musicEnergy(SCENES.endCard[0] + fr);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 115, top: 410, transform: `translateY(${(1 - icon) * 60}px)`, opacity: Math.min(1, icon * 1.4) }}>
        <Mark size={230} style={{ boxShadow: "0 34px 70px -22px rgba(47,107,255,0.5)" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 540 - 140,
          top: 1150,
          width: 280,
          height: 280,
          borderRadius: 36,
          background: C.white,
          boxShadow: shadowSoft,
          transform: `translateY(${(1 - qr) * 60}px)`,
          opacity: Math.min(1, qr * 1.4),
        }}
      >
        <Corner rot={0} x={34} y={34} />
        <Corner rot={90} x={192} y={34} />
        <Corner rot={270} x={34} y={192} />
        <Corner rot={180} x={192} y={192} />
      </div>

      <div style={{ position: "absolute", left: 540 - 280, top: 1500, width: 560, height: 124, transform: `translateY(${(1 - btn) * 60}px)`, opacity: Math.min(1, btn * 1.4) }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 62,
            border: `3px solid ${C.accent}`,
            transform: `scale(${1 + ring * 0.14}, ${1 + ring * 0.5})`,
            opacity: ring > 0 ? (1 - ring) * 0.45 : 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 62,
            background: C.accent,
            transform: `scale(${1 + pulse * 0.025})`,
            boxShadow: `0 24px 50px -16px rgba(47,107,255,${0.4 + glow * 0.25})`,
          }}
        >
          <div style={{ position: "absolute", left: 6, right: 6, top: 6, height: 52, borderRadius: 56, background: "rgba(255,255,255,0.10)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
