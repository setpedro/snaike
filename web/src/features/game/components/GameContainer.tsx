import React, { useState } from "react";
import { GameHeader } from "./GameHeader";
import { GameCanvas } from "./GameCanvas";
import { GameControls } from "./GameControls";
import { useGameContext } from "../context/GameProvider";
import { useAuthContext } from "@/features/auth/context/AuthProvider";
import FirstGameEndAuthModal from "./FirstGameEndAuthModal";

export function GameContainer() {
    const { session } = useAuthContext();
    const { gameState, score, record } = useGameContext();

    const displayRecord = Math.max(record, score);

    const isNewRecord = score > 0 && score === record;

    const [isFirstGameEnd, setIsFirstGameEnd] = useState(true);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="flex flex-col items-center gap-4 p-6 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl w-full max-w-4xl">
                <GameHeader />
                <GameCanvas />
                <GameControls />
                {gameState !== "playing" &&
                    isFirstGameEnd &&
                    !session &&
                    score && (
                        <FirstGameEndAuthModal
                            isNewRecord={isNewRecord}
                            displayRecord={displayRecord}
                            onClose={() => setIsFirstGameEnd(false)}
                        />
                    )}
            </div>
        </div>
    );
}
