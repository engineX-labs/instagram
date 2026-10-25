/** Utilidades de texto para las plantillas: escape, énfasis y control tipográfico. */

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
export const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ESC[c] ?? c);

/** Escapa y convierte *énfasis* en <em class="accent">. */
export function rich(s: string): string {
  return escapeHtml(s).replace(/\*([^*]+)\*/g, '<em class="accent">$1</em>');
}

/**
 * Reglas tipográficas del español para texto visible. Devuelve la lista de problemas
 * (vacía = OK). El render se frena si hay alguno: es más barato corregir el JSON
 * que publicar una slide con comillas rectas.
 */
export function typographyIssues(s: string): string[] {
  const issues: string[] = [];
  if (/"/.test(s)) issues.push('comillas rectas ("): usar “ ”');
  if (/'/.test(s)) issues.push("apóstrofo recto ('): usar ’");
  // Cada oración con ? o ! debe tener su signo de apertura.
  for (const [open, close] of [["¿", "?"], ["¡", "!"]] as const) {
    const opens = s.split(open).length - 1;
    const closes = s.split(close).length - 1;
    if (opens !== closes) issues.push(`signos ${open}${close} desbalanceados`);
  }
  // Emojis (rangos pictográficos): prohibidos en renders.
  if (/\p{Extended_Pictographic}/u.test(s)) issues.push("contiene emoji");
  return issues;
}
