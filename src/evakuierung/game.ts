import "phaser";

import { MainMenu } from "./scenes/MainMenu";
import {LevelMenu} from "./scenes/LevelMenu";
import {level1} from "./scenes/level1";
import {level2} from "./scenes/level2";
import {level3} from "./scenes/level3";
import {HelpMenu} from "./scenes/HelpMenu";
import {Theme} from "./scenes/Theme"

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 800,
        height: 600,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MainMenu,Theme, LevelMenu, level1, level2, level3, HelpMenu],
    physics: {
        default: 'arcade',
        arcade: {
            // set to true to display object collision bounding boxes
            debug: false
        }
    },
    render: {
        pixelArt: true,
        transparent: true,
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
