import { createContext, useContext } from "react";

export const GridFormContext = createContext(null);

export function useGridForm() {
  const ctx = useContext(GridFormContext);
  if (!ctx) {
    throw new Error("useGridForm() must be used within a <GridForm>");
  }
  return ctx;
}