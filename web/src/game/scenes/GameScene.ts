import Phaser from "phaser";
import { createGrid } from "../systems/createGrid";
import init, { GameState } from "../../../public/pkg/snake_spark";
import { colors, grid, VISUAL } from "../../consts";
import { InputHandler } from "../systems/input/InputHandler";

class GameScene extends Phaser.Scene {
    private gameState!: GameState;
    private snakeSegments: Phaser.GameObjects.Rectangle[] = [];
    private foodGraphics!: Phaser.GameObjects.Rectangle;

    constructor() {
        super({ key: "GameScene" });
    }

    async create() {
        await init();
        this.gameState = new GameState();
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
            console.log("cleaning previous snake");
            this.snakeSegments.forEach((segment) => segment.destroy());
            this.snakeSegments = [];
        }

        console.log(this.snakeSegments);
        const [x, y] = this.snakePosition;
        this.snakeSegments = [this.createSegment(x, y)];
    }

    private get snakePosition(): [number, number] {
        return this.gameState.get_snake_position() as unknown as [
            number,
            number
        ];
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

    private lastTime: number = 0;

    update(time: number) {
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
    }

    onGameOver() {
        console.log("Game Over!");
        this.scene.restart();
    }
}

window.onGameOver = () => {
    const sceneManager = window.game?.scene;
    const gameScene = sceneManager?.getScene("GameScene") as GameScene;

    gameScene.onGameOver();
};

export default GameScene;
