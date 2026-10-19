import React from "react";
import { Img, staticFile } from "remotion";

// The real Orthex app icon, used as-is (never redrawn).
export const Logo: React.FC<{ size: number; shadow?: string; style?: React.CSSProperties }> = ({ size, shadow, style }) => (
  <Img
    src={staticFile("brand/orthex-logo.png")}
    style={{ width: size, height: size, display: "block", filter: shadow ? `drop-shadow(${shadow})` : undefined, ...style }}
  />
);
