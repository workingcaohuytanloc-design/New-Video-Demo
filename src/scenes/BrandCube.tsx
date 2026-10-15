import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Kicker } from "../components/Kicker";
import { SplitText } from "../components/SplitText";
import { EASE, fitFont, springAt, tween } from "../lib/motion";
import { useTheme } from "../lib/theme";
import { Scene } from "../schema";

const SIZE = 480;
const PARTICLES = 42;
const FIRST_TURN = 22;
const TURN_EVERY = 20;

export const BrandCube: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const faces = scene.items.slice(0, 4);
  const entry = springAt(frame, fps, 2, { damping: 16 });

  // Snap-and-hold rotation: one quarter turn per beat with anticipation.
  const turns = [0, 1, 2].reduce(
    (acc, k) =>
      acc +
      tween(
        frame,
        FIRST_TURN + k * TURN_EVERY,
        FIRST_TURN + k * TURN_EVERY + 14,
        EASE.anticipate,
      ),
    0,
  );
  const rotY = -180 * (1 - entry) - 90 * turns;
  const faceColors = [t.accent, t.accent2, t.paper, t.ink];
  const textColors = [t.paper, t.paper, t.ink, t.paper];

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: `radial-gradient(circle at 68% 50%, ${t.accent2}55 0%, ${t.ink} 62%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 0,
          bottom: 0,
          width: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <Kicker text={scene.kicker} delay={2} />
        <div
          style={{
            fontFamily: t.sans,
            fontWeight: 900,
            fontSize: fitFont(scene.title, 104, 26),
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: t.paper,
          }}
        >
          <SplitText text={scene.title} by="word" delay={6} stagger={3} />
        </div>
        <div
          style={{
            fontFamily: t.sans,
            fontWeight: 400,
            fontSize: 44,
            color: t.paper,
            opacity: 0.75,
          }}
        >
          <SplitText text={scene.subtitle} by="word" delay={18} stagger={2} />
        </div>
      </div>

      <AbsoluteFill
        style={{
          left: 800,
          width: 1120,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Particle field orbiting the cube */}
        {Array.from({ length: PARTICLES }, (_, i) => {
          const a =
            random(`a${i}`) * Math.PI * 2 +
            frame * (0.012 + random(`s${i}`) * 0.02);
          const r = 360 + random(`r${i}`) * 300;
          const depth = Math.sin(a);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 6 + random(`z${i}`) * 8,
                height: 6 + random(`z${i}`) * 8,
                borderRadius: "50%",
                background: i % 3 === 0 ? t.accent : t.paper,
                translate: `${Math.cos(a) * r}px ${depth * r * 0.28 + (random(`y${i}`) - 0.5) * 120}px`,
                opacity:
                  (0.35 + (0.65 * (depth + 1)) / 2) *
                  tween(frame, i * 0.6, i * 0.6 + 12),
                scale: 0.6 + (0.6 * (depth + 1)) / 2,
              }}
            />
          );
        })}

        {/* Orbit rings */}
        {[0, 1].map((i) => (
          <svg
            key={i}
            width={1100}
            height={400}
            style={{
              position: "absolute",
              rotate: `${i ? 10 : -14}deg`,
              opacity: tween(frame, 8, 30),
            }}
          >
            <ellipse
              cx={550}
              cy={200}
              rx={520}
              ry={i ? 150 : 110}
              fill="none"
              stroke={i ? t.paper : t.accent}
              strokeWidth={i ? 2 : 3}
              strokeDasharray={i ? "2 16" : "40 22"}
              strokeDashoffset={-frame * (i ? 2 : 5)}
            />
          </svg>
        ))}

        {/* The cube */}
        <div style={{ perspective: 1800, scale: entry }}>
          <div
            style={{
              width: SIZE,
              height: SIZE,
              position: "relative",
              transformStyle: "preserve-3d",
              transform: `rotateX(-16deg) rotateY(${rotY}deg)`,
            }}
          >
            {faces.map((name, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 36,
                  boxSizing: "border-box",
                  background: faceColors[i],
                  border: `3px solid ${t.paper}`,
                  backfaceVisibility: "hidden",
                  transform: `rotateY(${i * 90}deg) translateZ(${SIZE / 2}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: t.mono,
                    fontSize: 24,
                    fontWeight: 700,
                    color: textColors[i],
                  }}
                >
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(faces.length).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontFamily: t.sans,
                    fontWeight: 900,
                    fontSize: fitFont(name, 72, 8),
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: textColors[i],
                  }}
                >
                  {name}
                </div>
              </div>
            ))}
            {/* Top cap so the tilt reads as a solid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: t.paper,
                opacity: 0.9,
                transform: `rotateX(90deg) translateZ(${SIZE / 2}px)`,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
