/**
 * Íconos propios (sin terceros). Caja 64×64, trazo redondeado como la flecha del logo.
 * Se exporta el contenido interno del <svg>; el color se hereda vía `currentColor`.
 */
export const ICON_BOX = 64;
export const ICON_STROKE = 5;

const s = `fill="none" stroke="currentColor" stroke-width="${ICON_STROKE}" stroke-linecap="round" stroke-linejoin="round"`;

export const icons = {
  /** Stock: cajas apiladas. */
  stock: `<g ${s}><rect x="6" y="34" width="24" height="22" rx="3"/><rect x="34" y="34" width="24" height="22" rx="3"/><rect x="20" y="8" width="24" height="22" rx="3"/><path d="M14 34v6M42 34v6M28 8v6"/></g>`,
  /** Factura: ticket con borde dentado. */
  invoice: `<g ${s}><path d="M14 6h36v52l-6-4-6 4-6-4-6 4-6-4-6 4z"/><path d="M22 20h20M22 30h20M22 40h12"/></g>`,
  /** QR: tres marcadores + módulos. */
  qr: `<g ${s}><rect x="8" y="8" width="18" height="18" rx="2"/><rect x="38" y="8" width="18" height="18" rx="2"/><rect x="8" y="38" width="18" height="18" rx="2"/></g><g fill="currentColor"><rect x="14" y="14" width="6" height="6"/><rect x="44" y="14" width="6" height="6"/><rect x="14" y="44" width="6" height="6"/><rect x="36" y="36" width="7" height="7"/><rect x="49" y="36" width="7" height="7"/><rect x="42.5" y="42.5" width="7" height="7"/><rect x="36" y="49" width="7" height="7"/><rect x="49" y="49" width="7" height="7"/></g>`,
  /** Reservas: calendario con día marcado. */
  calendar: `<g ${s}><rect x="8" y="12" width="48" height="44" rx="4"/><path d="M8 26h48M22 6v12M42 6v12"/></g><rect x="36" y="36" width="10" height="10" rx="2" fill="currentColor"/>`,
  check: `<polyline points="12,34 26,47 52,17" ${s}/>`,
  cross: `<path d="M18 18l28 28M46 18L18 46" ${s}/>`,
} as const;

export type IconName = keyof typeof icons;

/** SVG completo (para HTML de carruseles). */
export function iconSvg(name: IconName, size = 64, className = "icon"): string {
  return `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${ICON_BOX} ${ICON_BOX}" aria-hidden="true">${icons[name]}</svg>`;
}
