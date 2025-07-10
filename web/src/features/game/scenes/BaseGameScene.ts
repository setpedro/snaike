import Phaser from "phaser";
import { InputHandlerFactory, IInputHandler } from "../input/InputHandler";
import { createGrid } from "../rendering/createGrid";
import { Snake } from "../entities/Snake";
import { Food } from "../entities/Food";
import { COLORS } from "../../../shared/consts";

export abstract class BaseGameScene extends Phaser.Scene {
    protected inputHandler!: IInputHandler;
    protected humanSnake!: Snake;
    protected food!: Food;
    protected gameEndCallback!: () => void;
    protected isInRestartFrameGap = false;
    private lastTime: number = 0;

    async create() {
        this.cleanup();

        await this.initializeGameState();
        this.isInRestartFrameGap = false;

        createGrid(this);
        this.createEntities();
        this.spawnEntities();

        this.inputHandler = InputHandlerFactory.create(
            this,
            this.getGameState()
        );
    }

    private createEntities() {
        this.humanSnake = new Snake(this, COLORS.snake.human, () =>
            this.food.spawn(...this.getFoodPosition())
        );
        this.food = new Food(this);
        this.createAdditionalEntities();
    }

    private spawnEntities() {
        const [x, y] = this.getHumanSnakePosition();
        this.humanSnake.spawn(x, y);
        this.food.spawn(...this.getFoodPosition());
        this.spawnAdditionalEntities();
    }

    update(time: number) {
        if (this.isInRestartFrameGap) {
            return;
        }

        if (!this.lastTime) {
            this.lastTime = time;
        }

        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.getGameState().update(deltaTime);
        this.updateEntities();
    }

    private updateEntities() {
        this.humanSnake.update(
            this.getGameState().get_human_snake_position(),
            this.getGameState().get_human_snake_body_positions()
        );
        this.updateAdditionalEntities();
    }

    private cleanup() {
        this.inputHandler?.destroy();
        this.getGameState()?.free();
        this.humanSnake?.destroy();
        this.food?.destroy();
        this.cleanupAdditionalEntities();
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

    protected abstract initializeGameState(): Promise<void>;
    protected abstract getGameState(): any;
    protected abstract getHumanSnakePosition(): [number, number];
    protected abstract getFoodPosition(): [number, number];
    protected abstract createAdditionalEntities(): void;
    protected abstract spawnAdditionalEntities(): void;
    protected abstract updateAdditionalEntities(): void;
    protected abstract cleanupAdditionalEntities(): void;
}
