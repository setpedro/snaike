import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    PropsWithChildren,
} from "react";
import type { GameMode, GameState } from "../types";
import { usePhaserGame } from "../hooks/usePhaserGame";

type GameContextType = {
    gameMode: GameMode;
    gameState: GameState;
    score: number;
    record: number;
    setGameMode: (mode: GameMode) => void;
    setGameState: (state: GameState) => void;
    setScore: (score: number) => void;
    resetGame: () => void;
    onRestart: () => void;
    onBackToMenu: () => void;
    gameContainerRef: React.RefObject<HTMLDivElement | null>;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
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
    }, [score, record]);

    const resetGame = () => {
        setGameState("playing");
        setScore(0);
    };

    const { gameContainerRef, handleRestart, handleBackToMenu } = usePhaserGame(
        {
            gameMode,
            setGameMode,
            setGameState,
            setScore,
            resetGame,
        }
    );

    return (
        <GameContext.Provider
            value={{
                gameMode,
                gameState,
                score,
                record,
                setGameMode,
                setGameState,
                setScore,
                resetGame,
                onRestart: handleRestart,
                onBackToMenu: handleBackToMenu,
                gameContainerRef,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGameContext() {
    const ctx = useContext(GameContext);
    if (!ctx) {
        throw new Error("useGameContext must be used within GameProvider");
    }
    return ctx;
}
