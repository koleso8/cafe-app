import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Упсс... Щось трапилось",
    description = "Спробуйте оновити сторінку",
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex h-screen items-center justify-center px-4">
            <div className="flex max-w-md flex-col items-center gap-4 text-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>

                {onRetry && (
                    <Button onClick={onRetry} variant="outline">
                        Оновити
                    </Button>
                )}
            </div>
        </div>
    );
}
