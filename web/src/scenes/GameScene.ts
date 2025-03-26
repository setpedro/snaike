import Phaser from "phaser";
import { createGrid } from "../utils/createGrid";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    createGrid(this);
  }
}

export default GameScene;
