import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { settle, snap, tween } from "../anim";
import { Ribbon } from "../parts/Ribbon";
import { C } from "../theme";
import { CUT, SCENES } from "../timeline";

// 6–12.8s. One card per pain point in the voiceover: each slides in, then a red strike
// draws across it. The timeline ribbon snaps into three segments. Slight parallax.

export const CARD_IN = [3, 51, 125]; // "Mua thêm…" 6.22s / "chờ reset…" 7.62s / "đổi tool…" 10.07s
export const STRIKE_AT = [33, 99, 153]; // "xót tiền" / "gián đoạn" / "ngữ cảnh"
export const SNAP_AT = 171; // 11.6s, the voice stops: the break carries the silence

const CARD_W = 700;
const CARD_H = 230;
const CARD_Y = [430, 710, 990];

const Card: React.FC<{ fr: number; i: number }> = ({ fr, i }) => {
  const enter = settle(fr, CARD_IN[i], 11, 105);
  const strike = tween(fr, STRIKE_AT[i], STRIKE_AT[i] + 10, 0, 1);
  const struck = tween(fr, STRIKE_AT[i] + 4, STRIKE_AT[i] + 16, 0, 1);
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - CARD_W) / 2,
        top: CARD_Y[i],
        width: CARD_W,
        height: CARD_H,
        transform: `translateX(${(1 - enter) * 1000}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 30,
          background: "#1A2230",
          border: `2px solid ${C.d4}`,
          opacity: 1 - struck * 0.35,
        }}
      >
        <div style={{ position: "absolute", left: 40, top: 40, width: 110, height: 110, borderRadius: 26, background: C.d4 }}>
          <div style={{ position: "absolute", left: 32, top: 32, width: 46, height: 46, borderRadius: 12, background: "#4A6CB0" }} />
        </div>
        <div style={{ position: "absolute", left: 186, top: 56, width: 380 - i * 40, height: 20, borderRadius: 10, background: "#46536A" }} />
        <div style={{ position: "absolute", left: 186, top: 100, width: 250 + i * 30, height: 14, borderRadius: 7, background: C.d4 }} />
        <div style={{ position: "absolute", left: 186, top: 152, width: 128, height: 40, borderRadius: 20, border: `2px solid ${C.d5}` }} />
        <div style={{ position: "absolute", right: 40, top: 152, width: 64, height: 40, borderRadius: 20, background: C.d4 }} />
      </div>
      <svg width={CARD_W} height={CARD_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line
          x1={34}
          y1={CARD_H - 30}
          x2={CARD_W - 34}
          y2={30}
          stroke={C.blocked}
          strokeWidth={10}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - strike}
          opacity={strike > 0 ? 1 : 0}
        />
      </svg>
    </div>
  );
};

export const S2Blocked: React.FC = () => {
  const fr = useCurrentFrame();
  const broken = snap(fr, SNAP_AT);
  const ribbonIn = tween(fr, 0, 22, 0, 1);
  const len = CUT - SCENES.blocked[0];
  const camera = tween(fr, 0, len, 1, 1.04);

  return (
    <AbsoluteFill style={{ filter: "saturate(0.85)" }}>
      <AbsoluteFill style={{ transform: `scale(${camera})` }}>
        {/* far layer: ribbon drifts slower */}
        <div style={{ position: "absolute", inset: 0, opacity: ribbonIn, transform: `translateX(${tween(fr, 0, len, 50, -14)}px)` }}>
          <Ribbon
            x={130}
            y={1450}
            width={820}
            broken={broken}
            color={C.d5}
            nodeColor="#56627A"
            capColor={C.blocked}
          />
        </div>
        {/* near layer: cards */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${tween(fr, 30, len, 0, -30)}px)` }}>
          {[0, 1, 2].map((i) => (
            <Card key={i} fr={fr} i={i} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
