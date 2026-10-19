import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { musicEnergy, settle, tween } from "../anim";
import { Mark } from "../parts/Mark";
import { Ribbon } from "../parts/Ribbon";
import { C } from "../theme";
import { SCENES } from "../timeline";

// 12.8–14.6s ("Dùng ngay Ordex"). Hard cut to off-white. The broken ribbon floats in and reconnects with a sweep,
// the mark scales in at centre, everything else clears out.

export const JOIN_AT = 6;
export const MARK_AT = 17; // beat-locked: 13.40s (track strong cue 13.11s), on "Ordex"

export const S3Reconnect: React.FC = () => {
  const fr = useCurrentFrame();
  const rise = tween(fr, 0, 12, 1, 0);
  const broken = tween(fr, JOIN_AT, JOIN_AT + 12, 1, 0);
  const sheen = tween(fr, JOIN_AT + 6, JOIN_AT + 22, 0, 1);
  const retract = tween(fr, 26, 40, 1, 0);
  const mark = settle(fr, MARK_AT, 10, 140);
  const markOut = tween(fr, 42, 53, 1, 0);
  const glow = 0.35 + musicEnergy(SCENES.reconnect[0] + fr) * 0.5;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: tween(fr, 0, 4, 0, 1) * retract,
          transform: `translateY(${rise * 260}px) scaleX(${0.4 + retract * 0.6})`,
        }}
      >
        <Ribbon x={130} y={960} width={820} broken={broken} color={C.accent} nodeColor={C.accentSoft} sheen={sheen < 1 ? sheen : -1} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 260,
          top: 960 - 260,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(47,107,255,${0.22 * glow}) 0%, rgba(47,107,255,0) 65%)`,
          transform: `scale(${mark * markOut})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 110,
          top: 960 - 110,
          transform: `scale(${mark * (0.6 + markOut * 0.4)})`,
          opacity: markOut,
        }}
      >
        <Mark size={220} style={{ boxShadow: "0 30px 60px -18px rgba(47,107,255,0.45)" }} />
      </div>
    </AbsoluteFill>
  );
};
