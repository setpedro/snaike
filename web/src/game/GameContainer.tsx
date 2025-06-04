import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import { grid } from "../consts";
import GameOverModal from "./GameOverModal";

const GameContainer: React.FC = () => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const width = grid.cols * grid.cellSizePx;
    const height = grid.rows * grid.cellSizePx;
    const aspectRatio = width / height;

    const displayHeight = "90vh";
    const displayWidth = `calc(${displayHeight} * ${aspectRatio})`;

    const [gameState, setGameState] = useState<"playing" | "gameOver" | "win" | "draw">(
        "playing"
    );

    useEffect(() => {
        if (!gameContainerRef.current) {
            return;
        }

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width,
            height,
            parent: gameContainerRef.current,
            scene: [GameScene],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
        };

        const game = new Phaser.Game(config);
        window.game = game;

        game.events.on("ready", () => {
            const scene = game.scene.getScene("GameScene") as GameScene;
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
                setGameState("draw")
            }
        });

        return () => {
            game.destroy(true);
            window.game = undefined;
        };
    }, []);

    function handleRestart() {
        setGameState("playing");

        const game = window.game as Phaser.Game;
        if (game) {
            const scene = game.scene.getScene("GameScene") as GameScene;
            scene.onReset();
        }
    }

    const renderGameEndModal = () => {
        switch (gameState) {
            case "gameOver":
                return (
                    <GameOverModal onRestart={handleRestart}>
                        Game Over! Click to Restart
                    </GameOverModal>
                );
            case "win":
                return (
                    <GameOverModal onRestart={handleRestart}>
                        You won! Click to restart
                    </GameOverModal>
                );
            case "draw": 
                return (
                    <GameOverModal onRestart={handleRestart}>
                        It's a tie! Click to restart
                    </GameOverModal>
                )
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div
                className="relative border-2 border-white p-2 rounded"
                style={{
                    height: displayHeight,
                    width: displayWidth,
                }}
            >
                <div ref={gameContainerRef} />
                {renderGameEndModal()}
            </div>
        </div>
    );
};

export default GameContainer;
