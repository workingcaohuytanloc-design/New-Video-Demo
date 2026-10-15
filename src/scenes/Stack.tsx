import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Kicker } from "../components/Kicker";
import { SplitText } from "../components/SplitText";
import { fitFont, springAt, tween } from "../lib/motion";
import { useTheme } from "../lib/theme";
import { Scene } from "../schema";

const W = 230; // box front width
const H = 150; // box front height
const D = 64; // isometric depth

// Pyramid of storage boxes: [column offset, row]
const SLOTS: [number, number][] = [
  [-1, 0],
  [0, 0],
  [1, 0],
  [-0.5, 1],
  [0.5, 1],
  [0, 2],
];

const Box: React.FC<{
  color: string;
  ink: string;
  label: string;
  mono: string;
}> = ({ color, ink, label, mono }) => (
  <svg width={W + D} height={H + D} style={{ overflow: "visible" }}>
    {/* front */}
    <rect x={0} y={D} width={W} height={H} fill={color} />
    {/* lid rim */}
    <rect x={0} y={D} width={W} height={22} fill={ink} opacity={0.25} />
    {/* top */}
    <polygon points={`0,${D} ${D},0 ${W + D},0 ${W},${D}`} fill={color} />
    <polygon
      points={`0,${D} ${D},0 ${W + D},0 ${W},${D}`}
      fill="#fff"
      opacity={0.35}
    />
    {/* side */}
    <polygon
      points={`${W},${D} ${W + D},0 ${W + D},${H} ${W},${D + H}`}
      fill={color}
    />
    <polygon
      points={`${W},${D} ${W + D},0 ${W + D},${H} ${W},${D + H}`}
      fill={ink}
      opacity={0.35}
    />
    {/* handle */}
    <rect
      x={W / 2 - 34}
      y={D + 52}
      width={68}
      height={14}
      rx={7}
      fill={ink}
      opacity={0.35}
    />
    <text
      x={18}
      y={D + H - 18}
      fill="#fff"
      style={{ fontFamily: mono, fontSize: 20, fontWeight: 700 }}
    >
      {label}
    </text>
  </svg>
);

export const Stack: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const drops = SLOTS.map((_, i) => 10 + i * 7);

  return (
    <AbsoluteFill style={{ backgroundColor: t.paper, overflow: "hidden" }}>
      {/* Copy column */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 0,
          bottom: 0,
          width: 760,
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
            fontSize: fitFont(scene.title, 132, 10),
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: t.ink,
          }}
        >
          <SplitText text={scene.title} delay={6} stagger={2} />
        </div>
        <div
          style={{
            fontFamily: t.sans,
            fontWeight: 600,
            fontSize: 44,
            color: t.ink,
            opacity: 0.75,
          }}
        >
          <SplitText text={scene.subtitle} by="word" delay={16} stagger={2} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginTop: 16,
          }}
        >
          {scene.items.map((item, i) => {
            // Tick each item as its matching box lands.
            const landAt = drops[Math.min(i * 2 + 1, drops.length - 1)] + 10;
            const on = tween(frame, landAt, landAt + 10);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  fontFamily: t.mono,
                  fontWeight: 700,
                  fontSize: 40,
                  color: t.ink,
                  opacity: 0.25 + 0.75 * on,
                  translate: `${(1 - on) * -24}px 0`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    border: `4px solid ${t.ink}`,
                    background: on > 0.5 ? t.accent : "transparent",
                    borderColor: on > 0.5 ? t.accent : t.ink,
                    scale: 1 + Math.sin(on * Math.PI) * 0.3,
                  }}
                />
                {item}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stacking boxes with a slow camera drift */}
      <div
        style={{
          position: "absolute",
          left: 1360,
          top: 900,
          rotate: `${interpolate(frame, [0, 90], [-3, 1])}deg`,
          scale: interpolate(frame, [0, 90], [0.98, 1.06], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.33, 0, 0.67, 1),
          }),
        }}
      >
        {SLOTS.map(([col, row], i) => {
          const s = springAt(frame, fps, drops[i], {
            damping: 9,
            stiffness: 160,
            mass: 0.9,
          });
          const landed = frame >= drops[i];
          return (
            <div key={i}>
              {row === 0 ? (
                <div
                  style={{
                    position: "absolute",
                    left: col * (W + 12) - W / 2 - 10,
                    top: -10,
                    width: W + D + 20,
                    height: 40,
                    borderRadius: "50%",
                    background: t.ink,
                    opacity: 0.18 * s,
                    scale: `${s} 1`,
                  }}
                />
              ) : null}
              <div
                style={{
                  position: "absolute",
                  left: col * (W + 12) - W / 2,
                  top: -(row + 1) * H - D,
                  opacity: landed ? 1 : 0,
                  translate: `0 ${(1 - s) * -1150}px`,
                  rotate: `${(1 - s) * (i % 2 ? 14 : -14)}deg`,
                }}
              >
                <Box
                  color={i % 2 ? t.accent : t.accent2}
                  ink={t.ink}
                  label={String(i + 1).padStart(2, "0")}
                  mono={t.mono}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
