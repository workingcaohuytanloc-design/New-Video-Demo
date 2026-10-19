import React from "react";
import { Composition } from "remotion";
import { Ad } from "./Ad";
import { DURATION, FPS, HEIGHT, WIDTH } from "./timeline";

export const Root: React.FC = () => (
  <Composition id="Ad" component={Ad} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
