import React from "react";
import { AbsoluteFill } from "remotion";

// Flat background with a very faint dot grid and edge falloff.
export const Backdrop: React.FC<{ color: string; dot: string; vignette: string; drift?: number }> = ({
  color,
  dot,
  vignette,
  drift = 0,
}) => (
  <AbsoluteFill style={{ background: color }}>
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${dot} 1.6px, transparent 1.8px)`,
        backgroundSize: "48px 48px",
        backgroundPosition: `${drift}px 0px`,
      }}
    />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 45%, ${vignette} 100%)` }} />
  </AbsoluteFill>
);
