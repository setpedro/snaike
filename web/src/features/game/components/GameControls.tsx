import { useIsMobile } from "@/features/shared/hooks/useIsMobile";

export function GameControls() {
    const isMobile = useIsMobile();

    return (
        <div className="text-center text-white/70 text-sm max-w-md px-6 py-3 bg-black/40 backdrop-blur-sm rounded-b-2xl">
            {isMobile ? (
                <p className="mb-2">Swipe to move 📱</p>
            ) : (
                <p className="mb-2">
                    Use{" "}
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs">
                        WASD
                    </kbd>{" "}
                    or{" "}
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs">
                        Arrow Keys
                    </kbd>{" "}
                    to move
                </p>
            )}
        </div>
    );
}
