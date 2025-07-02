import Phaser from "phaser";
import { GameState } from "../../../../public/pkg/snake_spark";

export interface IInputHandler {
    destroy(): void;
}

export class KeyboardInputHandler implements IInputHandler {
    private lastKeys = new Set<string>();
    private keydownHandler: (e: KeyboardEvent) => void;
    private keyupHandler: (e: KeyboardEvent) => void;

    constructor(private scene: Phaser.Scene, gameState: GameState) {
        this.keydownHandler = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (
                [
                    "w",
                    "a",
                    "s",
                    "d",
                    "arrowup",
                    "arrowleft",
                    "arrowdown",
                    "arrowright",
                ].includes(key)
            ) {
                this.lastKeys.forEach((k) => {
                    if (k !== key) {
                        gameState.set_input_key(k, false);
                    }
                });
                this.lastKeys.clear();
                gameState.set_input_key(key, true);
                this.lastKeys.add(key);
            }
        };

        this.keyupHandler = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (
                [
                    "w",
                    "a",
                    "s",
                    "d",
                    "arrowup",
                    "arrowleft",
                    "arrowdown",
                    "arrowright",
                ].includes(key)
            ) {
                gameState.set_input_key(key, false);
                this.lastKeys.delete(key);
            }
        };

        scene.input.keyboard!.on("keydown", this.keydownHandler);
        scene.input.keyboard!.on("keyup", this.keyupHandler);
    }

    destroy(): void {
        this.scene.input.keyboard?.off("keydown", this.keydownHandler);
        this.scene.input.keyboard?.off("keyup", this.keyupHandler);

        this.lastKeys.clear();
    }
}

export class SwipeInputHandler implements IInputHandler {
    private startX: number = 0;
    private startY: number = 0;
    private minSwipeDistance: number = 15;
    private lastDirection: string | null = null;
    private activePointer: Phaser.Input.Pointer | null = null;

    constructor(private scene: Phaser.Scene, private gameState: GameState) {
        this.setupSwipeListeners();
    }

    private setupSwipeListeners(): void {
        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.startX = pointer.x;
            this.startY = pointer.y;
            this.activePointer = pointer;
        });

        this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (this.activePointer !== pointer || !pointer.isDown) return;
            this.handleContinuousSwipe(pointer.x, pointer.y);
        });

        this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (this.activePointer === pointer) {
                this.activePointer = null;
                this.lastDirection = null;
            }
        });
    }

    private handleContinuousSwipe(currentX: number, currentY: number): void {
        const deltaX = currentX - this.startX;
        const deltaY = currentY - this.startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (Math.max(absDeltaX, absDeltaY) < this.minSwipeDistance) return;

        let newDirection: string;
        if (absDeltaX > absDeltaY) {
            newDirection = deltaX > 0 ? "arrowright" : "arrowleft";
        } else {
            newDirection = deltaY > 0 ? "arrowdown" : "arrowup";
        }

        if (this.lastDirection !== newDirection) {
            this.setDirection(newDirection);
            this.lastDirection = newDirection;

            this.startX = currentX;
            this.startY = currentY;
        }
    }

    private setDirection(direction: string): void {
        const allKeys = [
            "w",
            "a",
            "s",
            "d",
            "arrowup",
            "arrowleft",
            "arrowdown",
            "arrowright",
        ];

        allKeys.forEach((key) => this.gameState.set_input_key(key, false));

        this.gameState.set_input_key(direction, true);

        // Simulate key release (matches keyboard behavior)
        setTimeout(() => {
            this.gameState.set_input_key(direction, false);
        }, 50);
    }

    destroy(): void {
        this.scene.input.off("pointerdown");
        this.scene.input.off("pointermove");
        this.scene.input.off("pointerup");
    }
}

export class InputHandlerFactory {
    static create(scene: Phaser.Scene, gameState: GameState): IInputHandler {
        if (this.isMobile()) {
            return new SwipeInputHandler(scene, gameState);
        } else {
            return new KeyboardInputHandler(scene, gameState);
        }
    }

    private static isMobile(): boolean {
        return (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) || "ontouchstart" in window
        );
    }
}
