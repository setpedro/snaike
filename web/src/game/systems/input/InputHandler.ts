import Phaser from "phaser";
import { Rectangle } from "../../../../public/pkg/snake_spark";

export class InputHandler {
    private keys: {
        w: Phaser.Input.Keyboard.Key;
        a: Phaser.Input.Keyboard.Key;
        s: Phaser.Input.Keyboard.Key;
        d: Phaser.Input.Keyboard.Key;
    };

    constructor(scene: Phaser.Scene) {
        this.keys = {
            w: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };
    }

    public handleInput(snake: Rectangle): void {
        const [xDir, yDir] = snake.direction;

        if (this.keys.w.isDown && yDir !== 1) snake.move_snake("w");
        if (this.keys.a.isDown && xDir !== 1) snake.move_snake("a");
        if (this.keys.s.isDown && yDir !== -1) snake.move_snake("s");
        if (this.keys.d.isDown && xDir !== -1) snake.move_snake("d");
    }
}
