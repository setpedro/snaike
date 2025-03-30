import Phaser from "phaser";
import { Rectangle } from "../../../../public/pkg/snake_spark";

export class InputHandler {
    private lastKeys = new Set<string>();

    constructor(scene: Phaser.Scene, snake: Rectangle) {
        scene.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (!this.lastKeys.has(key)) {
                snake.set_key(key, true);
                this.lastKeys.add(key);
            }
        });

        scene.input.keyboard!.on("keyup", (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            snake.set_key(key, false);
            this.lastKeys.delete(key);
        });
    }
}
