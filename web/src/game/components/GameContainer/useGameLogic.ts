import { useEffect, useState } from "react";
import Phaser from "phaser";
import GameSceneSolo from "../../scenes/GameSceneSolo";
import GameSceneVersus from "../../scenes/GameSceneVersus";
import { grid } from "../../../consts";
// Update the import path to match the actual location and filename of GameEndModal

export default function useGameLogic(ref: React.RefObject<HTMLDivElement>) {
    const width = grid.cols * grid.cellSizePx;
    const height = grid.rows * grid.cellSizePx;
    const aspectRatio = width / height;

    const displayHeight = "70vh";
    const displayWidth = `calc(${displayHeight} * ${aspectRatio})`;

    const [gameMode, setGameMode] = useState<"menu" | "solo" | "versus">(
        "menu"
    );
    const [gameState, setGameState] = useState<
        "playing" | "gameOver" | "win" | "draw"
    >("playing");
    const [score, setScore] = useState(0);
    const [record, setRecord] = useState(() =>
        parseInt(localStorage.getItem("snake-record") || "0")
    );

    useEffect(() => {
        if (!ref.current || gameMode === "menu") return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width,
            height,
            parent: ref.current,
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

            window.onScoreUpdate = (newScore: number) => setScore(newScore);
            window.onGameOver = () => {
                scene.handleEndGameFromWasm();
                setGameState("gameOver");
            };
            window.onGameWin = () => {
                scene.handleEndGameFromWasm();
                setGameState("win");
            };
            window.onGameDraw = () => {
                scene.handleEndGameFromWasm();
                setGameState("draw");
            };
        });

        return () => {
            game.destroy(true);
            window.game = undefined;
        };
    }, [gameMode]);

    useEffect(() => {
        if (score > record) {
            setRecord(score);
            localStorage.setItem("snake-record", score.toString());
        }
    }, [score]);

    const getActiveScene = (game: Phaser.Game, mode: string) => {
        const key = mode === "solo" ? "GameSceneSolo" : "GameSceneVersus";
        return game.scene.getScene(key) as GameSceneSolo | GameSceneVersus;
    };

    const handleRestart = () => {
        setGameState("playing");
        setScore(0);
        const game = window.game as Phaser.Game;
        if (game) getActiveScene(game, gameMode).onReset();
    };

    const handleBackToMenu = () => {
        setGameMode("menu");
        setGameState("playing");
        setScore(0);
        const game = window.game as Phaser.Game;
        if (game) {
            game.destroy(true);
            window.game = undefined;
        }
    };

    const isNewRecord = score > 0 && score === record;

    const renderGameEndModal = () => {
        if (!["gameOver", "win", "draw"].includes(gameState)) return null;
        const messages: Record<string, string> = {
            gameOver: "Game Over!",
            win: "Victory!",
            draw: "Draw!",
        };
        return (
            <GameEndModal
                onRestart={handleRestart}
                score={score}
                record={record}
                isNewRecord={isNewRecord}
            >
                {messages[gameState]}
            </GameEndModal>
        );
    };

    return {
        displayHeight,
        displayWidth,
        gameMode,
        setGameMode,
        gameState,
        score,
        record,
        isNewRecord,
        handleRestart,
        handleBackToMenu,
        renderGameEndModal,
    };
}
