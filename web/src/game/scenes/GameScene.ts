import Phaser from "phaser";
import { createGrid } from "../systems/createGrid";
import init, { Rectangle } from "../../../public/pkg/snake_spark";
import { colors, sizes } from "../../consts";
import { InputHandler } from "../systems/input/InputHandler";

class GameScene extends Phaser.Scene {
    private inputHandler!: InputHandler;
    private snake!: Rectangle;
    private snakeGraphics!: Phaser.GameObjects.Rectangle;
    private pixelPosition: [number, number] = [210, 210];

    constructor() {
        super({ key: "GameScene" });
    }

    async create() {
        await init();
        this.snake = new Rectangle();
        createGrid(this);

        this.snakeGraphics = this.add
            .rectangle(
                this.pixelPosition[0],
                this.pixelPosition[1],
                sizes.square - sizes.gap,
                sizes.square - sizes.gap,
                colors.snake.human
            )
            .setOrigin(0.5);

        this.inputHandler = new InputHandler(this);
    }

    private lastTime: number = 0;

    update(time: number) {
        if (!this.lastTime) this.lastTime = time;
        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.inputHandler.handleInput(this.snake);

        this.snake.update(deltaTime);

        const [xGrid, gridY] = this.snake.position;

        this.snakeGraphics.setPosition(
            xGrid * sizes.square,
            gridY * sizes.square
        );
    }

    onGameOver() {
        console.log("Game Over!");
        this.scene.restart();
    }

    shutdown() {
        if (this.snakeGraphics) this.snakeGraphics.destroy();
    }
}

window.onGameOver = () => {
    const sceneManager = window.game.scene;
    const gameScene = sceneManager.getScene("GameScene") as GameScene;

    gameScene.onGameOver();
};

export default GameScene;
