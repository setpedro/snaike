import React from "react";

export function GameControls() {
    return (
        <div className="text-center text-white/70 text-sm max-w-md">
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
            <p>Swipe on mobile 📱</p>
        </div>
    );
}
