import { MapPosition, OurGame } from "../util/LevelFunctionsUpgraded";

export class RestartButton {
    public static init(restartButton: Phaser.GameObjects.Image, mapPosition: MapPosition, scene: Phaser.Scene, ourGame: OurGame): void {
        restartButton.setInteractive();
        restartButton.on('pointerup', () => {
            scene.game.sound.stopAll();
            if (scene.input.keyboard) {
                scene.input.keyboard.enabled = true;
            }
            ourGame.gameFinished = false;
            ourGame.score = 0;
            if(scene.scene.key === 'level1'){
                ourGame.movesLeft = 40; // this should be changed if it's changed in level1
            }
            else if(scene.scene.key === 'level2'){
                ourGame.movesLeft = 41 // this should be changed if it's changed in level2
            }
            else{
                ourGame.movesLeft = 73; // this should be changed if it's changed in level3
            }
            scene.scene.restart();
        });

        restartButton.on('pointerover', function(){restartButton.setScale(0.85, 0.85)});
        restartButton.on('pointerout', function(){restartButton.setScale(1, 1)});
    }
}
