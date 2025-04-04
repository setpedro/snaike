import Phaser from "phaser";
import { colors, grid } from "../../consts";

export function createGrid(scene: Phaser.Scene): void {
    const gap = 1;
    const width = grid.cols * grid.cellSizePx;
    const height = grid.rows * grid.cellSizePx;
    const cols = grid.cols;
    const rows = grid.rows;

    const playWidth = cols * grid.cellSizePx;
    const playHeight = rows * grid.cellSizePx;
    const offsetX = (width - playWidth) / 2;
    const offsetY = (height - playHeight) / 2;

    scene.add
        .rectangle(
            width / 2,
            height / 2,
            playWidth + gap * 2,
            playHeight + gap * 2,
            colors.grid.border
        )
        .setOrigin(0.5)
        .setAlpha(0.7);

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const color =
                (x + y) % 2 ? colors.grid.darkTile1 : colors.grid.darkTile2;
            scene.add
                .rectangle(
                    offsetX + x * grid.cellSizePx + grid.cellSizePx / 2,
                    offsetY + y * grid.cellSizePx + grid.cellSizePx / 2,
                    grid.cellSizePx - gap,
                    grid.cellSizePx - gap,
                    color
                )
                .setOrigin(0.5);
        }
    }
}
