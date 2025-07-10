import React from "react";
import { useGameState } from "../hooks/useGameState";
import { usePhaserGame } from "../hooks/usePhaserGame";
import { GameHeader } from "./GameHeader";
import { GameCanvas } from "./GameCanvas";
import { GameControls } from "./GameControls";
import { GameProvider } from "../context/GameProvider";

export function GameContainer() {
    const {
        gameMode,
        gameState,
        score,
        record,
        setGameMode,
        setGameState,
        setScore,
        resetGame,
    } = useGameState();

    const { gameContainerRef, handleRestart, handleBackToMenu } = usePhaserGame(
        {
            gameMode,
            setGameMode,
            setGameState,
            setScore,
            resetGame,
        }
    );

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="flex flex-col items-center gap-4 p-6 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl w-full max-w-4xl">
                <GameHeader
                    gameMode={gameMode}
                    score={score}
                    record={record}
                    onBackToMenu={handleBackToMenu}
                />

                <div className="w-full flex justify-center">
                    <GameProvider
                        value={{
                            gameMode,
                            gameState,
                            score,
                            record,
                            onRestart: handleRestart,
                            onBackToMenu: handleBackToMenu,
                        }}
                    >
                        <GameCanvas
                            gameContainerRef={gameContainerRef}
                            onSelectMode={setGameMode}
                        />
                    </GameProvider>
                </div>

                <GameControls />
            </div>
        </div>
    );
}
