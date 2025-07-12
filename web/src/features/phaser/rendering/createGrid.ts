import Phaser from "phaser";
import { COLORS, GRID } from "@/features/shared/consts";

export function createGrid(scene: Phaser.Scene): void {
    const gap = 1;
    const width = GRID.cols * GRID.cellSizePx;
    const height = GRID.rows * GRID.cellSizePx;
    const cols = GRID.cols;
    const rows = GRID.rows;

    const playWidth = cols * GRID.cellSizePx;
    const playHeight = rows * GRID.cellSizePx;
    const offsetX = (width - playWidth) / 2;
    const offsetY = (height - playHeight) / 2;

    scene.add
        .rectangle(
            width / 2,
            height / 2,
            playWidth + gap * 2,
            playHeight + gap * 2
        )
        .setOrigin(0.5)
        .setAlpha(0.7);

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const color =
                (x + y) % 2 ? COLORS.grid.darkTile1 : COLORS.grid.darkTile2;
            scene.add
                .rectangle(
                    offsetX + x * GRID.cellSizePx + GRID.cellSizePx / 2,
                    offsetY + y * GRID.cellSizePx + GRID.cellSizePx / 2,
                    GRID.cellSizePx - gap,
                    GRID.cellSizePx - gap,
                    color
                )
                .setOrigin(0.5);
        }
    }
}
