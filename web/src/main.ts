import Phaser from "phaser";
import sizes from "./consts";

const config = {
  type: Phaser.AUTO,
  width: sizes.width,
  height: sizes.height,
  //   scene: {
  //     preload: preload,
  //     create: create,
  //     update: update,
  //   },
};

function log() {
  console.log(config.width);
}

log();
