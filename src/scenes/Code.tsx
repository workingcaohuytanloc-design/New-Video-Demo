import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Kicker } from "../components/Kicker";
import { SplitText } from "../components/SplitText";
import { CLAMP, EASE, fitFont, springAt, tween } from "../lib/motion";
import { useTheme } from "../lib/theme";
import { Scene } from "../schema";

const TOKEN = /(<\/?[\p{L}\d]+|\/?>|[\p{L}\d-]+=|"[^"]*"|\{[^}]*\})/u;

type Palette = {
  tag: string;
  attr: string;
  str: string;
  expr: string;
  text: string;
};

/** Minimal JSX highlighter: enough for a believable editor, nothing more. */
const colorOf = (token: string, p: Palette) => {
  if (/^<|>$/.test(token)) return p.tag;
  if (token.endsWith("=")) return p.attr;
  if (token.startsWith('"')) return p.str;
  if (token.startsWith("{")) return p.expr;
  return p.text;
};

export const Code: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const palette: Palette = {
    tag: t.accent,
    attr: "#8FB4FF",
    str: "#A6E3A1",
    expr: "#F9E2AF",
    text: t.paper,
  };

  // Typewriter: distribute a single character budget across the lines.
  const lengths = scene.items.map((line) => Array.from(line).length);
  const total = lengths.reduce((a, b) => a + b, 0);
  const budget = Math.floor(interpolate(frame, [8, 52], [0, total], CLAMP));
  const typed = lengths.map((len, i) =>
    Math.max(
      0,
      Math.min(len, budget - lengths.slice(0, i).reduce((a, b) => a + b, 0)),
    ),
  );
  const cursorLine = typed.reduce((c, n, i) => (n > 0 ? i : c), 0);

  const target = Number(scene.title.replace(/[^\d]/g, ""));
  const stat =
    Number.isFinite(target) && target > 0
      ? String(Math.round(target * tween(frame, 10, 50, EASE.out)))
      : scene.title;
  const win = springAt(frame, fps, 0, { damping: 18 });

  return (
    <AbsoluteFill style={{ backgroundColor: t.ink, overflow: "hidden" }}>
      {/* Editor window */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 200,
          width: 980,
          height: 680,
          borderRadius: 24,
          background: "#0A0C10",
          border: "2px solid rgba(255,255,255,0.1)",
          boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px ${t.accent}22`,
          overflow: "hidden",
          translate: `0 ${(1 - win) * 80}px`,
          opacity: win,
          rotate: `${(1 - win) * -3}deg`,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 26px",
            borderBottom: "2px solid rgba(255,255,255,0.08)",
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{ width: 16, height: 16, borderRadius: 8, background: c }}
            />
          ))}
          <div
            style={{
              marginLeft: 20,
              fontFamily: t.mono,
              fontSize: 22,
              color: t.paper,
              opacity: 0.6,
            }}
          >
            {t.brand.toLowerCase().replace(/\s+/g, "-")}.tsx
          </div>
        </div>
        <div
          style={{
            padding: "36px 0",
            fontFamily: t.mono,
            fontSize: 34,
            lineHeight: 1.75,
          }}
        >
          {scene.items.map((line, li) => {
            let left = typed[li];
            return (
              <div
                key={li}
                style={{
                  display: "flex",
                  whiteSpace: "pre",
                  background:
                    li === cursorLine
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",
                }}
              >
                <span
                  style={{
                    width: 90,
                    textAlign: "right",
                    paddingRight: 30,
                    color: t.paper,
                    opacity: 0.25,
                  }}
                >
                  {li + 1}
                </span>
                {line.split(TOKEN).map((tok, ti) => {
                  const part = Array.from(tok)
                    .slice(0, Math.max(0, left))
                    .join("");
                  left -= Array.from(tok).length;
                  return part ? (
                    <span key={ti} style={{ color: colorOf(tok, palette) }}>
                      {part}
                    </span>
                  ) : null;
                })}
                {li === cursorLine ? (
                  <span
                    style={{
                      width: 18,
                      background: t.accent,
                      opacity: frame % 16 < 9 ? 1 : 0,
                      marginLeft: 2,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Count-up stat */}
      <div
        style={{
          position: "absolute",
          left: 1200,
          right: 140,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <Kicker text={scene.kicker} delay={4} />
        <div
          style={{
            fontFamily: t.sans,
            fontWeight: 900,
            fontSize: fitFont(stat, 250, 4),
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            color: t.paper,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {stat}
        </div>
        <div
          style={{
            width: "100%",
            height: 10,
            background: t.accent,
            transformOrigin: "left",
            scale: `${tween(frame, 12, 50)} 1`,
          }}
        />
        <div
          style={{
            fontFamily: t.sans,
            fontWeight: 600,
            fontSize: 40,
            color: t.paper,
            opacity: 0.8,
          }}
        >
          <SplitText text={scene.subtitle} by="word" delay={24} stagger={2} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
