import { useCurrentFrame } from "remotion";
import { tween } from "../lib/motion";
import { useTheme } from "../lib/theme";

/** Small mono label with a drawing rule — the "chapter marker" of every scene. */
export const Kicker: React.FC<{
  text: string;
  delay?: number;
  color?: string;
}> = ({ text, delay = 0, color }) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const p = tween(frame, delay, delay + 16);
  const visible = Math.round(
    Array.from(text).length * tween(frame, delay + 4, delay + 22),
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        fontFamily: t.mono,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: color ?? t.accent,
      }}
    >
      <div
        style={{ width: 64 * p, height: 4, background: color ?? t.accent }}
      />
      <span>{Array.from(text).slice(0, visible).join("")}</span>
    </div>
  );
};
