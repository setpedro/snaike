import {
    createContext,
    useContext,
    useEffect,
    useState,
    PropsWithChildren,
    RefObject,
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
    isNewRecord: boolean;
    gameContainerRef: RefObject<HTMLDivElement | null>;
    setGameMode: (mode: GameViewMode) => void;
    setGameState: (state: GameState) => void;
    setScore: (score: number) => void;
    resetGame: () => void;
    onRestart: () => void;
    onBackToMenu: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
    const { session } = useAuthContext();

    const [gameMode, setGameMode] = useState<GameViewMode>("menu");
    const [gameState, setGameState] = useState<GameState>("playing");
    const [score, setScore] = useState(0);
    const [record, setRecord] = useState(0);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const [isRecordLoaded, setIsRecordLoaded] = useState(false);

    useEffect(() => {
        if (!session) {
            setRecord(0);
            setIsRecordLoaded(true);
            return;
        }

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
                    setRecord(score);
                    setIsNewRecord(true);
                } else {
                    setRecord(fetchedRecord || 0);
                    setIsNewRecord(false);
                }
            } catch (err) {
                console.error("Error handling pending save:", err);
            }
        };

        handlePendingSave();
    }, [session, isRecordLoaded]);

    useEffect(() => {
        if (gameState === "playing" || gameMode === "menu" || score <= 0) {
            return;
        }

        if (session) {
            saveGame(session.user.id, gameMode, score);
        }

        if (score > record) {
            if (session) {
                saveRecord(session.user.id, score);
            }
            setRecord(score);
            setIsNewRecord(true);
        } else {
            setIsNewRecord(false);
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
                isNewRecord,
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
