import init, { VersusGameState } from "../../../../public/pkg/snake_spark";
import { BaseGameScene } from "./BaseGameScene";
import { Snake } from "../entities/Snake";
import { COLORS } from "../../../shared/consts";

export default class GameSceneVersus extends BaseGameScene {
    private gameState!: VersusGameState;
    private aiSnake!: Snake;

    constructor() {
        super({ key: "GameSceneVersus" });
    }

    protected async initializeGameState(): Promise<void> {
        await init();
        this.gameState = new VersusGameState();
    }

    protected getGameState(): VersusGameState {
        return this.gameState;
    }

    protected getHumanSnakePosition(): [number, number] {
        return this.gameState.get_human_snake_position() as unknown as [
            number,
            number
        ];
    }

    private getAISnakePosition(): [number, number] {
        return this.gameState.get_ai_snake_position() as unknown as [
            number,
            number
        ];
    }

    protected getFoodPosition(): [number, number] {
        return this.gameState.food as unknown as [unknown, unknown] as [
            number,
            number
        ];
    }

    protected createAdditionalEntities(): void {
        this.aiSnake = new Snake(this, COLORS.snake.ai, () =>
            this.food.spawn(...this.getFoodPosition())
        );
    }

    protected spawnAdditionalEntities(): void {
        const [x, y] = this.getAISnakePosition();
        this.aiSnake.spawn(x, y);
    }

    protected updateAdditionalEntities(): void {
        this.aiSnake.update(
            this.gameState.get_ai_snake_position(),
            this.gameState.get_ai_snake_body_positions()
        );
    }

    protected cleanupAdditionalEntities(): void {
        this.aiSnake?.destroy();
    }
}
