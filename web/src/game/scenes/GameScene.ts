import Phaser from "phaser";
import { createGrid } from "../systems/createGrid";
import init, { GameState } from "../../../public/pkg/snake_spark";
import { colors, grid, VISUAL } from "../../consts";
import { InputHandler } from "../systems/input/InputHandler";

class GameScene extends Phaser.Scene {
    private gameState!: GameState;
    private snakeSegments: Phaser.GameObjects.Rectangle[] = [];
    private snakeConnectors: Phaser.GameObjects.Rectangle[] = [];
    private foodGraphics!: Phaser.GameObjects.Rectangle | null;
    private gameEndCallback!: () => void;
    private isInRestartFrameGap = false;

    constructor() {
        super({ key: "GameScene" });
    }

    async create() {
        // If there was a previous gameState, manually free it now
        this.gameState?.free();

        await init();
        this.gameState = new GameState();
        this.isInRestartFrameGap = false;

        createGrid(this);

        this.spawnFood();
        this.spawnSnake();

        new InputHandler(this, this.gameState);
    }

    private destroyGameObjects(objects: Phaser.GameObjects.GameObject[]) {
        objects.forEach((obj) => obj.destroy());
        objects.length = 0;
    }

    spawnFood() {
        if (this.foodGraphics) {
            this.foodGraphics.destroy();
        }

        const [foodX, foodY] = this.gameState.food;

        if (foodX === -1 && foodY === -1) {
            this.foodGraphics = null; // Ensure no food is rendered
            return;
        }

        this.foodGraphics = this.createRectangle(foodX, foodY, colors.food);
    }

    spawnSnake() {
        this.destroyGameObjects(this.snakeSegments);
        this.destroyGameObjects(this.snakeConnectors);

        const [x, y] = this.gameState.get_snake_position() as unknown as [
            number,
            number
        ];
        this.snakeSegments = [this.createRectangle(x, y, colors.snake.human)];
    }

    private createRectangle(
        x: number,
        y: number,
        color: number
    ): Phaser.GameObjects.Rectangle {
        return this.add
            .rectangle(
                x,
                y,
                grid.cellSizePx - VISUAL.gap,
                grid.cellSizePx - VISUAL.gap,
                color
            )
            .setOrigin(0.5);
    }

    private createConnector(): Phaser.GameObjects.Rectangle {
        return this.add
            .rectangle(0, 0, 1, 1, colors.snake.human)
            .setOrigin(0.5)
            .setVisible(false);
    }

    private updateConnectors(positions: number[]) {
        let connectorIndex = 0;
        for (let i = 0; i < positions.length / 2 - 1; i++) {
            const [x1, y1, x2, y2] = [
                positions[i * 2],
                positions[i * 2 + 1],
                positions[(i + 1) * 2],
                positions[(i + 1) * 2 + 1],
            ];

            // Check if segments are adjacent
            const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            if (distance <= grid.cellSizePx * 1.5) {
                // Ensure enough connectors exist
                if (connectorIndex >= this.snakeConnectors.length) {
                    this.snakeConnectors.push(this.createConnector());
                }

                // Update the connector
                const connector = this.snakeConnectors[connectorIndex];
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                const deltaX = Math.abs(x2 - x1);
                const deltaY = Math.abs(y2 - y1);

                const [width, height] =
                    deltaX > deltaY
                        ? [deltaX, grid.cellSizePx - VISUAL.gap]
                        : [grid.cellSizePx - VISUAL.gap, deltaY];

                connector.setPosition(midX, midY);
                connector.setSize(width, height);
                connector.setVisible(true);
                connectorIndex++;
            }
        }

        // Hide unused connectors. Future use case like snake shrinks
        for (let i = connectorIndex; i < this.snakeConnectors.length; i++) {
            this.snakeConnectors[i].setVisible(false);
        }
    }

    private lastTime: number = 0;

    update(time: number) {
        if (this.isInRestartFrameGap) {
            return;
        }

        if (!this.lastTime) {
            this.lastTime = time;
        }

        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.gameState.update(deltaTime);

        const headPos = this.gameState.get_snake_position();
        const bodyPositions = this.gameState.get_body_positions();

        // Update head
        this.snakeSegments[0].setPosition(headPos[0], headPos[1]);

        // Update body segments
        for (let i = 0; i < bodyPositions.length / 2; i++) {
            const x = bodyPositions[i * 2];
            const y = bodyPositions[i * 2 + 1];

            if (!this.snakeSegments[i + 1]) {
                this.snakeSegments.push(
                    this.createRectangle(x, y, colors.snake.human)
                );
                // If there's a new body segment, spawn food
                // TODO: handle this better
                this.spawnFood();
            } else {
                this.snakeSegments[i + 1].setPosition(x, y);
            }
        }

        const allPositions = [headPos[0], headPos[1], ...bodyPositions];
        this.updateConnectors(allPositions);
    }

    setGameEndCallback(cb: () => void) {
        this.gameEndCallback = cb;
    }

    private endGame() {
        this.scene.pause();
        this.gameEndCallback();
    }

    handleGameOverFromWasm() {
        this.endGame();
    }

    handleGameWinFromWasm() {
        this.endGame();
    }

    onReset() {
        // Just mark for reset but don't free yet
        this.isInRestartFrameGap = true;
        this.scene.restart();
    }
}

export default GameScene;
