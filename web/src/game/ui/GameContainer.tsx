import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { grid } from "../../consts";
import GameEndModal from "./GameEndModal";
import GameSceneSolo from "../scenes/GameSceneSolo";
import GameSceneVersus from "../scenes/GameSceneVersus";

const GameContainer: React.FC = () => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const width = grid.cols * grid.cellSizePx;
    const height = grid.rows * grid.cellSizePx;
    const aspectRatio = width / height;

    const displayHeight = "80vh";
    const displayWidth = `calc(${displayHeight} * ${aspectRatio})`;

    const [gameMode, setGameMode] = useState<"menu" | "solo" | "versus">(
        "menu"
    );
    const [gameState, setGameState] = useState<
        "playing" | "gameOver" | "win" | "draw"
    >("playing");

    useEffect(() => {
        if (!gameContainerRef.current) {
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

    const getActiveScene = (game: Phaser.Game, mode: string) => {
        const sceneKey = mode === "solo" ? "GameSceneSolo" : "GameSceneVersus";
        return game.scene.getScene(sceneKey) as GameSceneSolo | GameSceneVersus;
    };

    const renderMenu = () => (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-10">
            <button
                className="bg-green-500 text-white px-6 py-3 rounded mb-4 text-xl"
                onClick={() => setGameMode("solo")}
            >
                Solo Play
            </button>
            <button
                className="bg-blue-500 text-white px-6 py-3 rounded text-xl disabled:opacity-50"
                onClick={() => setGameMode("versus")}
                disabled={true}
                title="Coming soon..."
            >
                Versus AI (Coming Soon)
            </button>
        </div>
    );

    function handleRestart() {
        setGameState("playing");

        const game = window.game as Phaser.Game;
        if (game) {
            const scene = getActiveScene(game, gameMode);
            scene.onReset();
        }
    }

    const renderGameEndModal = () => {
        switch (gameState) {
            case "gameOver":
                return (
                    <GameEndModal onRestart={handleRestart}>
                        Game Over! Click to Restart
                    </GameEndModal>
                );
            case "win":
                return (
                    <GameEndModal onRestart={handleRestart}>
                        You won! Click to restart
                    </GameEndModal>
                );
            case "draw":
                return (
                    <GameEndModal onRestart={handleRestart}>
                        It's a tie! Click to restart
                    </GameEndModal>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center p-4 bg-blue-300 border border-rose-600">
                <div className="w-full flex justify-between p-4 border border-fuchsia-600">
                    <div className="align-middle">
                        {"APPLES"} <span>🍎</span>
                    </div>
                    <div>{"record"} 🏆</div>
                </div>

                <div
                    className="relative border-2 border-white rounded"
                    style={{
                        height: displayHeight,
                        width: displayWidth,
                    }}
                >
                    <div ref={gameContainerRef} />
                    {gameMode === "menu" && renderMenu()}
                    {renderGameEndModal()}
                </div>
            </div>
        </div>
    );
};

export default GameContainer;
