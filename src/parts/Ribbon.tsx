import React from "react";
import { interpolate } from "remotion";

// The timeline ribbon that breaks in Act 1 and reconnects across the cut.
// broken: 0 = one continuous line, 1 = three separated, tilted segments.

const SEGMENTS = [
  { from: 0, to: 1 / 3, dx: -34, dy: 0, rot: -1.5 },
  { from: 1 / 3, to: 2 / 3, dx: 0, dy: 14, rot: 2.5 },
  { from: 2 / 3, to: 1, dx: 34, dy: -8, rot: -3 },
];
const NODES = [0.06, 0.2, 0.3, 0.45, 0.58, 0.72, 0.86, 0.95];

export const Ribbon: React.FC<{
  x: number;
  y: number;
  width: number;
  height?: number;
  broken: number;
  color: string;
  nodeColor: string;
  capColor?: string; // shown on the broken edges only
  sheen?: number; // 0..1 position of a light sweep, outside that range = hidden
}> = ({ x, y, width, height = 28, broken, color, nodeColor, capColor, sheen = -1 }) => {
  return (
    <div style={{ position: "absolute", left: x, top: y - height / 2, width, height }}>
      {SEGMENTS.map((s, i) => {
        const left = s.from * width;
        const w = (s.to - s.from) * width;
        const capL = i > 0 && capColor ? broken : 0;
        const capR = i < 2 && capColor ? broken : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top: 0,
              width: w,
              height,
              background: color,
              // round only the outer ends while joined, every end once broken
              borderRadius: [
                i === 0 ? height / 2 : height / 2 * broken,
                i === 2 ? height / 2 : height / 2 * broken,
                i === 2 ? height / 2 : height / 2 * broken,
                i === 0 ? height / 2 : height / 2 * broken,
              ]
                .map((r) => `${r}px`)
                .join(" "),
              transform: `translate(${s.dx * broken}px, ${s.dy * broken}px) rotate(${s.rot * broken}deg)`,
              overflow: "hidden",
            }}
          >
            {NODES.filter((n) => n >= s.from && n < s.to).map((n) => (
              <div
                key={n}
                style={{
                  position: "absolute",
                  left: (n - s.from) * width - height * 0.22,
                  top: height * 0.28,
                  width: height * 0.44,
                  height: height * 0.44,
                  borderRadius: "50%",
                  background: nodeColor,
                }}
              />
            ))}
            {capL > 0 && (
              <div style={{ position: "absolute", left: 0, top: 0, width: 7, height, background: capColor, opacity: capL }} />
            )}
            {capR > 0 && (
              <div style={{ position: "absolute", right: 0, top: 0, width: 7, height, background: capColor, opacity: capR }} />
            )}
            {sheen >= 0 && sheen <= 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  height,
                  width: 220,
                  left: interpolate(sheen, [0, 1], [-220, width]) - left,
                  background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
