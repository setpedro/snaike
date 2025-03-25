import Phaser from "phaser";
import { sizes, colors } from "./consts";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    console.log("JS running");
    // No assets yet
  }

  createGrid() {
    // semi-transparent green rectangle for the border
    const border = this.add
      .rectangle(
        sizes.width / 2,
        sizes.height / 2,
        sizes.width,
        sizes.height,
        colors.gridBorderColor
      )
      .setOrigin(0.5)
      .setAlpha(0.5);

    const gap = 1;
    const interGap = 1;
    const numTilesX = Math.floor(
      (sizes.width - gap * 2) / (sizes.square + interGap)
    );
    const tileWidth =
      (sizes.width - gap * 2 - (numTilesX - 1) * interGap) / numTilesX;
    const numTilesY = Math.floor(
      (sizes.height - gap * 2) / (sizes.square + interGap)
    );
    const tileHeight =
      (sizes.height - gap * 2 - (numTilesY - 1) * interGap) / numTilesY;

    for (let file_i = 0; file_i < numTilesX; file_i++) {
      for (let rank_i = 0; rank_i < numTilesY; rank_i++) {
        const color =
          (file_i + rank_i) % 2 === 0 ? colors.darkTile1 : colors.darkTile2;
        const rectangle = this.add
          .rectangle(
            gap + file_i * (tileWidth + interGap),
            gap + rank_i * (tileHeight + interGap),
            tileWidth,
            tileHeight,
            color
          )
          .setOrigin(0, 0);
      }
    }
  }

  create() {
    this.createGrid();
  }

  update() {}
}

const config = {
  type: Phaser.AUTO,
  width: sizes.width,
  height: sizes.height,
  scene: GameScene,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
};

const game = new Phaser.Game(config);
