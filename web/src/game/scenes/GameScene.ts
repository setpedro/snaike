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
    private gameOverCallback!: () => void;
    private gameWinCallback!: () => void;
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

    spawnFood() {
        if (this.foodGraphics) {
            this.foodGraphics.destroy();
        }

        const [foodX, foodY] = this.gameState.food;
        console.log(foodX, foodY);

        if (foodX === -1 && foodY === -1) {
            this.foodGraphics = null; // Ensure no food is rendered
            return;
        }

        this.foodGraphics = this.add
            .rectangle(
                foodX,
                foodY,
                grid.cellSizePx - VISUAL.gap,
                grid.cellSizePx - VISUAL.gap,
                colors.food
            )
            .setOrigin(0.5);
    }

    spawnSnake() {
        if (this.snakeSegments.length > 0) {
            this.snakeSegments.forEach((segment) => segment.destroy());
            this.snakeSegments = [];
        }
        if (this.snakeConnectors.length > 0) {
            this.snakeConnectors.forEach((connector) => connector.destroy());
            this.snakeConnectors = [];
        }

        const [x, y] = this.gameState.get_snake_position() as unknown as [
            number,
            number
        ];
        this.snakeSegments = [this.createSegment(x, y)];
    }

    private createSegment(x: number, y: number) {
        return this.add
            .rectangle(
                x,
                y,
                grid.cellSizePx - VISUAL.gap,
                grid.cellSizePx - VISUAL.gap,
                colors.snake.human
            )
            .setOrigin(0.5);
    }

    private createConnector() {
        return this.add
            .rectangle(0, 0, 1, 1, colors.snake.human)
            .setOrigin(0.5)
            .setVisible(false);
    }

    private updateConnectors(positions: number[]) {
        let connectorIndex = 0;
        for (let i = 0; i < positions.length / 2 - 1; i++) {
            const x1 = positions[i * 2];
            const y1 = positions[i * 2 + 1];
            const x2 = positions[(i + 1) * 2];
            const y2 = positions[(i + 1) * 2 + 1];

            // Check if segments are adjacent
            const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            if (distance <= grid.cellSizePx * 1.5) {
                // Ensure enough connectors exist
                if (connectorIndex >= this.snakeConnectors.length) {
                    const newConnector = this.createConnector();
                    this.snakeConnectors.push(newConnector);
                }

                // Update the connector
                const connector = this.snakeConnectors[connectorIndex];
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                const deltaX = Math.abs(x2 - x1);
                const deltaY = Math.abs(y2 - y1);
                let width, height;
                if (deltaX > deltaY) {
                    width = deltaX;
                    height = grid.cellSizePx - VISUAL.gap;
                } else {
                    width = grid.cellSizePx - VISUAL.gap;
                    height = deltaY;
                }
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
                this.snakeSegments.push(this.createSegment(x, y));
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

    setGameOverCallback(cb: () => void) {
        this.gameOverCallback = cb;
    }

    setGameWinCallback(cb: () => void) {
        this.gameWinCallback = cb;
    }

    handleGameOverFromWasm() {
        this.onGameOver();
        this.gameOverCallback();
    }

    handleGameWinFromWasm() {
        this.onGameWin();
        this.gameWinCallback();
    }

    onGameWin() {
        this.scene.pause();
    }

    onGameOver() {
        this.scene.pause();
    }

    onReset() {
        // Just mark for reset but don't free yet
        this.isInRestartFrameGap = true;
        this.scene.restart();
    }
}

export default GameScene;
