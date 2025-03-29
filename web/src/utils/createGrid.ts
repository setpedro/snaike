import Phaser from "phaser";
import { sizes, colors } from "../consts";

export function createGrid(scene: Phaser.Scene): void {
    const { width, height, square } = sizes;
    const gap = 1;
    const cols = Math.floor(width / square);
    const rows = Math.floor(height / square);

    const playWidth = cols * square;
    const playHeight = rows * square;
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
                    offsetX + x * square + square / 2,
                    offsetY + y * square + square / 2,
                    square - gap,
                    square - gap,
                    color
                )
                .setOrigin(0.5);
        }
    }
}
