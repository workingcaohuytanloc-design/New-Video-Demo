import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { settle, snap, tween } from "../anim";
import { DISPLAY } from "../fonts";
import { Headline } from "../parts/Headline";
import { Ribbon } from "../parts/Ribbon";
import type { SceneText } from "../schema";
import { C, shadowDeep } from "../theme";
import { CUT, SCENES } from "../timeline";

// 5.9–12.8s. One card per way out the voiceover names: it slides in from the right,
// takes focus, and a red strike draws across it as it lands. The timeline ribbon behind
// snaps into three segments that keep drifting apart. Lower-third headline, one line per strike.

export const CARD_IN = [3, 51, 125]; // "Mua thêm…" 6.22s / "chờ reset…" 7.62s / "đổi tool…" 10.07s
export const STRIKE_AT = [33, 99, 153]; // "xót tiền" / "gián đoạn" / "ngữ cảnh"
export const SNAP_AT = 171; // 11.6s, the voice stops: the break carries the silence

const CARD_W = 700;
const CARD_H = 190;
const CARD_Y = [400, 625, 850];

const Icon: React.FC<{ i: number }> = ({ i }) => {
  const s = { fill: "none", stroke: C.accent, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={56} height={56} viewBox="0 0 56 56">
      {i === 0 && (
        <>
          <rect x={6} y={13} width={44} height={30} rx={6} {...s} />
          <path d="M6 23 H50 M14 35 H24" {...s} />
        </>
      )}
      {i === 1 && (
        <>
          <circle cx={28} cy={28} r={21} {...s} />
          <path d="M28 16 V28 L36 33" {...s} />
        </>
      )}
      {i === 2 && <path d="M10 20 H44 M36 12 L44 20 L36 28 M46 36 H12 M20 28 L12 36 L20 44" {...s} />}
    </svg>
  );
};

const Card: React.FC<{ fr: number; i: number; label: string; focus: number }> = ({ fr, i, label, focus }) => {
  const enter = settle(fr, CARD_IN[i], 11, 105);
  const strike = tween(fr, STRIKE_AT[i], STRIKE_AT[i] + 9, 0, 1);
  const struck = tween(fr, STRIKE_AT[i] + 4, STRIKE_AT[i] + 16, 0, 1);
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - CARD_W) / 2,
        top: CARD_Y[i],
        width: CARD_W,
        height: CARD_H,
        transform: `translateX(${(1 - enter) * 1050}px)`,
        filter: `blur(${(1 - focus) * 3}px) brightness(${0.62 + focus * 0.38})`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: "translateY(14px)", borderRadius: 30, background: "#070A0F" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 30,
          background: "linear-gradient(180deg, #1D2736 0%, #161E2A 100%)",
          border: "2px solid #2A3648",
          boxShadow: `${shadowDeep}, inset 0 1px 0 rgba(255,255,255,0.07)`,
          display: "flex",
          alignItems: "center",
          gap: 34,
          padding: "0 40px",
        }}
      >
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 28,
            background: "linear-gradient(180deg, #243247, #1B2636)",
            border: "2px solid #2E3D54",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            opacity: 1 - struck * 0.45,
          }}
        >
          <Icon i={i} />
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 50,
            color: C.white,
            opacity: 1 - struck * 0.45,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </div>
      </div>
      <svg width={CARD_W} height={CARD_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line
          x1={26}
          y1={CARD_H / 2 + 26}
          x2={CARD_W - 26}
          y2={CARD_H / 2 - 26}
          stroke={C.blocked}
          strokeWidth={11}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - strike}
          opacity={strike > 0 ? 1 : 0}
          style={{ filter: "drop-shadow(0 0 10px rgba(255,59,74,0.55))" }}
        />
      </svg>
    </div>
  );
};

export const S2Blocked: React.FC<{ text: SceneText }> = ({ text }) => {
  const fr = useCurrentFrame();
  const len = CUT - SCENES.blocked[0];
  const broken = snap(fr, SNAP_AT);
  const drift = tween(fr, SNAP_AT, len, 0, 1);
  const ribbonIn = tween(fr, 0, 22, 0, 1);
  const camera = tween(fr, 0, len, 1, 1.04);
  // the newest card holds focus; earlier ones soften once the next arrives
  const focusOf = (i: number) => (i + 1 < CARD_IN.length ? tween(fr, CARD_IN[i + 1], CARD_IN[i + 1] + 10, 1, 0) : 1);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${camera})` }}>
        <div style={{ position: "absolute", inset: 0, opacity: ribbonIn, filter: "blur(1.5px)", transform: `translateX(${tween(fr, 0, len, 50, -14)}px)` }}>
          <Ribbon x={130} y={1175} width={820} broken={broken * (1 + drift * 0.9)} color={C.d5} nodeColor="#56627A" capColor={C.blocked} />
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${tween(fr, 30, len, 0, -24)}px)` }}>
          {text.items.slice(0, 3).map((label, i) => (
            <Card key={i} fr={fr} i={i} label={label} focus={focusOf(i)} />
          ))}
        </div>
      </AbsoluteFill>
      <Headline fr={fr} lines={text.headline} at={STRIKE_AT.map((t) => t + 2)} top={1320} color={C.white} maxSize={78} separator="dot" />
    </AbsoluteFill>
  );
};
