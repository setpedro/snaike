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

    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        if (!gameContainerRef.current) {
            return;
        }

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width, // Keep base dimensions for game logic
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
            scene.setGameOverCallback(() => {
                setIsGameOver(true);
            });

            // Listens for game over events triggered by WASM
            window.onGameOver = () => scene.handleGameOverFromWasm();
        });

        return () => {
            game.destroy(true);
            window.game = undefined;
        };
    }, []);

    function handleRestart() {
        setIsGameOver(false);

        const game = window.game as Phaser.Game;
        if (game) {
            const scene = game.scene.getScene("GameScene") as GameScene;
            scene.onReset();
        }
    }

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
                {isGameOver && <GameOverModal onRestart={handleRestart} />}
            </div>
        </div>
    );
};

export default GameContainer;
