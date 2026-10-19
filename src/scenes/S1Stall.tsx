import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { settle, tween } from "../anim";
import { CodeLines } from "../parts/Code";
import { Headline } from "../parts/Headline";
import { DISPLAY, MONO } from "../fonts";
import type { SceneText, VideoProps } from "../schema";
import { C, shadowDeep } from "../theme";

// 0–6.2s. IDE window (55% of frame height) with real code scrolling upward. The headline
// wipes in with the first line of voiceover. On "…báo hết credit" the HẾT CREDIT badge slams
// in, the code freezes mid-scroll, progress stalls at 60%, the window desaturates, dims 20%
// and racks out of focus so the headline carries the frame. Slow 5% push-in.

export const HEADLINE_AT = [4, 14, 30]; // "Đừng để công việc" / "bị gián đoạn" / "vì hết credit"
export const BADGE_AT = 146; // 4.87s
export const FREEZE_AT = 150;
const SCROLL = 1.9; // px per frame

const WIN = { x: 130, y: 650, w: 820, h: 1020 };
const LINE_H = 42;

export const S1Stall: React.FC<{ text: SceneText; editor: VideoProps["editor"] }> = ({ text, editor }) => {
  const fr = useCurrentFrame();
  const t = Math.min(fr, FREEZE_AT);

  const push = tween(fr, 0, 186, 1, 1.05);
  const freeze = tween(fr, FREEZE_AT, FREEZE_AT + 18, 0, 1);
  const exit = tween(fr, 176, 186, 1, 0);
  const progress = tween(t, 6, 148, 0.08, 0.6);

  const codeLines = editor.code.split("\n").length;
  const loopH = (codeLines + 2) * LINE_H;
  const scroll = (t * SCROLL) % loopH;

  const badge = settle(fr, BADGE_AT, 8, 210);
  const badgeY = (1 - tween(fr, BADGE_AT, BADGE_AT + 5, 0, 1)) * -60;

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div
          style={{
            position: "absolute",
            left: WIN.x,
            top: WIN.y,
            width: WIN.w,
            height: WIN.h,
            filter: `saturate(${1 - freeze * 0.85}) brightness(${1 - freeze * 0.2}) blur(${freeze * 3}px)`,
          }}
        >
          {/* depth slab under the window */}
          <div style={{ position: "absolute", inset: 0, transform: "translateY(16px)", borderRadius: 32, background: "#06090D" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 32,
              background: "linear-gradient(180deg, #172030 0%, #121924 100%)",
              border: "2px solid #263245",
              boxShadow: `${shadowDeep}, inset 0 1px 0 rgba(255,255,255,0.06)`,
              overflow: "hidden",
            }}
          >
            {/* title bar */}
            <div style={{ height: 76, display: "flex", alignItems: "center", gap: 14, paddingLeft: 30, borderBottom: "2px solid #1F2A3A", background: "#0F151E" }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c, opacity: 0.85 }} />
              ))}
              <div
                style={{
                  marginLeft: 26,
                  height: 46,
                  padding: "0 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  borderRadius: 12,
                  background: "#172030",
                  border: "1px solid #263245",
                  fontFamily: MONO,
                  fontSize: 24,
                  color: "#C3CCD8",
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: 3, background: C.accent }} />
                {editor.fileName}
              </div>
            </div>
            {/* scrolling code */}
            <div style={{ position: "absolute", top: 76, left: 0, right: 0, bottom: 84, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 24 - scroll, left: 0 }}>
                {[0, 1].map((k) => (
                  <div key={k} style={{ height: loopH }}>
                    <CodeLines code={editor.code} fontSize={24} lineHeight={LINE_H} gutter={78} />
                  </div>
                ))}
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: "linear-gradient(#141B27, rgba(20,27,39,0))" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "linear-gradient(rgba(18,25,36,0), #121924)" }} />
            </div>
            {/* status bar with progress */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 84, borderTop: "2px solid #1F2A3A", background: "#0F151E" }}>
              <div style={{ position: "absolute", left: 32, top: 34, width: 420, height: 16, borderRadius: 8, background: "#1F2A3A", overflow: "hidden" }}>
                <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${C.accentDeep}, ${C.accent})` }} />
              </div>
              <div style={{ position: "absolute", right: 32, top: 30, width: 24, height: 24, borderRadius: 12, border: `4px solid ${fr >= FREEZE_AT ? C.blocked : C.accent}`, borderRightColor: "transparent", transform: `rotate(${t * 9}deg)` }} />
            </div>
          </div>
        </div>
        {/* HẾT CREDIT badge — kept sharp: it is the focus before the rack to the headline */}
        {fr >= BADGE_AT && text.badge && (
          <div
            style={{
              position: "absolute",
              right: 130 + 22,
              top: WIN.y + 6,
              transform: `translateY(${badgeY}px) scale(${badge})`,
              transformOrigin: "100% 50%",
              display: "flex",
              alignItems: "center",
              gap: 14,
              height: 64,
              padding: "0 26px 0 14px",
              borderRadius: 32,
              background: C.blocked,
              boxShadow: "0 18px 40px -10px rgba(255,59,74,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 30,
              color: C.white,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 18, background: C.white, position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", left: 8, top: 15, width: 20, height: 6, borderRadius: 3, background: C.blocked }} />
            </div>
            {text.badge}
          </div>
        )}
      </AbsoluteFill>
      <Headline fr={fr} lines={text.headline} at={HEADLINE_AT} top={338} color={C.white} maxSize={84} />
    </AbsoluteFill>
  );
};
