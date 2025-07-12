import {
    createContext,
    useContext,
    useEffect,
    useState,
    PropsWithChildren,
    RefObject,
    useCallback,
} from "react";
import type { GameViewMode, GameState, GameMode } from "../types";
import { usePhaserGame } from "../hooks/usePhaserGame";
import { useAuthContext } from "../../auth/context/AuthProvider";
import { saveGame } from "../services/saveGame";
import { getRecord } from "../services/getRecord";
import { saveRecord } from "../services/saveRecord";
import { usePendingSave } from "../store/pendingSave";
import { Session } from "@supabase/supabase-js";

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

    const fetchRecord = useCallback(async (session: Session) => {
        const fetchedRecord = await getRecord(session.user.id);
        setRecord(fetchedRecord);
        setIsRecordLoaded(true);
    }, []);

    useEffect(() => {
        if (!session) {
            setRecord(0);
            setIsRecordLoaded(true);
            return;
        }

        fetchRecord(session);
    }, [session, fetchRecord]);

    const handlePendingSave = useCallback(async (session: Session) => {
        const pendingGameMode = usePendingSave.getGameMode();
        const pendingScore = usePendingSave.getScore();

        if (pendingScore === 0) {
            return;
        }

        await saveGame(
            session.user.id,
            pendingGameMode as GameMode,
            pendingScore
        );
        usePendingSave.reset();

        const fetchedRecord = await getRecord(session.user.id);

        // TODO: abstract to function
        const isNewRecord = pendingScore > fetchedRecord;

        if (isNewRecord) {
            await saveRecord(session.user.id, pendingScore);
            setRecord(pendingScore);
        } else {
            setRecord(fetchedRecord);
        }

        setIsNewRecord(isNewRecord);
    }, []);

    useEffect(() => {
        if (!isRecordLoaded || !session) {
            return;
        }

        handlePendingSave(session);
    }, [session, isRecordLoaded, handlePendingSave]);

    useEffect(() => {
        if (gameState === "playing" || gameMode === "menu" || score === 0) {
            return;
        }

        if (session) {
            saveGame(session.user.id, gameMode, score);
        }

        // TODO: abstract to function
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
