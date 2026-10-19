import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

// Act backdrop: base colour, a soft key light behind the focal area, out-of-focus ghost
// panels (dimmed ~30%) drifting slowly so no frame is ever static, and a vignette.

const GHOSTS = [
  { x: -120, y: 180, w: 520, h: 360, r: 48, speed: 0.22 },
  { x: 700, y: 120, w: 460, h: 300, r: 40, speed: -0.18 },
  { x: -60, y: 1380, w: 560, h: 420, r: 56, speed: 0.15 },
  { x: 720, y: 1500, w: 480, h: 360, r: 44, speed: -0.25 },
  { x: 300, y: 820, w: 640, h: 260, r: 40, speed: 0.1 },
];

export const Backdrop: React.FC<{ mode: "dark" | "light" }> = ({ mode }) => {
  const fr = useCurrentFrame();
  const dark = mode === "dark";
  return (
    <AbsoluteFill style={{ background: dark ? C.ink : C.paper, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: dark
            ? "radial-gradient(ellipse 70% 45% at 50% 48%, #18212E 0%, rgba(11,15,20,0) 100%)"
            : "radial-gradient(ellipse 70% 45% at 50% 46%, #FFFFFF 0%, rgba(245,247,250,0) 100%)",
        }}
      />
      <AbsoluteFill style={{ filter: "blur(26px)", opacity: dark ? 0.7 : 0.9 }}>
        {GHOSTS.map((g, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: g.x + Math.sin(fr / 90 + i) * 30,
              top: g.y + fr * g.speed,
              width: g.w,
              height: g.h,
              borderRadius: g.r,
              background: dark ? "#1A2331" : "#E3E9F1",
              border: `2px solid ${dark ? "#243042" : "#D3DCE7"}`,
            }}
          />
        ))}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${dark ? "rgba(255,255,255,0.03)" : "rgba(11,15,20,0.04)"} 1.6px, transparent 1.8px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: `0px ${-fr * 0.3}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: dark
            ? "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)"
            : "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(176,188,204,0.35) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
