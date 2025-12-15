import { useCafe } from "@/hooks/useCafe";
import { Loader } from "./Loader";
import { ErrorState } from "./ErrorState";

export function CafeLayout({ children }: { children: React.ReactNode }) {
    const { status, error, data } = useCafe();

    if (status === "loading") {
        return <Loader text="Завантаження..." />;
    }

    if (status === "error") {
        return (
            <ErrorState
                title="Упсс..."
                description={error || "Вже ремонтуємо, спробуйте пізніше"}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: data?.cafe.settings?.secondaryColor || undefined,
            }}
        >
            {children}
        </div>
    );
}
