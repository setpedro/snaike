import React from "react";
import { useGameContext } from "../context/useGameContext";

export default function GameEndModal() {
    const { gameState, score, record, onRestart } = useGameContext();

    if (gameState === "playing") return null;

    const isNewRecord = score > 0 && score === record;

    const getTitle = () => {
        switch (gameState) {
            case "gameOver":
                return "Game Over!";
            case "win":
                return "Victory!";
            case "draw":
                return "Draw!";
            default:
                return "";
        }
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm text-white flex justify-center items-center z-20 p-4">
            <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md gap-2 p-2 sm:p-6 md:p-8 bg-black/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                <h2 className="text-center text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    {getTitle()}
                </h2>

                <div className="flex flex-col items-center w-full gap-2 px-2 sm:px-0 mb-2">
                    <div className="w-full px-3 py-2 sm:p-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl border border-white/10">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl">🍎</span>
                                <span className="text-sm sm:text-base text-white/80">
                                    Score:
                                </span>
                            </div>
                            <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                                {score}
                            </span>
                        </div>
                    </div>

                    <div className="w-full px-3 py-2 sm:p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-white/10">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl">🏆</span>
                                <span className="text-sm sm:text-base text-white/80">
                                    Best:
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl font-bold text-yellow-400">
                                    {record}
                                </span>
                                {isNewRecord && (
                                    <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full animate-pulse">
                                        NEW!
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full px-2 sm:px-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRestart();
                        }}
                        className="w-full px-6 py-3 sm:px-8 sm:py-4 rounded-2xl text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 border border-emerald-400/20"
                    >
                        🎮 Play Again
                    </button>
                </div>
            </div>
        </div>
    );
}
