import "phaser";

import {level1} from "./scenes/level1";

const config: Phaser.Types.Core.GameConfig = {
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.ZOOM_4X,
        //autoCenter: Phaser.Scale.RESIZE   // funktioniert bei mir (chri) nicht
    },
    scene: [level1],
    physics: {
        default: 'arcade',
        arcade: {
            // set to true to display object collision bounding boxes
            debug: false
        }
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
