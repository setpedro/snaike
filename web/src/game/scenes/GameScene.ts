import Phaser from "phaser";
import { createGrid } from "../systems/createGrid";
import init, { Rectangle } from "../../../public/pkg/snake_spark";
import { colors, sizes } from "../../consts";
import { InputHandler } from "../systems/input/InputHandler";

class GameScene extends Phaser.Scene {
    private snake!: Rectangle;
    private snakeGraphics!: Phaser.GameObjects.Rectangle;

    constructor() {
        super({ key: "GameScene" });
    }

    async create() {
        await init();
        this.snake = new Rectangle();
        createGrid(this);

        const [x, y] = this.snake.position;

        this.snakeGraphics = this.add
            .rectangle(
                x,
                y,
                sizes.square - sizes.gap,
                sizes.square - sizes.gap,
                colors.snake.human
            )
            .setOrigin(0.5);

        new InputHandler(this, this.snake);
    }

    private lastTime: number = 0;

    update(time: number) {
        if (!this.lastTime) this.lastTime = time;
        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.snake.update(deltaTime);

        const [x, y] = this.snake.position;
        this.snakeGraphics.setPosition(x, y);
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
