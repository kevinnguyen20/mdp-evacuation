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

    public static init(restartButton: Phaser.GameObjects.Image, mapPosition: MapPosition, scene: Phaser.Scene, ourGame: OurGame): void {
        restartButton.setInteractive();
        restartButton.on('pointerup', () => {
            scene.input.keyboard.enabled = true;
            ourGame.gameFinished = false;
            ourGame.score = 0;
            scene.scene.restart();
        });

        restartButton.on('pointerover', function(){
            restartButton.setScale(0.85, 0.85)
        });
        restartButton.on('pointerout', function(){
            restartButton.setScale(1, 1)
        });
    }
}
