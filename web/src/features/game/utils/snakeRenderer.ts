import Phaser from "phaser";
import { GRID, VISUAL } from "../../../shared/consts";

export const updateConnectors = (
    scene: Phaser.Scene,
    positions: number[],
    connectors: Phaser.GameObjects.Rectangle[],
    color: number
) => {
    let connectorIndex = 0;

    for (let i = 0; i < positions.length / 2 - 1; i++) {
        const [x1, y1, x2, y2] = [
            positions[i * 2],
            positions[i * 2 + 1],
            positions[(i + 1) * 2],
            positions[(i + 1) * 2 + 1],
        ];

        // Check if segments are adjacent
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        if (distance <= GRID.cellSizePx * 1.5) {
            if (connectorIndex >= connectors.length) {
                connectors.push(createConnector(scene, color));
            }

            const connector = connectors[connectorIndex];
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const deltaX = Math.abs(x2 - x1);
            const deltaY = Math.abs(y2 - y1);

            const [width, height] =
                deltaX > deltaY
                    ? [deltaX, GRID.cellSizePx - VISUAL.gap]
                    : [GRID.cellSizePx - VISUAL.gap, deltaY];

            connector
                .setPosition(midX, midY)
                .setSize(width, height)
                .setVisible(true);
            connectorIndex++;
        }
    }

    // Hide unused connectors
    for (let i = connectorIndex; i < connectors.length; i++) {
        connectors[i].setVisible(false);
    }

    return connectors;
};

export const createConnector = (scene: Phaser.Scene, color: number) => {
    return scene.add
        .rectangle(0, 0, 1, 1, color)
        .setOrigin(0.5)
        .setVisible(false);
};

export const createRectangle = (
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: number
) => {
    return scene.add
        .rectangle(
            x,
            y,
            GRID.cellSizePx - VISUAL.gap,
            GRID.cellSizePx - VISUAL.gap,
            color
        )
        .setOrigin(0.5);
};
