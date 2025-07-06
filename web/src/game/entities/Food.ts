import Phaser from "phaser";
import { colors } from "../../consts";
import { createRectangle } from "../utils/snakeRenderer";

export class Food {
    private graphics: Phaser.GameObjects.Rectangle | null = null;

    constructor(private scene: Phaser.Scene) {}

    spawn(x: number, y: number) {
        this.destroy();

        if (x === -1 && y === -1) {
            return; // Ensure no food is rendered
        }

        this.graphics = createRectangle(this.scene, x, y, colors.food);
        this.graphics.setDepth(0);
    }

    destroy() {
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }
    }
}
