import init, { SoloGameState } from "@/pkg/snaike";
import { BaseGameScene } from "./BaseGameScene";

export default class GameSceneSolo extends BaseGameScene {
    private gameState!: SoloGameState;

    constructor() {
        super({ key: "GameSceneSolo" });
    }

    protected async initializeGameState(): Promise<void> {
        await init();
        this.gameState = new SoloGameState();
    }

    protected getGameState(): SoloGameState {
        return this.gameState;
    }

    protected getHumanSnakePosition(): [number, number] {
        return this.gameState.get_human_snake_position() as unknown as [
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

    protected createAdditionalEntities(): void {}
    protected spawnAdditionalEntities(): void {}
    protected updateAdditionalEntities(): void {}
    protected cleanupAdditionalEntities(): void {}
}
