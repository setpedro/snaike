import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { grid } from "../../consts";
import GameEndModal from "../components/GameContainer/GameEndModal";
import GameSceneSolo from "../scenes/GameSceneSolo";
import GameSceneVersus from "../scenes/GameSceneVersus";

const GameContainer: React.FC = () => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
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
    const [record, setRecord] = useState(() => {
        return parseInt(localStorage.getItem("snake-record") || "0");
    });

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

    const updateRecord = (currentScore: number) => {
        if (currentScore > record) {
            setRecord(currentScore);
            localStorage.setItem("snake-record", currentScore.toString());
        }
    };

    useEffect(() => {
        updateRecord(score);
    }, [score, record]);

    const renderMenu = () => (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/70 backdrop-blur-sm z-10 rounded-2xl">
            <div className="flex flex-col gap-4 p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-bold text-white text-center mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text">
                    🐍 Snake Game
                </h2>
                <button
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg transition-all duration-200 transform hover:scale-105 border border-emerald-400/20"
                    onClick={() => setGameMode("solo")}
                >
                    🎮 Solo Play
                </button>
                <button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg transition-all duration-200 transform hover:scale-105 border border-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={() => setGameMode("versus")}
                    disabled={false}
                    title="Coming soon..."
                >
                    🤖 Versus AI (Coming Soon)
                </button>
            </div>
        </div>
    );

    function handleRestart() {
        setGameState("playing");
        setScore(0);

        const game = window.game as Phaser.Game;
        if (game) {
            const scene = getActiveScene(game, gameMode);
            scene.onReset();
        }
    }

    function handleBackToMenu() {
        setGameMode("menu");
        setGameState("playing");
        setScore(0);

        const game = window.game as Phaser.Game;
        if (game) {
            game.destroy(true);
            window.game = undefined;
        }
    }

    const renderGameEndModal = () => {
        const isNewRecord = score > 0 && score === record;

        switch (gameState) {
            case "gameOver":
                return (
                    <GameEndModal
                        onRestart={handleRestart}
                        score={score}
                        record={record}
                        isNewRecord={isNewRecord}
                    >
                        Game Over!
                    </GameEndModal>
                );
            case "win":
                return (
                    <GameEndModal
                        onRestart={handleRestart}
                        score={score}
                        record={record}
                        isNewRecord={isNewRecord}
                    >
                        Victory!
                    </GameEndModal>
                );
            case "draw":
                return (
                    <GameEndModal
                        onRestart={handleRestart}
                        score={score}
                        record={record}
                        isNewRecord={isNewRecord}
                    >
                        Draw!
                    </GameEndModal>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="flex flex-col items-center gap-4 p-6 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl">
                <div className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl border border-white/10 backdrop-blur-sm">
                    {gameMode !== "menu" && (
                        <button
                            onClick={handleBackToMenu}
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 font-medium"
                        >
                            <span className="text-lg">←</span>
                            <span>Menu</span>
                        </button>
                    )}

                    {gameMode === "menu" && (
                        <div className="flex items-center gap-3 text-white font-bold text-lg">
                            <span className="text-2xl">🐍</span>
                            <span className="text-emerald-400">Snake Game</span>
                        </div>
                    )}

                    {gameMode !== "menu" && (
                        <div className="flex items-center gap-3 text-white font-bold text-lg">
                            <span className="text-2xl">🍎</span>
                            <span className="text-emerald-400">{score}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-white font-bold text-lg">
                        <span className="text-2xl">🏆</span>
                        <span className="text-yellow-400">{record}</span>
                    </div>
                </div>

                <div
                    className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-black/20"
                    style={{
                        height: displayHeight,
                        width: displayWidth,
                    }}
                >
                    <div
                        ref={gameContainerRef}
                        className="rounded-2xl overflow-hidden"
                    />
                    {gameMode === "menu" && renderMenu()}
                    {renderGameEndModal()}
                </div>

                {gameMode !== "menu" && (
                    <div className="text-center text-white/70 text-sm max-w-md">
                        <p className="mb-2">
                            Use{" "}
                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">
                                WASD
                            </kbd>{" "}
                            or{" "}
                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">
                                Arrow Keys
                            </kbd>{" "}
                            to move
                        </p>
                        <p>Swipe on mobile 📱</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameContainer;
