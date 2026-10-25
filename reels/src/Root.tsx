/** Registro de todas las composiciones (Studio y CLI). */
import type React from "react";
import "./lib/fonts.ts";
import { TestCompositions } from "./compositions/Tests.tsx";

export const Root: React.FC = () => (
  <>
    <TestCompositions />
  </>
);
