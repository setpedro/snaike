import { useContext } from "react";
import { GameContext } from "./GameContext";

export function useGameContext() {
    const ctx = useContext(GameContext);
    if (!ctx) {
        throw new Error("GameContext not found");
    }
    return ctx;
}
