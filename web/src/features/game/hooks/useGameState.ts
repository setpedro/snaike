import { useState, useEffect } from "react";
import { GameMode, GameState } from "../types";

export function useGameState() {
    const [gameMode, setGameMode] = useState<GameMode>("menu");
    const [gameState, setGameState] = useState<GameState>("playing");
    const [score, setScore] = useState(0);
    const [record, setRecord] = useState(() =>
        parseInt(localStorage.getItem("snake-record") || "0")
    );

    useEffect(() => {
        if (score > record) {
            setRecord(score);
            localStorage.setItem("snake-record", score.toString());
        }
    }, [score]);

    const resetGame = () => {
        setGameState("playing");
        setScore(0);
    };

    return {
        gameMode,
        gameState,
        score,
        record,
        setGameMode,
        setGameState,
        setScore,
        resetGame,
    };
}
