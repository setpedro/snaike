import Phaser from "phaser";
import { createRectangle, updateConnectors } from "../utils/snakeRenderer";

export class Snake {
    private segments: Phaser.GameObjects.Rectangle[] = [];
    private connectors: Phaser.GameObjects.Rectangle[] = [];

    constructor(
        private scene: Phaser.Scene,
        private color: number,
        private onGrow?: () => void
    ) {}

    spawn(x: number, y: number) {
        this.destroy();
        this.segments = [createRectangle(this.scene, x, y, this.color)];
    }

    update(headPosition: Float64Array, bodyPositions: Float64Array) {
        // Update head position
        this.segments[0].setPosition(headPosition[0], headPosition[1]);

        // Update body segments
        for (let i = 0; i < bodyPositions.length / 2; i++) {
            const x = bodyPositions[i * 2];
            const y = bodyPositions[i * 2 + 1];

            if (!this.segments[i + 1]) {
                this.segments.push(
                    createRectangle(this.scene, x, y, this.color)
                );
                this.onGrow?.();
            } else {
                this.segments[i + 1].setPosition(x, y);
            }
        }

        const allPositions = [
            headPosition[0],
            headPosition[1],
            ...bodyPositions,
        ];
        updateConnectors(this.scene, allPositions, this.connectors, this.color);
    }

    destroy() {
        this.segments.forEach((segment) => segment.destroy());
        this.connectors.forEach((connector) => connector.destroy());
        this.segments.length = 0;
        this.connectors.length = 0;
    }
}
