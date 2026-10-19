import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Backdrop } from "./parts/Backdrop";
import { S1Stall } from "./scenes/S1Stall";
import { S2Blocked } from "./scenes/S2Blocked";
import { S3Reconnect } from "./scenes/S3Reconnect";
import { S4Plan } from "./scenes/S4Plan";
import { S5Ticket } from "./scenes/S5Ticket";
import { S6EndCard } from "./scenes/S6EndCard";
import { Soundtrack } from "./Soundtrack";
import { C } from "./theme";
import { CUT, DURATION, SCENES } from "./timeline";

// Edit timeline. One backdrop per act; scenes are transparent layers on top,
// so overlaps play as soft handoffs and the act switch at CUT is the hard cut.

const Scene: React.FC<{ at: readonly [number, number]; children: React.ReactNode }> = ({ at, children }) => (
  <Sequence from={at[0]} durationInFrames={at[1]}>
    {children}
  </Sequence>
);

export const Ad: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Sequence from={0} durationInFrames={CUT}>
      <Backdrop color={C.ink} dot="rgba(255,255,255,0.03)" vignette="rgba(0,0,0,0.6)" />
    </Sequence>
    <Sequence from={CUT} durationInFrames={DURATION - CUT}>
      <Backdrop color={C.paper} dot="rgba(11,15,20,0.045)" vignette="rgba(201,210,222,0.35)" />
    </Sequence>
    <Scene at={SCENES.stall}>
      <S1Stall />
    </Scene>
    <Scene at={SCENES.blocked}>
      <S2Blocked />
    </Scene>
    <Scene at={SCENES.reconnect}>
      <S3Reconnect />
    </Scene>
    <Scene at={SCENES.plan}>
      <S4Plan />
    </Scene>
    <Scene at={SCENES.ticket}>
      <S5Ticket />
    </Scene>
    <Scene at={SCENES.endCard}>
      <S6EndCard />
    </Scene>
    <Soundtrack />
  </AbsoluteFill>
);
