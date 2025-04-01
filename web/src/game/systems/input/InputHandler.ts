import Phaser from "phaser";
import { GameState } from "../../../../public/pkg/snake_spark";

export class InputHandler {
    private lastKeys = new Set<string>();

    constructor(scene: Phaser.Scene, gameState: GameState) {
        scene.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (["w", "a", "s", "d"].includes(key)) {
                // Clear other keys
                this.lastKeys.forEach((k) => {
                    if (k !== key) {
                        gameState.set_input_key(k, false);
                    }
                });
                this.lastKeys.clear();
                // Set new key
                gameState.set_input_key(key, true);
                this.lastKeys.add(key);
            }
        });

        scene.input.keyboard!.on("keyup", (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            gameState.set_input_key(key, false);
            this.lastKeys.delete(key);
        });
    }
}
