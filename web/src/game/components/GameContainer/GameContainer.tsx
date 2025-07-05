import React, { useRef } from "react";
import GameHeader from "./GameHeader";
import GameMenu from "./GameMenu";
import GameInstructions from "./GameInstructions";
import GameEndModal from "../GameEndModal";
import useGameLogic from "./useGameLogic";

const GameContainer: React.FC = () => {
    const gameContainerRef = useRef<HTMLDivElement>(null);

    const {
        displayHeight,
        displayWidth,
        gameMode,
        gameState,
        score,
        record,
        isNewRecord,
        setGameMode,
        renderGameEndModal,
        handleRestart,
        handleBackToMenu,
    } = useGameLogic(gameContainerRef);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="flex flex-col items-center gap-4 p-6 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl">
                <GameHeader
                    gameMode={gameMode}
                    score={score}
                    record={record}
                    onBackToMenu={handleBackToMenu}
                />

                <div
                    className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-black/20"
                    style={{ height: displayHeight, width: displayWidth }}
                >
                    <div
                        ref={gameContainerRef}
                        className="rounded-2xl overflow-hidden"
                    />
                    {gameMode === "menu" && (
                        <GameMenu setGameMode={setGameMode} />
                    )}
                    {renderGameEndModal()}
                </div>

                {gameMode !== "menu" && <GameInstructions />}
            </div>
        </div>
    );
};

export default GameContainer;
