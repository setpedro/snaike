import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import { sizes } from "./consts";
import init from "../public/pkg/snake_spark";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: sizes.width,
  height: sizes.height,
  scene: [GameScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
};

new Phaser.Game(config);