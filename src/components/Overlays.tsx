import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../lib/theme";

const pad = (n: number) => String(n).padStart(2, "0");

/** Camera-viewfinder HUD that lives above every scene. */
export const Hud: React.FC<{ left: string; right: string }> = ({
  left,
  right,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = useTheme();
  const tc = `00:00:${pad(Math.floor(frame / fps))}:${pad(frame % fps)}`;
  const corner = (pos: React.CSSProperties, rotate: number) => (
    <div
      style={{
        position: "absolute",
        width: 44,
        height: 44,
        borderTop: `3px solid ${t.paper}`,
        borderLeft: `3px solid ${t.paper}`,
        rotate: `${rotate}deg`,
        ...pos,
      }}
    />
  );

  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "difference",
        color: t.paper,
        fontFamily: t.mono,
        fontSize: 22,
        letterSpacing: "0.14em",
        pointerEvents: "none",
      }}
    >
      {corner({ left: 48, top: 48 }, 0)}
      {corner({ right: 48, top: 48 }, 90)}
      {corner({ right: 48, bottom: 48 }, 180)}
      {corner({ left: 48, bottom: 48 }, 270)}
      <div style={{ position: "absolute", left: 112, top: 58 }}>
        {t.brand} / {left}
      </div>
      <div
        style={{
          position: "absolute",
          right: 112,
          top: 58,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: t.paper,
            opacity: frame % 30 < 18 ? 1 : 0.15,
          }}
        />
        REC {tc}
      </div>
      <div style={{ position: "absolute", left: 112, bottom: 58 }}>{right}</div>
      <div
        style={{
          position: "absolute",
          right: 112,
          bottom: 68,
          width: 360,
          height: 3,
          background: "rgba(255,255,255,0.25)",
        }}
      >
        <div
          style={{
            width: `${(frame / (durationInFrames - 1)) * 100}%`,
            height: "100%",
            background: t.paper,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Animated film grain + vignette for a filmic finish. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.22 }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              seed={frame % 12}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
