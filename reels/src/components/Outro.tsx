/** Outro: logo + handle grande + CTA corto con la flecha de la marca latiendo al beat. */
import type React from "react";
import { useCurrentFrame } from "remotion";
import { brandCopy, colors, duration, fontSize, fontWeights, letterSpacing, logoLayout, rhythm, safeZone } from "../lib/brand.ts";
import { mix, progress } from "../lib/motion.ts";
import { LogoMark } from "./LogoMark.tsx";
import { ArrowMark } from "./ArrowMark.tsx";

const { top, bottom, left, right } = safeZone.reel;
const safeInset = { top, bottom, left, right };

export type OutroProps = {
  handle?: string;
  cta?: string;
};

export const Outro: React.FC<OutroProps> = ({ handle = brandCopy.handle, cta = "Escribinos por mensaje directo." }) => {
  const frame = useCurrentFrame();
  const logo = progress(frame, 0, duration.base, "enter");
  const h = progress(frame, 6, duration.base, "enter");
  const c = progress(frame, 12, duration.base, "enter");
  // Pulso de la flecha: avanza en cada beat y vuelve (después de que entró el CTA).
  const beatT = ((frame - 12) % rhythm.framesPerBeat) / rhythm.framesPerBeat;
  const pulse = frame > 12 + duration.base ? Math.sin(beatT * Math.PI) : 0;

  const logoWidth = 420;
  return (
    <div style={{ position: "absolute", ...safeInset, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: logo, transform: `scale(${mix(logo, 0.9, 1)})`, height: (logoLayout.viewBox.height / logoLayout.viewBox.width) * logoWidth }}>
        <LogoMark width={logoWidth} />
      </div>
      <p
        style={{
          marginTop: 96,
          fontSize: fontSize.h1,
          fontWeight: fontWeights.bold,
          letterSpacing: letterSpacing.title,
          opacity: h,
          transform: `translateY(${mix(h, 40, 0)}px)`,
        }}
      >
        {handle}
      </p>
      <p
        style={{
          marginTop: 40,
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: fontSize.body,
          whiteSpace: "nowrap",
          fontWeight: fontWeights.medium,
          color: colors.accent,
          opacity: c,
          transform: `translateY(${mix(c, 40, 0)}px)`,
        }}
      >
        {cta}
        <span style={{ transform: `translate(${pulse * 8}px, ${-pulse * 8}px)` }}>
          <ArrowMark size={48} />
        </span>
      </p>
    </div>
  );
};
