import Phaser from "phaser";
import { createGrid } from "../utils/createGrid";
import init, { Rectangle } from "../../public/pkg/snake_spark";
import { colors, sizes } from "../consts";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  private snake!: Rectangle;
  private snakeGraphics!: Phaser.GameObjects.Rectangle;

  async create() {
    await init();
    this.snake = new Rectangle();

    const { square, gap } = sizes;

    createGrid(this);

    this.snakeGraphics = this.add
      .rectangle(210, 210, square - gap, square - gap, colors.snake.human)
      .setOrigin(0.5);
  }

  update() {
    const [gridX, gridY] = this.snake.position();
    const direction = this.snake.direction();
    const { square } = sizes;

    this.snakeGraphics.setPosition(190, 190);
  }
}

export default GameScene;
