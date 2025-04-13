import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import GameScene from "./game/scenes/GameScene";
import { grid } from "./consts";

const GameCanvas: React.FC = () => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const width = grid.cols * grid.cellSizePx;
    const height = grid.rows * grid.cellSizePx;
    const aspectRatio = width / height;

    const displayHeight = "90vh";
    const displayWidth = `calc(${displayHeight} * ${aspectRatio})`;

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

        game.events.on("ready", () => {
            const scene = game.scene.getScene("GameScene") as GameScene;
            scene.setGameOverCallback(() => {
                // TODO
            });

            // Listens for game over events triggered by WASM
            window.onGameOver = () => scene.handleGameOverFromWasm();
        });

        return () => {
            game.destroy(true);
            window.game = undefined;
        };
    }, []);

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
            </div>
        </div>
    );
};

export default GameCanvas;
