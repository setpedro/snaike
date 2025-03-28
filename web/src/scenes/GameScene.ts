import Phaser from "phaser";
import { createGrid } from "../utils/createGrid";
import init, { Rectangle } from "../../public/pkg/snake_spark";
import { colors, sizes } from "../consts";

class GameScene extends Phaser.Scene {
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
  }

  update() {
    const [dirX, dirY] = this.snake.direction();
    const speed = 2;

    this.pixelPosition[0] += dirX * speed;
    this.pixelPosition[1] += dirY * speed;

    this.snakeGraphics.setPosition(
      this.pixelPosition[0],
      this.pixelPosition[1]
    );

    const gridX = Math.round(this.pixelPosition[0] / sizes.square);
    const gridY = Math.round(this.pixelPosition[1] / sizes.square);
    this.snake.update_position(gridX, gridY);
  }
}

export default GameScene;
