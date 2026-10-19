import React from "react";
import { C } from "../theme";

// Round check: outline when p = 0, filled with a drawn tick when p = 1.
export const Check: React.FC<{ size: number; p: number; idle?: string }> = ({ size, p, idle = C.l3 }) => {
  const fill = Math.min(1, p * 1.6);
  const draw = Math.max(0, (p - 0.35) / 0.65);
  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `4px solid ${idle}`,
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: C.accent,
          transform: `scale(${fill})`,
        }}
      />
      <svg width={size} height={size} viewBox="0 0 44 44" style={{ position: "absolute", inset: 0 }}>
        <path
          d="M13 22.5 L19.5 29 L31 16"
          fill="none"
          stroke={C.white}
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      </svg>
    </div>
  );
};
