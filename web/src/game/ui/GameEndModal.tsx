import React from "react";
import { useGameContext } from "../context/useGameContext";

export default function GameEndModal() {
    const { gameState, score, record, onRestart } = useGameContext();

    if (gameState === "playing") return null;
    
    const isNewRecord = score > record;

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
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm text-white flex justify-center items-center z-20">
            <div className="bg-black/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full mx-4 text-center">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                        {getTitle()}
                    </h2>
                </div>

                <div className="mb-6 space-y-4">
                    <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl border border-white/10 p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🍎</span>
                                <span className="text-white/80">Score:</span>
                            </div>
                            <span className="text-2xl font-bold text-emerald-400">
                                {score}
                            </span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-white/10 p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🏆</span>
                                <span className="text-white/80">Best:</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-yellow-400">
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

                    {isNewRecord && (
                        <div className="text-center">
                            <p className="text-yellow-400 font-bold animate-bounce">
                                🎉 New Record! 🎉
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRestart();
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 border border-emerald-400/20"
                >
                    🎮 Play Again
                </button>
            </div>
        </div>
    );
}
