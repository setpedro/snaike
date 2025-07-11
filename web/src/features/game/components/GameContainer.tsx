import React from "react";
import { GameHeader } from "./GameHeader";
import { GameCanvas } from "./GameCanvas";
import { GameControls } from "./GameControls";
import { GameProvider } from "../context/GameProvider";

export function GameContainer() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="flex flex-col items-center gap-4 p-6 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl w-full max-w-4xl">
                <GameProvider>
                    <GameHeader />
                        <GameCanvas />
                    <GameControls />
                </GameProvider>
            </div>
        </div>
    );
}
