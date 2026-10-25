/**
 * Composiciones de prueba: una por componente, para iterar en Remotion Studio.
 * Todas muestran la zona insegura rayada (showSafeZone) para revisar márgenes.
 */
import type React from "react";
import { Composition } from "remotion";
import { formats } from "../lib/brand.ts";
import { beats } from "../lib/motion.ts";
import { Canvas, SafeArea } from "../components/Canvas.tsx";
import { Hook, type HookProps } from "../components/Hook.tsx";
import { LogoReveal, type LogoRevealProps } from "../components/LogoReveal.tsx";
import { PhoneMockup, type PhoneMockupProps } from "../components/PhoneMockup.tsx";
import { CodeTyping, type CodeTypingProps } from "../components/CodeTyping.tsx";
import { BeforeAfter, type BeforeAfterProps } from "../components/BeforeAfter.tsx";
import { Captions, type CaptionsProps } from "../components/Captions.tsx";
import { Outro, type OutroProps } from "../components/Outro.tsx";
import ejemplo from "../../captions/ejemplo.whisper.json";

const { width, height, fps } = formats.reel;
const base = { width, height, fps } as const;

/** Envuelve un componente en el lienzo de marca con la zona segura visible. */
function test<P extends object>(Comp: React.FC<P>) {
  const Wrapped: React.FC<P> = (props) => (
    <Canvas showSafeZone>
      <Comp {...props} />
    </Canvas>
  );
  return Wrapped;
}

const HookTest = test<HookProps>(Hook);
const LogoRevealTest = test<LogoRevealProps>(LogoReveal);
const PhoneTest = test<PhoneMockupProps>((p) => (
  <SafeArea style={{ alignItems: "center", justifyContent: "center" }}>
    <PhoneMockup {...p} />
  </SafeArea>
));
const CodeTest = test<CodeTypingProps>((p) => (
  <SafeArea style={{ alignItems: "center", justifyContent: "center" }}>
    <CodeTyping {...p} />
  </SafeArea>
));
const BeforeAfterTest = test<BeforeAfterProps>(BeforeAfter);
const CaptionsTest = test<CaptionsProps>(Captions);
const OutroTest = test<OutroProps>(Outro);

export const TestCompositions: React.FC = () => (
  <>
    <Composition
      id="Test-Hook"
      component={HookTest}
      durationInFrames={beats(4)}
      {...base}
      defaultProps={{ text: "Si se puede\npensar, |\nlo *construimos.*", wordInterval: 5, pauseFrames: 5 }}
    />
    <Composition
      id="Test-LogoReveal"
      component={LogoRevealTest}
      durationInFrames={beats(8)}
      {...base}
      defaultProps={{ subtitle: "El motor detrás de tu negocio.", kickAt: beats(5) }}
    />
    <Composition
      id="Test-PhoneMockup"
      component={PhoneTest}
      durationInFrames={beats(6)}
      {...base}
      defaultProps={{ placeholderLabel: "Stock", placeholderIcon: "stock" as const, enterAt: 4 }}
    />
    <Composition
      id="Test-CodeTyping"
      component={CodeTest}
      durationInFrames={beats(12)}
      {...base}
      defaultProps={{
        filename: "venta.ts",
        code: "// cada venta descuenta stock\nasync function vender(item, cantidad) {\n  await stock.descontar(item, cantidad);\n  return factura.emitir(item);\n}",
      }}
    />
    <Composition
      id="Test-BeforeAfter"
      component={BeforeAfterTest}
      durationInFrames={beats(10)}
      {...base}
      defaultProps={{
        before: { title: "Cargar cada venta a mano en ARCA.", points: ["Errores de tipeo.", "Tiempo perdido."] },
        after: { title: "La venta genera la factura automáticamente." },
        wipeAt: beats(3),
      }}
    />
    <Composition
      id="Test-Captions"
      component={CaptionsTest}
      durationInFrames={Math.ceil(4.8 * fps)}
      {...base}
      defaultProps={{ whisper: ejemplo }}
    />
    <Composition id="Test-Outro" component={OutroTest} durationInFrames={beats(6)} {...base} defaultProps={{}} />
  </>
);
