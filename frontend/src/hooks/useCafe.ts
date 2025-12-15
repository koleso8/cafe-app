import { useContext } from "react";
import { CafeContext } from "../context/CafeContext";

export function useCafe() {
  const context = useContext(CafeContext);

  if (!context) {
    throw new Error("useCafe must be used inside CafeProvider");
  }

  return context;
}
