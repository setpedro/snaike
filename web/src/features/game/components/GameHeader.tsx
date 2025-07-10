import React from "react";
import { GameMode } from "../types";

type Props = {
    gameMode: GameMode;
    score: number;
    record: number;
    onBackToMenu: () => void;
};

export function GameHeader({
    gameMode,
    score,
    record,
    onBackToMenu,
}: Props) {
    return (
        <div className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl border border-white/10 backdrop-blur-sm">
            {gameMode !== "menu" && (
                <button
                    onClick={onBackToMenu}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 font-medium"
                >
                    <span className="text-lg">←</span>
                    <span>Menu</span>
                </button>
            )}

            {gameMode === "menu" && (
                <div className="flex items-center gap-3 text-white font-bold text-lg">
                    <span className="text-2xl">🐍</span>
                    <span className="text-emerald-400">Snake Game</span>
                </div>
            )}

            {gameMode !== "menu" && (
                <div className="flex items-center gap-3 text-white font-bold text-lg">
                    <span className="text-2xl">🍎</span>
                    <span className="text-emerald-400">{score}</span>
                </div>
            )}

            <div className="flex items-center gap-3 text-white font-bold text-lg">
                <span className="text-2xl">🏆</span>
                <span className="text-yellow-400">{record}</span>
            </div>
        </div>
    );
}
