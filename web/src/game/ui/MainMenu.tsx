import React from "react";
import { GameMode } from "../types";

type Props = {
    onSelectMode: (mode: GameMode) => void;
};

export default function MainMenu({ onSelectMode }: Props) {
    return (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/70 backdrop-blur-sm z-10 rounded-2xl">
            <div className="flex flex-col gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-bold text-white text-center mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text">
                    🐍 Snake Game
                </h2>
                <button
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg transition-all duration-200 transform hover:scale-105 border border-emerald-400/20"
                    onClick={() => onSelectMode("solo")}
                >
                    🎮 Solo Play
                </button>
                <button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg transition-all duration-200 transform hover:scale-105 border border-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={() => onSelectMode("versus")}
                    disabled={false}
                    title="Coming soon..."
                >
                    🤖 Versus AI (Coming Soon)
                </button>
            </div>
        </div>
    );
}
