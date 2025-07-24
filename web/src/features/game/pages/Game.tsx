import { useState } from "react";
import { GameHeader } from "../components/GameHeader";
import { GameCanvas } from "../components/GameCanvas";
import { GameControls } from "../components/GameControls";
import { useGameContext } from "../context/GameProvider";
import { useAuthContext } from "@/features/auth/context/AuthProvider";
import { AuthModal } from "../../auth/components/Login/AuthModal";
import { usePendingSave } from "../store/pendingSave";
import { AuthFooter } from "@/features/auth/components/Login/AuthFooter";
import { Header } from "@/features/shared/components/Header";
import { PageWrapper } from "@/features/shared/components/PageWrapper";

export function Game() {
    const { session } = useAuthContext();
    const { gameMode, gameState, score, record } = useGameContext();

    const [isFirstGameEnd, setIsFirstGameEnd] = useState(!Boolean(session));

    const handleSignIn = () => {
        usePendingSave.setGameState(gameState);
        usePendingSave.setGameMode(gameMode);
        usePendingSave.setScore(score);
    };

    return (
        <PageWrapper>
            <Header />
            <div className="flex flex-col items-center w-full max-w-4xl sm:mt-8">
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
