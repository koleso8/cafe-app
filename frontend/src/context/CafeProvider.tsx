import { useEffect, useState } from "react";
import { CafeContext } from "./CafeContext";
import { initCafe } from "../api/init";
import type { InitResponse } from "../api/init";
import type { CafeStatus } from "./CafeContext";

export function CafeProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<InitResponse | null>(null);
    const [status, setStatus] = useState<CafeStatus>("loading");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
        const params = new URLSearchParams(window.location.search);
        const cafeSlug = params.get("cafe");
        const startParam = params.get("start_param");

        if (!cafeSlug && !startParam) {
            setError("Кафе не найдено");
            setStatus("error");
            return;
        }

        try {
            const result = await initCafe(cafeSlug, startParam);
            setData(result);
            setStatus("ready");
        } catch {
            setError("Ошибка загрузки кафе");
            setStatus("error");
        }
        };

        load();
    }, []);

    return (
        <CafeContext.Provider value={{ data, status, error }}>
            {children}
        </CafeContext.Provider>
    );
}
