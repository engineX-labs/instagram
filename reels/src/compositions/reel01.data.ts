/**
 * Contenido del Reel #1 (presentación de marca).
 *
 * CAPTURAS: cuando tengas capturas reales, copialas a reels/public/captures/ y
 * completá `capture` con la ruta relativa a public (ej. "captures/stock.mp4").
 * Mientras esté vacío, el teléfono muestra el placeholder "CAPTURA PENDIENTE".
 */
import type { IconName } from "../../../tokens/icons.ts";

export interface Reel01Example {
  /** Texto sobre el teléfono. *énfasis* en naranja. */
  title: string;
  /** Rótulo del placeholder. */
  label: string;
  icon: IconName;
  capture?: string;
}

export const reel01 = {
  hook: "Si se puede\npensar, |\nlo *construimos.*",
  logoSubtitle: "El motor detrás de tu negocio.",
  examples: [
    { title: "Control de stock que se *actualiza solo.*", label: "Stock", icon: "stock" },
    { title: "Facturación con ARCA *sin cargar nada a mano.*", label: "Facturación", icon: "invoice" },
    { title: "Cartas digitales con QR y *pago desde la mesa.*", label: "Carta digital", icon: "qr" },
    { title: "Reservas para alojamientos, *sin planillas.*", label: "Reservas", icon: "calendar" },
  ] satisfies Reel01Example[] as Reel01Example[],
  outroCta: "Escribinos por mensaje directo.",
};
