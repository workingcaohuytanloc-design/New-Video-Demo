import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Kicker } from "../components/Kicker";
import { SplitText } from "../components/SplitText";
import { EASE, fitFont, springAt, tween } from "../lib/motion";
import { useTheme } from "../lib/theme";
import { Scene } from "../schema";

// Three brand dots fly in from off-frame, merge, then flood the screen.
const ORBS: [number, number][] = [
  [-900, -520],
  [900, -480],
  [0, 700],
];

export const Outro: React.FC<{
  scene: Scene;
  brand: string;
  cta: string;
  url: string;
}> = ({ scene, brand, cta, url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const merge = tween(frame, 0, 22, EASE.inOut);
  const flood = tween(frame, 20, 38, EASE.inOut);
  const orbColors = [t.accent, t.accent2, t.paper];
  const ctaIn = springAt(frame, fps, 52, { damping: 15 });

  return (
    <AbsoluteFill style={{ backgroundColor: t.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {ORBS.map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: orbColors[i],
              mixBlendMode: "screen",
              translate: `${x * (1 - merge)}px ${y * (1 - merge)}px`,
              opacity: 1 - flood,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: t.accent,
            scale: flood * 11,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 34,
          color: t.paper,
          textAlign: "center",
        }}
      >
        <Kicker text={scene.kicker} delay={30} color={t.paper} />
        <div
          style={{
            position: "relative",
            fontFamily: t.sans,
            fontWeight: 900,
            fontSize: fitFont(brand, 280, 7),
            lineHeight: 1,
            letterSpacing: "-0.04em",
            overflow: "hidden",
            padding: "0.1em 0.2em",
          }}
        >
          <SplitText text={brand} delay={32} stagger={3} />
          {/* Specular sweep across the wordmark */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 160,
              left: 0,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)",
              mixBlendMode: "overlay",
              rotate: "18deg",
              translate: `${-300 + tween(frame, 58, 80, EASE.inOut) * 1800}px 0`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: t.sans,
            fontWeight: 600,
            fontSize: fitFont(scene.title, 60, 32),
          }}
        >
          <SplitText text={scene.title} by="word" delay={44} stagger={3} />
        </div>
        {scene.subtitle ? (
          <div style={{ fontFamily: t.sans, fontSize: 36, opacity: 0.85 }}>
            <SplitText text={scene.subtitle} by="word" delay={50} stagger={2} />
          </div>
        ) : null}
        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "20px 40px",
            borderRadius: 999,
            background: t.ink,
            fontFamily: t.mono,
            fontWeight: 700,
            fontSize: 30,
            scale: ctaIn,
            opacity: ctaIn,
          }}
        >
          <span>{cta}</span>
          <span
            style={{
              color: t.accent,
              translate: `${Math.sin(frame / 4) * 6}px 0`,
            }}
          >
            →
          </span>
          <span style={{ opacity: 0.7 }}>{url}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
