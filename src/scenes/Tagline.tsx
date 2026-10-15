import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Kicker } from "../components/Kicker";
import { fitFont, impact, springAt, tween } from "../lib/motion";
import { useTheme } from "../lib/theme";
import { Scene } from "../schema";

const START = 6;
const BEAT = 14;

export const Tagline: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const words = scene.items.length > 0 ? scene.items : scene.title.split(/\s+/);
  const hits = words.map((_, i) => START + i * BEAT);
  const shake = impact(frame, hits, 9) * 18;
  const flash = impact(frame, hits, 6) * 0.75;
  const size = Math.min(230, 860 / words.length);
  const badgeUnit = `${scene.subtitle} • `;
  const badgeText = badgeUnit.repeat(
    Math.max(1, Math.floor(46 / badgeUnit.length)),
  );
  const marquee = `${scene.title} — `.repeat(6);

  return (
    <AbsoluteFill style={{ backgroundColor: t.ink, overflow: "hidden" }}>
      {/* Outline marquee drifting behind the type */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          whiteSpace: "nowrap",
          fontFamily: t.sans,
          fontWeight: 900,
          fontSize: 130,
          color: "transparent",
          WebkitTextStroke: `2px ${t.paper}`,
          opacity: 0.22 * tween(frame, 30, 50),
          translate: `${-frame * 9}px 0`,
        }}
      >
        {marquee}
      </div>

      {/* Kinetic words, each one a hit on the beat */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          paddingLeft: 140,
          translate: `${Math.sin(frame * 12.9) * shake}px ${Math.cos(frame * 7.3) * shake}px`,
        }}
      >
        <div style={{ position: "absolute", top: 160, left: 140 }}>
          <Kicker text={scene.kicker} delay={2} />
        </div>
        {words.map((word, i) => {
          const s = springAt(frame, fps, hits[i], {
            damping: 11,
            stiffness: 180,
          });
          const style = i % 3;
          return (
            <div
              key={i}
              style={{
                fontFamily: t.sans,
                fontWeight: 900,
                fontSize: fitFont(word, size, 10),
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                transformOrigin: "left center",
                scale: frame < hits[i] ? 0 : 2.6 - 1.6 * s,
                opacity: frame < hits[i] ? 0 : 1,
                color:
                  style === 0
                    ? t.paper
                    : style === 1
                      ? "transparent"
                      : t.accent,
                WebkitTextStroke: style === 1 ? `4px ${t.paper}` : undefined,
              }}
            >
              {word}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Rotating circular badge */}
      <div
        style={{
          position: "absolute",
          right: 160,
          top: 420,
          width: 300,
          height: 300,
          scale: springAt(frame, fps, 34),
          rotate: `${frame * 2.2}deg`,
        }}
      >
        <svg viewBox="0 0 300 300" width={300} height={300}>
          <defs>
            <path
              id="badge"
              d="M150,150 m-120,0 a120,120 0 1,1 240,0 a120,120 0 1,1 -240,0"
            />
          </defs>
          <circle cx={150} cy={150} r={34} fill={t.accent} />
          <text
            style={{
              fontFamily: t.mono,
              fontSize: Math.min(22, 1000 / badgeText.length),
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
            fill={t.paper}
          >
            <textPath href="#badge" textLength={748} lengthAdjust="spacing">
              {badgeText}
            </textPath>
          </text>
        </svg>
      </div>

      <AbsoluteFill
        style={{
          backgroundColor: t.paper,
          opacity: flash,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
