import Phaser from "phaser";
import GameScene from "./game/scenes/GameScene";
import { grid } from "./consts";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: grid.cols * grid.cellSizePx,
    height: grid.rows * grid.cellSizePx,
    scene: [GameScene],
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
};

window.game = new Phaser.Game(config);
