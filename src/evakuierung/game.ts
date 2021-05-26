import "phaser";
import { AUTO } from "phaser";

import {level1} from "./scenes/level1";

const config: Phaser.Types.Core.GameConfig = {
    //backgroundColor: 0x1F1D2C,            // can be set if we decide to use some other background color, not important for now
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.RESIZE,   // funktioniert bei mir (chri) nicht
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

window.addEventListener("load", () => {
    new Game(config);
});