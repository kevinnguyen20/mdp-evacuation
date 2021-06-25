import { Figures, LevelFunctionsUpgraded, MapPosition, OurGame, OurMap, Tiles } from "../util/LevelFunctionsUpgraded";

export class HelpMenu extends Phaser.Scene{

    constructor() {
        super({
            key: "HelpMenu"
        });
    }

    preload(): void{
        this.load.image('returnMainMenuButton', './assets/sprites/returnMainMenu.png');
    }

    create(): void{
        const x = this.game.renderer.width/2;
        const y = this.game.renderer.height/2;
        const info = this.add.text(x, y, "The goal of the game is to evacuate as much aliens as possible. Collect coins, avoid splitting your group and reach the end with as much moves left as possible! Use keys W,A,S,D to navigate.");
        info.setAlign('center');
        info.setOrigin(0.5,2.5);
        info.setWordWrapWidth(720,true);
        info.setFontSize(23);

        const y2 = this.game.renderer.height/2 + 50;
        const infoMDP = this.add.text(x, y2, "The game is based on the stochastical model Markov decision processes (MDP). At each time step the player is in a state. By changing the state there is a possibility of an event occuring that can influence the setting. In this game, these events are splits of the start group, collecting coins as a reward or having some of your aliens killed as a punishment.");
        infoMDP.setAlign('center');
        infoMDP.setOrigin(0.5, 0.6);
        infoMDP.setWordWrapWidth(720,true);
        infoMDP.setFontSize(23);

        LevelFunctionsUpgraded.addReturnButton(this);
    }
}