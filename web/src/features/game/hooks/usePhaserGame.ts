import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GRID } from "@/features/shared/consts";
import GameSceneSolo from "@/features/phaser/scenes/GameSceneSolo";
import GameSceneVersus from "@/features/phaser/scenes/GameSceneVersus";
import { GameEndCause, GameResult, GameState, GameViewMode } from "../types";

type Props = {
    gameMode: GameViewMode;
    setGameMode: (mode: GameViewMode) => void;
    setGameState: (state: GameState) => void;
    setGameEndCause: (cause: GameEndCause) => void;
    setGameDuration: (duration: number) => void;
    setScore: (score: number) => void;
    resetGame: () => void;
};

export function usePhaserGame({
    gameMode,
    setGameMode,
    setGameState,
    setGameEndCause,
    setGameDuration,
    setScore,
    resetGame,
}: Props) {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const width = GRID.cols * GRID.cellSizePx;
    const height = GRID.rows * GRID.cellSizePx;

    useEffect(() => {
        if (!gameContainerRef.current || gameMode === "menu") {
            return;
        }

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width,
            height,
            parent: gameContainerRef.current,
            scene: gameMode === "solo" ? [GameSceneSolo] : [GameSceneVersus],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
        };

        const game = new Phaser.Game(config);
        window.game = game;

        game.events.on("ready", () => {
            const scene = getActiveScene(game, gameMode);
            scene.setGameEndCallback(() => {});

            window.onScoreUpdate = (newScore: number) => {
                setScore(newScore);
            };

            const gameEndResultMap: Record<
                Exclude<GameEndCause, null>,
                GameResult
            > = {
                wall: "lose",
                self: "lose",
                filled: "win",
                aiHitWall: "win",
                aiHitSelf: "win",
                aiFilled: "lose",
                humanHitAi: "lose",
                aiHitHuman: "win",
                headOnCollision: "draw",
                bothFilled: "draw",
            };

            window.onGameEnd = (cause: GameEndCause, duration: number) => {
                scene.handleEndGameFromWasm();

                setGameEndCause(cause);
                setGameState(gameEndResultMap[cause!]);
                setGameDuration(duration)
            };
        });

        return () => {
            game.destroy(true);
            window.game = undefined;
        };
    }, [gameMode]);

    const getActiveScene = (game: Phaser.Game, mode: string) => {
        const sceneKey = mode === "solo" ? "GameSceneSolo" : "GameSceneVersus";
        return game.scene.getScene(sceneKey) as GameSceneSolo | GameSceneVersus;
    };

    const handleRestart = () => {
        resetGame();
        const game = window.game as Phaser.Game;
        if (game) {
            const scene = getActiveScene(game, gameMode);
            scene.onReset();
        }
    };

    const handleBackToMenu = () => {
        resetGame();
        setGameMode("menu");
        const game = window.game as Phaser.Game;
        if (game) {
            game.destroy(true);
            window.game = undefined;
        }
    };

    return {
        gameContainerRef,
        handleRestart,
        handleBackToMenu,
    };
}
