import Phaser from "phaser";
import { sizes, colors } from "../consts";

export function createGrid(scene: Phaser.Scene): void {
  // TODO: not sure about this, keep for now
  // semi-transparent green rectangle for the border.
  const border = scene.add
    .rectangle(
      sizes.width / 2,
      sizes.height / 2,
      sizes.width,
      sizes.height,
      colors.grid.border
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
        (file_i + rank_i) % 2 === 0
          ? colors.grid.darkTile1
          : colors.grid.darkTile2;
      scene.add
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
