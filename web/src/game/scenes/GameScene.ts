import Phaser from "phaser";
import { createGrid } from "../systems/createGrid";
import init, { GameState } from "../../../public/pkg/snake_spark";
import { colors, grid, VISUAL } from "../../consts";
import { InputHandler } from "../systems/input/InputHandler";

class GameScene extends Phaser.Scene {
    private gameState!: GameState;
    private humanSnakeSegments: Phaser.GameObjects.Rectangle[] = [];
    private humanSnakeConnectors: Phaser.GameObjects.Rectangle[] = [];
    private aiSnakeSegments: Phaser.GameObjects.Rectangle[] = [];
    private aiSnakeConnectors: Phaser.GameObjects.Rectangle[] = [];
    private foodGraphics!: Phaser.GameObjects.Rectangle | null;
    private gameEndCallback!: () => void;
    private isInRestartFrameGap = false;

    constructor() {
        super({ key: "GameScene" });
    }

    async create() {
        // If there was a previous gameState, manually free it now
        this.gameState?.free();

        await init();
        this.gameState = new GameState();
        this.isInRestartFrameGap = false;

        createGrid(this);

        this.spawnFood();
        this.spawnSnake();
        this.spawnAISnake();

        new InputHandler(this, this.gameState);
    }

    private destroyGameObjects(objects: Phaser.GameObjects.GameObject[]) {
        objects.forEach((obj) => obj.destroy());
        objects.length = 0;
    }

    spawnFood() {
        if (this.foodGraphics) {
            this.foodGraphics.destroy();
        }

        const [foodX, foodY] = this.gameState.food;

        if (foodX === -1 && foodY === -1) {
            this.foodGraphics = null; // Ensure no food is rendered
            return;
        }

        this.foodGraphics = this.createRectangle(foodX, foodY, colors.food);
    }

    spawnSnake() {
        this.destroyGameObjects(this.humanSnakeSegments);
        this.destroyGameObjects(this.humanSnakeConnectors);

        const [x, y] = this.gameState.get_human_snake_position() as unknown as [
            number,
            number
        ];
        this.humanSnakeSegments = [
            this.createRectangle(x, y, colors.snake.human),
        ];
    }

    spawnAISnake() {
        this.destroyGameObjects(this.aiSnakeSegments);
        this.destroyGameObjects(this.aiSnakeConnectors);

        const [x, y] = this.gameState.get_ai_snake_position() as unknown as [
            number,
            number
        ];
        this.aiSnakeSegments = [this.createRectangle(x, y, colors.snake.ai)];
    }

    private createRectangle(
        x: number,
        y: number,
        color: number
    ): Phaser.GameObjects.Rectangle {
        return this.add
            .rectangle(
                x,
                y,
                grid.cellSizePx - VISUAL.gap,
                grid.cellSizePx - VISUAL.gap,
                color
            )
            .setOrigin(0.5);
    }

    private createConnector(isAI: boolean): Phaser.GameObjects.Rectangle {
        return this.add
            .rectangle(0, 0, 1, 1, isAI ? colors.snake.ai : colors.snake.human)
            .setOrigin(0.5)
            .setVisible(false);
    }

    private updateConnectors(
        positions: number[],
        connectors: Phaser.GameObjects.Rectangle[],
        color: number
    ) {
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
            if (distance <= grid.cellSizePx * 1.5) {
                if (connectorIndex >= connectors.length) {
                    connectors.push(
                        this.createConnector(color === colors.snake.ai)
                    );
                }

                const connector = connectors[connectorIndex];
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                const deltaX = Math.abs(x2 - x1);
                const deltaY = Math.abs(y2 - y1);

                const [width, height] =
                    deltaX > deltaY
                        ? [deltaX, grid.cellSizePx - VISUAL.gap]
                        : [grid.cellSizePx - VISUAL.gap, deltaY];

                connector.setPosition(midX, midY);
                connector.setSize(width, height);
                connector.setVisible(true);
                connectorIndex++;
            }
        }

        for (let i = connectorIndex; i < connectors.length; i++) {
            connectors[i].setVisible(false);
        }
    }

    private lastTime: number = 0;

    update(time: number) {
        if (this.isInRestartFrameGap) {
            return;
        }

        if (!this.lastTime) {
            this.lastTime = time;
        }

        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.gameState.update(deltaTime);

        // Update human snake
        const humanHeadPos = this.gameState.get_human_snake_position();
        const humanBodyPositions =
            this.gameState.get_human_snake_body_positions();
        this.humanSnakeSegments[0].setPosition(
            humanHeadPos[0],
            humanHeadPos[1]
        );

        for (let i = 0; i < humanBodyPositions.length / 2; i++) {
            const x = humanBodyPositions[i * 2];
            const y = humanBodyPositions[i * 2 + 1];

            if (!this.humanSnakeSegments[i + 1]) {
                this.humanSnakeSegments.push(
                    this.createRectangle(x, y, colors.snake.human)
                );
                this.spawnFood();
            } else {
                this.humanSnakeSegments[i + 1].setPosition(x, y);
            }
        }

        const humanAllPositions = [
            humanHeadPos[0],
            humanHeadPos[1],
            ...humanBodyPositions,
        ];
        this.updateConnectors(
            humanAllPositions,
            this.humanSnakeConnectors,
            colors.snake.human
        );

        // Update AI snake
        const aiHeadPos = this.gameState.get_ai_snake_position();
        const aiBodyPositions = this.gameState.get_ai_snake_body_positions();
        this.aiSnakeSegments[0].setPosition(aiHeadPos[0], aiHeadPos[1]);

        for (let i = 0; i < aiBodyPositions.length / 2; i++) {
            const x = aiBodyPositions[i * 2];
            const y = aiBodyPositions[i * 2 + 1];

            if (!this.aiSnakeSegments[i + 1]) {
                this.aiSnakeSegments.push(
                    this.createRectangle(x, y, colors.snake.ai)
                );
                this.spawnFood();
            } else {
                this.aiSnakeSegments[i + 1].setPosition(x, y);
            }
        }

        const aiAllPositions = [aiHeadPos[0], aiHeadPos[1], ...aiBodyPositions];
        this.updateConnectors(
            aiAllPositions,
            this.aiSnakeConnectors,
            colors.snake.ai
        );
    }

    setGameEndCallback(cb: () => void) {
        this.gameEndCallback = cb;
    }

    handleEndGameFromWasm() {
        this.scene.pause();
        this.gameEndCallback();
    }

    onReset() {
        // Just mark for reset but don't free yet
        this.isInRestartFrameGap = true;
        this.scene.restart();
    }
}

export default GameScene;
