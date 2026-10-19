import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { tween } from "./anim";
import "./fonts";
import { Backdrop } from "./parts/Backdrop";
import { Logo } from "./parts/Logo";
import { S1Stall } from "./scenes/S1Stall";
import { S2Blocked } from "./scenes/S2Blocked";
import { S3Reconnect } from "./scenes/S3Reconnect";
import { S4Plan } from "./scenes/S4Plan";
import { S5Ticket } from "./scenes/S5Ticket";
import { S6EndCard } from "./scenes/S6EndCard";
import type { VideoProps } from "./schema";
import { Soundtrack } from "./Soundtrack";
import { C } from "./theme";
import { CUT, DURATION, SCENES } from "./timeline";

// Edit timeline. One backdrop per act; scenes are transparent layers on top, so overlaps
// play as soft handoffs and the act switch at CUT is the hard cut. All on-screen text
// comes from props (src/schema.ts, content.json).

const Scene: React.FC<{ at: readonly [number, number]; children: React.ReactNode }> = ({ at, children }) => (
  <Sequence from={at[0]} durationInFrames={at[1]}>
    {children}
  </Sequence>
);

// Real Orthex icon in the reserved top-left slot; steps aside while scene 3 shows it big.
const BrandSlot: React.FC = () => {
  const fr = useCurrentFrame();
  const [s3, s3len] = SCENES.reconnect;
  const visible = fr < s3 ? 1 : tween(fr, s3 + s3len - 12, s3 + s3len, 0, 1);
  return (
    <div style={{ position: "absolute", left: 130, top: 230, opacity: visible * tween(fr, 0, 8, 0, 1) }}>
      <Logo size={88} shadow="0 10px 18px rgba(0,0,0,0.25)" />
    </div>
  );
};

export const Ad: React.FC<VideoProps> = (props) => {
  const s = props.scenes;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Sequence from={0} durationInFrames={CUT}>
        <Backdrop mode="dark" />
      </Sequence>
      <Sequence from={CUT} durationInFrames={DURATION - CUT}>
        <Backdrop mode="light" />
      </Sequence>
      <Scene at={SCENES.stall}>
        <S1Stall text={s[0]} editor={props.editor} />
      </Scene>
      <Scene at={SCENES.blocked}>
        <S2Blocked text={s[1]} />
      </Scene>
      <Scene at={SCENES.reconnect}>
        <S3Reconnect text={s[2]} />
      </Scene>
      <Scene at={SCENES.plan}>
        <S4Plan text={s[3]} counter={{ label: props.counterLabel, value: props.counterValue }} />
      </Scene>
      <Scene at={SCENES.ticket}>
        <S5Ticket text={s[4]} ticket={props.ticket} log={props.log} undoLabel={props.undoLabel} />
      </Scene>
      <Scene at={SCENES.endCard}>
        <S6EndCard text={s[5]} cta={props.cta} />
      </Scene>
      <BrandSlot />
      <Soundtrack rows={Math.min(6, props.log.length)} />
    </AbsoluteFill>
  );
};
