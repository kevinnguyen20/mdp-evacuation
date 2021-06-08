import { TileParser } from "../util/tileParser";
import { TilePiece } from "../util/tilePiece";
import { Figure } from "../util/figure"
import { AnimatedTile } from "../util/animatedTile";

import { LevelFunctionsUpgraded } from "../util/LevelFunctionsUpgraded";

type MapPosition = {
    mapPosX: number;
    mapPosY: number;
};

type OurGame = {
    score: number;
    scoreText: Phaser.GameObjects.Text;
    queenPos: number[];
    gameFinished: boolean;
    preMovePos: number[];
    survivorScoreText: Phaser.GameObjects.Text;
    winCond: number;
};

export class RestartButton {
    private restartButton: Phaser.GameObjects.Image;

    constructor(mapPosition: MapPosition, scene: Phaser.Scene, ourGame: OurGame) {
        this.restartButton = scene.add.image(mapPosition.mapPosX+610, mapPosition.mapPosY-27, 'restartButton');
        this.restartButton.setInteractive();
        this.restartButton.on('pointerup', () => {
            scene.input.keyboard.enabled = true;
            ourGame.gameFinished = false;
            ourGame.score = 0;
            scene.scene.restart();
        });

        this.restartButton.on('pointerover', function() {
            this.restartButton.setScale(0.85, 0.85)
        });
        this.restartButton.on('pointerout', function() {
            this.restartButton.setScale(1, 1)
        });
    }
}
