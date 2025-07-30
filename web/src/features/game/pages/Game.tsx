import { useState } from "react";
import { GameHeader } from "../components/GameHeader";
import { GameCanvas } from "../components/GameCanvas";
import { GameControls } from "../components/GameControls";
import { useGameContext } from "../context/GameProvider";
import { useAuthContext } from "@/features/auth/context/AuthProvider";
import { AuthModal } from "../../auth/components/AuthModal";
import { usePendingSave } from "../store/pendingSave";
import { AuthFooter } from "@/features/auth/components/AuthFooter";
import { Header } from "@/features/shared/components/Header";
import { PageWrapper } from "@/features/shared/components/PageWrapper";
import { GameResult } from "../types";
import { usePlatform } from "@/features/shared/hooks/useIsMobile";

export function Game() {
    const { session } = useAuthContext();
    const { gameMode, gameState, gameEndCause, gameDuration, score, record } = useGameContext();
    const platform = usePlatform();

    const [isFirstGameEnd, setIsFirstGameEnd] = useState(!Boolean(session));

    const handleSignIn = () => {
        usePendingSave.setGameMode(gameMode);
        usePendingSave.setScore(score);
        usePendingSave.setResult(gameState as GameResult);
        usePendingSave.setDuration(gameDuration);
        usePendingSave.setPlatform(platform);
        usePendingSave.setGameEndCause(gameEndCause);
        usePendingSave.setReplayData(null);
    };

    return (
        <PageWrapper>
            <Header />
            <div className="flex flex-col items-center mt-6">
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
            {!session && <AuthFooter />}
        </PageWrapper>
    );
}
