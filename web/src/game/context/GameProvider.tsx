import React from "react";
import { GameContext } from "./GameContext";
import type { GameContextType } from "../types";

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
