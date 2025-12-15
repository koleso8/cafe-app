import { createContext } from "react";
import type { InitResponse } from "../api/init";

export type CafeStatus = "loading" | "ready" | "error";

export interface CafeContextValue {
    data: InitResponse | null;
    status: CafeStatus;
    error: string | null;
}

export const CafeContext = createContext<CafeContextValue | undefined>(
    undefined
);
