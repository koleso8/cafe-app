import { Loader2 } from "lucide-react";

export function Loader({ text = "Загрузка..." }: { text?: string }) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">{text}</span>
            </div>
        </div>
    );
}
