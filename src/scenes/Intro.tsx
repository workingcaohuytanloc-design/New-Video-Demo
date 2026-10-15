import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Kicker } from "../components/Kicker";
import { SplitText } from "../components/SplitText";
import { fitFont, tween } from "../lib/motion";
import { useTheme } from "../lib/theme";
import { Scene } from "../schema";

const COLS = 12;
const ROWS = 7;

export const Intro: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = useTheme();

  return (
    <AbsoluteFill style={{ backgroundColor: t.ink, overflow: "hidden" }}>
      {/* Blueprint grid draws itself from the centre outwards */}
      {Array.from({ length: COLS + 1 }, (_, i) => (
        <div
          key={`v${i}`}
          style={{
            position: "absolute",
            left: (i / COLS) * width,
            top: 0,
            width: 1,
            height,
            background: t.paper,
            opacity: 0.09,
            scale: `1 ${tween(frame, Math.abs(i - COLS / 2) * 1.5, Math.abs(i - COLS / 2) * 1.5 + 20)}`,
          }}
        />
      ))}
      {Array.from({ length: ROWS + 1 }, (_, i) => (
        <div
          key={`h${i}`}
          style={{
            position: "absolute",
            top: (i / ROWS) * height,
            left: 0,
            height: 1,
            width,
            background: t.paper,
            opacity: 0.09,
            scale: `${tween(frame, 4 + Math.abs(i - ROWS / 2) * 2, 26 + Math.abs(i - ROWS / 2) * 2)} 1`,
          }}
        />
      ))}

      {/* Shockwave rings on the downbeat */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {[0, 1, 2].map((i) => {
          const p = tween(frame, 8 + i * 4, 40 + i * 4);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 1500,
                height: 1500,
                borderRadius: "50%",
                border: `${6 - i * 2}px solid ${t.accent}`,
                scale: p,
                opacity: p === 0 ? 0 : 1 - p,
              }}
            />
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill
        name="Title block"
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 28,
          scale: interpolate(frame, [0, 75], [0.94, 1.04], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.33, 0, 0.67, 1),
          }),
        }}
      >
        <Kicker text={scene.kicker} delay={6} />
        <div
          style={{
            fontFamily: t.sans,
            fontWeight: 900,
            fontSize: fitFont(scene.title, 300, 7),
            lineHeight: 1,
            color: t.paper,
            textAlign: "center",
            maxWidth: 1600,
            letterSpacing: `${interpolate(frame, [40, 75], [-0.05, 0.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}em`,
          }}
        >
          <SplitText text={scene.title} delay={10} stagger={3} />
        </div>
        <Interactive.Div
          name="Accent bar"
          style={{
            width: 900,
            height: 14,
            background: t.accent,
            transformOrigin: "left center",
            scale: `${tween(frame, 26, 44)} 1`,
          }}
        />
        <div
          style={{
            fontFamily: t.sans,
            fontWeight: 600,
            fontSize: fitFont(scene.subtitle, 48, 44),
            color: t.paper,
            opacity: 0.85,
            textAlign: "center",
            maxWidth: 1400,
          }}
        >
          <SplitText text={scene.subtitle} by="word" delay={32} stagger={3} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
