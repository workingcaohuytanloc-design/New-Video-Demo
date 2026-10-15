import { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { springAt } from "../lib/motion";

type Props = {
  text: string;
  delay?: number;
  /** Frames between each animated unit. */
  stagger?: number;
  /** Animate per character or per word. */
  by?: "char" | "word";
  style?: CSSProperties;
};

/**
 * Masked kinetic reveal: each unit slides up out of its own clip box.
 * Words never break mid-word, so edited copy wraps cleanly.
 */
export const SplitText: React.FC<Props> = ({
  text,
  delay = 0,
  stagger = 2,
  by = "char",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let index = 0;

  const unit = (content: string, key: string) => {
    const s = springAt(frame, fps, delay + index++ * stagger, { damping: 13 });
    return (
      <span
        key={key}
        style={{
          display: "inline-block",
          overflow: "hidden",
          verticalAlign: "top",
          // Room for Vietnamese stacked diacritics and descenders.
          padding: "0.18em 0.02em 0.12em",
          margin: "-0.18em -0.02em -0.12em",
        }}
      >
        <span
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            translate: `0 ${(1 - s) * 140}%`,
            rotate: `${(1 - s) * 9}deg`,
          }}
        >
          {content}
        </span>
      </span>
    );
  };

  return (
    <span style={{ display: "inline", ...style }}>
      {text.split(/\s+/).map((word, w) => (
        <span key={w}>
          {w > 0 ? " " : null}
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {by === "word"
              ? unit(word, `${w}`)
              : Array.from(word).map((ch, c) => unit(ch, `${w}-${c}`))}
          </span>
        </span>
      ))}
    </span>
  );
};
