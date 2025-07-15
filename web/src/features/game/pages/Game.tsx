import { useState } from "react";
import { GameHeader } from "../components/GameHeader";
import { GameCanvas } from "../components/GameCanvas";
import { GameControls } from "../components/GameControls";
import { useGameContext } from "../context/GameProvider";
import { useAuthContext } from "@/features/auth/context/AuthProvider";
import { AuthModal } from "../../auth/components/AuthModal";
import { usePendingSave } from "../store/pendingSave";
import { Provider } from "@supabase/supabase-js";
import { authWithOAuth } from "@/features/auth/services/authWithOAuth";

export function Game() {
    const { session } = useAuthContext();
    const { gameMode, gameState, score, record } = useGameContext();

    const [isFirstGameEnd, setIsFirstGameEnd] = useState(!Boolean(session));

    const handleSignIn = (providerName: Provider) => {
        usePendingSave.setGameState(gameState);
        usePendingSave.setGameMode(gameMode);
        usePendingSave.setScore(score);

        authWithOAuth(providerName);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
                <div className="rounded-2xl shadow-2xl">
                    <GameHeader />
                    <GameCanvas />
                </div>
                <GameControls />
                {gameState !== "playing" &&
                isFirstGameEnd &&
                !session &&
                score ? (
                    <AuthModal
                        record={record}
                        onSignIn={handleSignIn}
                        onClose={() => setIsFirstGameEnd(false)}
                    />
                ) : null}
            </div>
        </div>
    );
}
