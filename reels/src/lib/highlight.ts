/**
 * Resaltador mínimo para snippets JS/TS (suficiente para piezas de redes; no es un parser).
 * Devuelve tokens con su tipo; el color sale de `syntax` en los tokens de marca.
 */
import type { syntax } from "../../../tokens/tokens.ts";

export type TokenKind = keyof typeof syntax;
export interface Token {
  text: string;
  kind: TokenKind;
}

const KEYWORDS = new Set(
  "const let var function return if else for while await async import from export new class extends type interface true false null undefined of in".split(
    " ",
  ),
);

// Orden importa: comentarios y strings antes que el resto.
const RULES: Array<[RegExp, TokenKind | "word"]> = [
  [/^\/\/[^\n]*/, "comment"],
  [/^(["'`])(?:\\.|(?!\1)[^\\\n])*\1/, "string"],
  [/^\d+(\.\d+)?/, "number"],
  [/^[A-Za-z_$][\w$]*/, "word"],
  [/^\s+/, "plain"],
  [/^[^\sA-Za-z0-9_$"'`]/, "punctuation"],
];

export function highlight(code: string): Token[] {
  const out: Token[] = [];
  let rest = code;
  while (rest.length) {
    let matched = false;
    for (const [re, kind] of RULES) {
      const m = rest.match(re);
      if (!m) continue;
      const text = m[0];
      let k: TokenKind;
      if (kind === "word") {
        // Identificador seguido de "(" → función.
        const next = rest.slice(text.length).trimStart()[0];
        k = KEYWORDS.has(text) ? "keyword" : next === "(" ? "function" : "plain";
      } else k = kind;
      out.push({ text, kind: k });
      rest = rest.slice(text.length);
      matched = true;
      break;
    }
    if (!matched) {
      out.push({ text: rest[0]!, kind: "plain" });
      rest = rest.slice(1);
    }
  }
  return out;
}
