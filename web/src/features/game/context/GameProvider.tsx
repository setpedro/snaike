import {
    createContext,
    useContext,
    useEffect,
    useState,
    PropsWithChildren,
    RefObject,
    useCallback,
} from "react";
import type {
    GameViewMode,
    GameState,
    GameMode,
    GameData,
    GameResult,
} from "../types";
import { usePhaserGame } from "../hooks/usePhaserGame";
import { useAuthContext } from "../../auth/context/AuthProvider";
import { saveGame } from "../services/saveGame";
import { getRecord } from "../services/getRecord";
import { usePendingSave } from "../store/pendingSave";
import { Session } from "@supabase/supabase-js";
import { updateProfile } from "@/features/profile/services/updateProfile";
import { useProfileContext } from "@/features/profile/context/ProfileProvider";
import { useIsMobile, usePlatform } from "@/features/shared/hooks/useIsMobile";

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
    const { profile } = useProfileContext();
    const platform = usePlatform();

    const [gameMode, setGameMode] = useState<GameViewMode>("menu");
    const [gameState, setGameState] = useState<GameState>("playing");
    const [score, setScore] = useState(0);
    const [record, setRecord] = useState(0);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const [isRecordLoaded, setIsRecordLoaded] = useState(false);

    // TODO: record state will be abstracted to ProfileContext since it exists.
    const loadRecord = useCallback(async (session: Session) => {
        const _record = await getRecord(session.user.id);
        setRecord(_record);
        setIsRecordLoaded(true);
    }, []);

    useEffect(() => {
        if (!session) {
            setRecord(0);
            setIsRecordLoaded(true);
            return;
        }

        loadRecord(session);
    }, [session, loadRecord]);

    const handlePendingSave = useCallback(async (session: Session) => {
        const pendingGameMode = usePendingSave.getGameMode();
        const pendingScore = usePendingSave.getScore();
        const pendingResult = usePendingSave.getResult();
        const pendingDuration = usePendingSave.getDuration();
        const pendingPlatform = usePendingSave.getPlatform();
        const pendingDeathCause = usePendingSave.getDeathCause();
        const pendingReplayData = usePendingSave.getReplayData();

        if (pendingScore === 0) {
            return;
        }

        const game: GameData = {
            userId: session.user.id,
            gameMode: pendingGameMode as GameMode,
            score: pendingScore,
            result: pendingResult,
            duration: pendingDuration,
            platform: pendingPlatform,
            deathCause: pendingDeathCause,
            replayData: pendingReplayData,
        };

        await saveGame(game);
        usePendingSave.reset();

        const fetchedRecord = await getRecord(session.user.id);

        // TODO: abstract to function
        const isNewRecord = pendingScore > fetchedRecord;

        if (isNewRecord) {
            await updateProfile({
                record: pendingScore,
                display_name:
                    session.user.user_metadata.user_name ||
                    session.user.user_metadata.full_name ||
                    "Unknown Player",
                games_played: 1,
            });
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
            const game: GameData = {
                userId: session.user.id,
                gameMode: gameMode as GameMode,
                score,
                result: gameState as GameResult,
                duration: 0,
                platform,
                deathCause: null,
                replayData: null,
            };

            saveGame(game);
            updateProfile({ games_played: (profile?.games_played ?? 0) + 1 });
        }

        // TODO: abstract to function
        if (score > record) {
            if (session) {
                updateProfile({
                    record: score,
                });
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
                gameContainerRef,
                setGameMode,
                setGameState,
                setScore,
                resetGame,
                onRestart: handleRestart,
                onBackToMenu: handleBackToMenu,
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
