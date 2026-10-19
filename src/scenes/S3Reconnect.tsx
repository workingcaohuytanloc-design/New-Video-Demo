import { fitText } from "@remotion/layout-utils";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { musicEnergy, out, settle, tween } from "../anim";
import { DISPLAY } from "../fonts";
import { Logo } from "../parts/Logo";
import { Ribbon } from "../parts/Ribbon";
import type { SceneText } from "../schema";
import { C, textDark, textMuted } from "../theme";
import { SCENES } from "../timeline";

// 12.8–14.8s ("Dùng ngay Ordex"). Hard cut to off-white. The broken ribbon sweeps in and
// reconnects across the frame (shallow depth of field), the Orthex icon lands on its plate
// with the wordmark and tagline underneath, then everything but the mark clears out.

export const JOIN_AT = 6;
export const MARK_AT = 17; // beat-locked: 13.40s (track strong cue 13.11s), on "Ordex"
const WORD_AT = 22;
const TAG_AT = 28;

export const S3Reconnect: React.FC<{ text: SceneText }> = ({ text }) => {
  const fr = useCurrentFrame();
  const rise = tween(fr, 0, 12, 1, 0);
  const broken = tween(fr, JOIN_AT, JOIN_AT + 12, 1, 0);
  const sheen = tween(fr, JOIN_AT + 6, JOIN_AT + 22, 0, 1);
  const retract = tween(fr, 30, 44, 1, 0);
  const mark = settle(fr, MARK_AT, 10, 140);
  const exit = tween(fr, 50, 60, 1, 0);
  const glow = 0.4 + musicEnergy(SCENES.reconnect[0] + fr) * 0.5;
  const word = tween(fr, WORD_AT, WORD_AT + 7, 0, 1, out);
  const tag = tween(fr, TAG_AT, TAG_AT + 7, 0, 1, out);
  const fit = (t: string, max: number, spacing: string, weight: number) =>
    Math.min(max, fitText({ text: t, withinWidth: 820, fontFamily: DISPLAY, fontWeight: weight, letterSpacing: spacing, textTransform: "uppercase" }).fontSize);
  const wordSize = fit(text.headline[0] ?? "", 116, "0.26em", 800);
  const tagSize = fit(text.badge, 34, "0.42em", 700);

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: tween(fr, 0, 4, 0, 1) * retract,
          filter: "blur(2.5px)",
          transform: `translateY(${rise * 260}px) scaleX(${0.5 + retract * 0.5})`,
        }}
      >
        <Ribbon x={40} y={790} width={1000} height={32} broken={broken} color={C.accent} nodeColor={C.accentSoft} sheen={sheen < 1 ? sheen : -1} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 330,
          top: 790 - 330,
          width: 660,
          height: 660,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(28,155,255,${0.2 * glow}) 0%, rgba(28,155,255,0) 65%)`,
          transform: `scale(${mark})`,
        }}
      />
      <div style={{ position: "absolute", left: 540 - 170, top: 790 - 170, transform: `scale(${mark})` }}>
        <Logo size={340} shadow="0 40px 50px rgba(11,15,20,0.22)" />
      </div>
      <div
        style={{
          position: "absolute",
          left: 130,
          width: 820,
          top: 1030,
          textAlign: "center",
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: wordSize,
          letterSpacing: "0.26em",
          paddingLeft: "0.26em",
          color: textDark,
          textTransform: "uppercase",
          clipPath: `inset(-20% ${(1 - word) * 100}% -20% 0)`,
          whiteSpace: "nowrap",
        }}
      >
        {text.headline[0]}
      </div>
      <div
        style={{
          position: "absolute",
          left: 130,
          width: 820,
          top: 1196,
          textAlign: "center",
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: tagSize,
          letterSpacing: "0.42em",
          paddingLeft: "0.42em",
          color: textMuted,
          textTransform: "uppercase",
          clipPath: `inset(-20% ${(1 - tag) * 100}% -20% 0)`,
          whiteSpace: "nowrap",
        }}
      >
        {text.badge}
      </div>
    </AbsoluteFill>
  );
};
