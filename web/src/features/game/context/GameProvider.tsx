import React, { createContext, useContext } from "react";
import type { GameMode, GameState } from "../types";

type GameContextType = {
    gameMode: GameMode;
    gameState: GameState;
    score: number;
    record: number;
    onRestart: () => void;
    onBackToMenu: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: GameContextType;
}) {
    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
}

export function useGameContext() {
    const ctx = useContext(GameContext);
    if (!ctx) {
        throw new Error("useGameContext must be used within GameProvider");
    }
    return ctx;
}
