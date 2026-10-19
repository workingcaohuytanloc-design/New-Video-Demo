import React from "react";
import { C } from "../theme";

// Placeholder brand mark: a node sitting on a line, echoing the ribbon. No letters.
export const Mark: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => {
  const s = size / 200;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 54 * s,
        background: C.accent,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 84 * s,
          top: 87 * s,
          width: 76 * s,
          height: 26 * s,
          borderRadius: 13 * s,
          background: C.white,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 38 * s,
          top: 66 * s,
          width: 68 * s,
          height: 68 * s,
          borderRadius: "50%",
          border: `${15 * s}px solid ${C.white}`,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};
