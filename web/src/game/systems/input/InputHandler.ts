import Phaser from "phaser";
import { GameState } from "../../../../public/pkg/snake_spark";

export class InputHandler {
    private lastKeys = new Set<string>();

    constructor(scene: Phaser.Scene, gameState: GameState) {
        const arrowKeyMap: { [key: string]: string } = {
            arrowup: "w",
            arrowleft: "a",
            arrowdown: "s",
            arrowright: "d",
        };

        scene.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const mappedKey = arrowKeyMap[key] || key;

            if (["w", "a", "s", "d"].includes(mappedKey)) {
                // Clear other direction keys
                this.lastKeys.forEach((k) => {
                    if (k !== mappedKey) {
                        gameState.set_input_key(k, false);
                    }
                });
                this.lastKeys.clear();

                // Set new direction key
                gameState.set_input_key(mappedKey, true);
                this.lastKeys.add(mappedKey);
            }
        });

        scene.input.keyboard!.on("keyup", (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const mappedKey = arrowKeyMap[key] || key;

            if (["w", "a", "s", "d"].includes(mappedKey)) {
                gameState.set_input_key(mappedKey, false);
                this.lastKeys.delete(mappedKey);
            }
        });
    }
}
