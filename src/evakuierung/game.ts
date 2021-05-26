import "phaser";
import { AUTO, Scale } from "phaser";

import {level1} from "./scenes/level1";

const config: Phaser.Types.Core.GameConfig = {
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-example',
        width: 800,
        height: 600
    },
    type: AUTO,
    scene: [level1],
    physics: {
        default: 'arcade',
        arcade: {
            // set to true to display object collision bounding boxes
            debug: false
        }
    },
    render: {
        pixelArt: true
    }
};

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

function resize (gameSize, baseSize, displaySize, resolution)
{
    var width = gameSize.width;
    var height = gameSize.height;

    this.cameras.resize(width, height);

    this.bg.setSize(width, height);
    this.logo.setPosition(width / 2, height / 2);
}

window.addEventListener("load", () => {
    new Game(config);
});