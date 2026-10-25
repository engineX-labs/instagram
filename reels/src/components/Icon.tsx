/** Ícono propio (tokens/icons.ts) como componente React. */
import type React from "react";
import { icons, ICON_BOX, type IconName } from "../../../tokens/icons.ts";

export const Icon: React.FC<{ name: IconName; size?: number; color?: string }> = ({ name, size = 64, color }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${ICON_BOX} ${ICON_BOX}`}
    style={{ color, display: "block" }}
    aria-hidden
    // Markup estático propio (no viene de input de usuario).
    dangerouslySetInnerHTML={{ __html: icons[name] }}
  />
);
