import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { iris } from "@remotion/transitions/iris";
import { pushCut } from "@remotion/transitions/push-cut";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Grain, Hud } from "./components/Overlays";
import { EASE } from "./lib/motion";
import { ThemeProvider } from "./lib/theme";
import { BrandCube } from "./scenes/BrandCube";
import { Code } from "./scenes/Code";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { Stack } from "./scenes/Stack";
import { Tagline } from "./scenes/Tagline";
import { Scene, ShowreelProps } from "./schema";

const EMPTY: Scene = { kicker: "", title: "", subtitle: "", items: [] };
const CUT = linearTiming({ durationInFrames: 12, easing: EASE.inOut });

// 6 scenes (75+90+90+90+75+90 = 510) minus 5 × 12-frame transitions = 450 frames = 15s.
export const Showreel: React.FC<ShowreelProps> = (props) => {
  const { width, height } = useVideoConfig();
  const scene = (i: number) => props.scenes[i] ?? EMPTY;

  return (
    <ThemeProvider props={props}>
      <AbsoluteFill style={{ backgroundColor: props.colors.ink }}>
        <TransitionSeries>
          <TransitionSeries.Sequence name="Intro" durationInFrames={75}>
            <Intro scene={scene(0)} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={pushCut({ flashColor: props.colors.accent })}
            timing={CUT}
          />
          <TransitionSeries.Sequence name="Tagline" durationInFrames={90}>
            <Tagline scene={scene(1)} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={clockWipe({ width, height })}
            timing={CUT}
          />
          <TransitionSeries.Sequence name="SmartStore" durationInFrames={90}>
            <Stack scene={scene(2)} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={iris({ width, height })}
            timing={CUT}
          />
          <TransitionSeries.Sequence name="Brand cube" durationInFrames={90}>
            <BrandCube scene={scene(3)} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={slide({ direction: "from-right" })}
            timing={CUT}
          />
          <TransitionSeries.Sequence name="Code" durationInFrames={75}>
            <Code scene={scene(4)} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={wipe({ direction: "from-bottom-left" })}
            timing={CUT}
          />
          <TransitionSeries.Sequence name="Outro" durationInFrames={90}>
            <Outro
              scene={scene(5)}
              brand={props.brand}
              cta={props.cta}
              url={props.url}
            />
          </TransitionSeries.Sequence>
        </TransitionSeries>
        <Grain />
        <Hud left={props.hudLeft} right={props.hudRight} />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
