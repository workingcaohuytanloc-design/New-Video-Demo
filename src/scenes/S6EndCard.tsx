import { fitText } from "@remotion/layout-utils";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { musicEnergy, out, settle, tween } from "../anim";
import { DISPLAY, MONO } from "../fonts";
import { Headline } from "../parts/Headline";
import { Logo } from "../parts/Logo";
import type { SceneText, VideoProps } from "../schema";
import { C, textDark, textMuted } from "../theme";
import { SCENES } from "../timeline";

// 27.5–30s ("Tải Ordex. Miễn phí ngay hôm nay."). End card: Orthex icon on its plate,
// headline + subline, the CTA button (pulses once on "Tải…"), and the download link.

export const BUTTON_AT = 6;
const HEADLINE_AT = [10];
const SUB_AT = 16;
const LINK_AT = 22;
const PULSE_AT = 33; // 28.63s, "Tải Ordex"

export const S6EndCard: React.FC<{ text: SceneText; cta: VideoProps["cta"] }> = ({ text, cta }) => {
  const fr = useCurrentFrame();
  const icon = settle(fr, 0, 11, 140);
  const btn = settle(fr, BUTTON_AT, 12, 150);
  const pulse = tween(fr, PULSE_AT, PULSE_AT + 6, 0, 1) * tween(fr, PULSE_AT + 6, PULSE_AT + 16, 1, 0);
  const ring = tween(fr, PULSE_AT, PULSE_AT + 22, 0, 1);
  const sub = tween(fr, SUB_AT, SUB_AT + 7, 0, 1, out);
  const link = tween(fr, LINK_AT, LINK_AT + 7, 0, 1, out);
  const glow = musicEnergy(SCENES.endCard[0] + fr);
  const drift = tween(fr, 0, 74, 0, 1);

  const subSize = Math.min(44, fitText({ text: text.badge, withinWidth: 820, fontFamily: DISPLAY, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }).fontSize);
  const btnSize = Math.min(48, fitText({ text: cta.button, withinWidth: 440, fontFamily: DISPLAY, fontWeight: 800, textTransform: "uppercase" }).fontSize);
  const linkSize = Math.min(34, fitText({ text: cta.link, withinWidth: 720, fontFamily: MONO, fontWeight: 500 }).fontSize);

  return (
    <AbsoluteFill style={{ transform: `translateY(${-drift * 10}px)` }}>
      <div style={{ position: "absolute", left: 540 - 140, top: 400, transform: `translateY(${(1 - icon) * 60}px) scale(${0.9 + icon * 0.1})`, opacity: Math.min(1, icon * 1.4) }}>
        <Logo size={280} shadow="0 36px 46px rgba(11,15,20,0.2)" />
      </div>

      <Headline fr={fr} lines={text.headline} at={HEADLINE_AT} top={760} color={textDark} maxSize={128} />

      <div
        style={{
          position: "absolute",
          left: 130,
          width: 820,
          top: 920,
          textAlign: "center",
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: subSize,
          letterSpacing: "0.08em",
          color: C.accentDeep,
          textTransform: "uppercase",
          clipPath: `inset(-30% ${(1 - sub) * 100}% -30% 0)`,
          whiteSpace: "nowrap",
        }}
      >
        {text.badge}
      </div>

      <div style={{ position: "absolute", left: 540 - 300, top: 1100, width: 600, height: 136, transform: `translateY(${(1 - btn) * 60}px)`, opacity: Math.min(1, btn * 1.4) }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 68,
            border: `4px solid ${C.accent}`,
            transform: `scale(${1 + ring * 0.12}, ${1 + ring * 0.4})`,
            opacity: ring > 0 && ring < 1 ? (1 - ring) * 0.5 : 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 68,
            background: `linear-gradient(180deg, ${C.accent} 0%, ${C.accentDeep} 100%)`,
            transform: `scale(${1 + pulse * 0.06})`,
            boxShadow: `0 28px 56px -18px rgba(28,155,255,${0.45 + glow * 0.25}), inset 0 2px 0 rgba(255,255,255,0.25)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: btnSize,
            color: C.white,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <svg width={44} height={44} viewBox="0 0 44 44">
            <path d="M22 8 V28 M13 20 L22 29 L31 20 M10 35 H34" fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {cta.button}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 130,
          width: 820,
          top: 1300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          clipPath: `inset(-30% ${(1 - link) * 100}% -30% 0)`,
        }}
      >
        <svg width={36} height={36} viewBox="0 0 36 36">
          <path
            d="M15 21 L21 15 M13 17 L10 20 A5.5 5.5 0 0 0 17.8 27.8 L20.5 25 M23 19 L26 16 A5.5 5.5 0 0 0 18.2 8.2 L15.5 11"
            fill="none"
            stroke={textMuted}
            strokeWidth={3.4}
            strokeLinecap="round"
          />
        </svg>
        <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: linkSize, color: textDark, whiteSpace: "nowrap" }}>{cta.link}</div>
      </div>
    </AbsoluteFill>
  );
};
