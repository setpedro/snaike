import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    PropsWithChildren,
} from "react";
import type { GameViewMode, GameState } from "../types";
import { usePhaserGame } from "../hooks/usePhaserGame";
import { useAuthContext } from "../../auth/context/AuthProvider";
import { saveGame } from "../services/saveGame";
import { getRecord } from "../services/getRecord";
import { saveRecord } from "../services/saveRecord";

type GameContextType = {
    gameMode: GameViewMode;
    gameState: GameState;
    score: number;
    record: number;
    setGameMode: (mode: GameViewMode) => void;
    setGameState: (state: GameState) => void;
    setScore: (score: number) => void;
    resetGame: () => void;
    onRestart: () => void;
    onBackToMenu: () => void;
    gameContainerRef: React.RefObject<HTMLDivElement | null>;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
    const { session } = useAuthContext();

    const [gameMode, setGameMode] = useState<GameViewMode>("menu");
    const [gameState, setGameState] = useState<GameState>("playing");
    const [score, setScore] = useState(0);
    const [record, setRecord] = useState(0);
    const [isRecordLoaded, setIsRecordLoaded] = useState(false);

    // Initial load
    useEffect(() => {
        if (!session) {
            setRecord(0);
            setIsRecordLoaded(true);
            return;
        }

        // If there's a pending OAuth save, skip fetching the old record that would overwrite the new one
        if (sessionStorage.getItem("pendingOAuthSave")) {
            setIsRecordLoaded(true);
            return;
        }

        const fetchRecord = async () => {
            try {
                const fetchedRecord = await getRecord(session.user.id);
                setRecord(fetchedRecord || 0);
            } catch (error) {
                console.error("Error fetching record:", error);
                setRecord(0);
            } finally {
                setIsRecordLoaded(true);
            }
        };

        fetchRecord();
    }, [session]);

    useEffect(() => {
        if (!isRecordLoaded) {
            return;
        }

        const pendingSave = sessionStorage.getItem("pendingOAuthSave");
        if (!pendingSave || !session) {
            return;
        }
        sessionStorage.removeItem("pendingOAuthSave");

        const { gameState, gameMode, score } = JSON.parse(pendingSave);

        if (gameState === "playing" || gameMode === "menu" || score <= 0) {
            return;
        }

        const handlePendingSave = async () => {
            try {
                await saveGame(session.user.id, gameMode, score);

                const fetchedRecord = await getRecord(session.user.id);
                if (score > (fetchedRecord || 0)) {
                    await saveRecord(session.user.id, score);
                    setRecord(score); // Only set if it really beats existing
                } else {
                    setRecord(fetchedRecord || 0); // restore accurate record
                }
            } catch (err) {
                console.error("Error handling pending save:", err);
            }
        };

        handlePendingSave();
    }, [session, isRecordLoaded]);

    // End-of-game
    useEffect(() => {
        if (gameState === "playing" || gameMode === "menu" || score <= 0) {
            return; // TODO: double-check this. useEffect deps?
        }

        if (session) {
            saveGame(session.user.id, gameMode, score); // only save games for authenticated users
        }

        if (score > record) {
            if (session) {
                saveRecord(session.user.id, score); // only save record for authenticated users
            }
            setRecord(score); // setRecord for everyone
        }
    }, [gameState, gameMode, score]);

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
