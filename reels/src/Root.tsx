/** Registro de todas las composiciones (Studio y CLI). */
import type React from "react";
import "./lib/fonts.ts";
import { Composition } from "remotion";
import { TestCompositions } from "./compositions/Tests.tsx";
import { Reel01, REEL01_DURATION } from "./compositions/Reel01.tsx";
import { formats } from "./lib/brand.ts";

export const Root: React.FC = () => (
  <>
    <Composition
      id="Reel01"
      component={Reel01}
      durationInFrames={REEL01_DURATION}
      width={formats.reel.width}
      height={formats.reel.height}
      fps={formats.reel.fps}
      defaultProps={{ showSafeZone: false }}
    />
    <TestCompositions />
  </>
);
