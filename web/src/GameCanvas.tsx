import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import GameScene from "./game/scenes/GameScene";
import { grid } from "./consts";

const GameCanvas: React.FC = () => {
    const gameContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gameContainerRef.current) {
            return;
        }

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: grid.cols * grid.cellSizePx,
            height: grid.rows * grid.cellSizePx,
            parent: gameContainerRef.current,
            scene: [GameScene],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
        };

        const game = new Phaser.Game(config);
        window.game = game;

        return () => {
            game.destroy(true);
            window.game = undefined;
        };
    }, []);

    return (
        <div className="w-screen h-screen">
            <div ref={gameContainerRef} />
        </div>
    );
};

export default GameCanvas;
