import "phaser";
import {MainScene} from "./scenes/main-scene";
import {GuiScene} from "./scenes/gui-scene";

const config: Phaser.Types.Core.GameConfig = {
    width: 600, // CHANGED
    height: 480,    // CHANGED
    scale: {
        mode: Phaser.Scale.FIT, // CHANGED
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MainScene, GuiScene],
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
