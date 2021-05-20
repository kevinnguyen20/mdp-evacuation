/** Scene for user interface elements. */
export class GuiScene extends Phaser.Scene {

    constructor() {
        super({
            key: "GuiScene",
            active: true
        });
    }

    create(): void {

        // const text = this.add.text(10, 10,
        //     `Maneuver the satellites, collect stars to earn ${this.scene.get('MainScene').data.get('playerWinningScore')} points!`,
        //     {color: '#0f0'});

        // this.scene.get('MainScene').data.events.on('changedata-playerScore', (scene, value) => {
        //     const winningScore = scene.data.get('playerWinningScore');
        //     if (value >= winningScore) {
        //         text.setText("You've won! Yeah!");
        //     } else if (value == 0) {
        //         text.setText(`Maneuver the satellites, collect stars to earn ${winningScore} points!`);
        //     } else {
        //         text.setText("Collect " + Math.round(winningScore - value) + " more stars!");
        //     }
        // });
    }

}
