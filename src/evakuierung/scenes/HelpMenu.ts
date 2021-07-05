import { Figures, LevelFunctionsUpgraded, MapPosition, OurGame, OurMap, Tiles } from "../util/LevelFunctionsUpgraded";

export class HelpMenu extends Phaser.Scene{

    constructor() {
        super({
            key: "HelpMenu"
        });
    }

    preload(): void{
        this.load.image('bg2', ['assets/sprites/theme/rock-ore.jpg', 'assets/sprites/theme/rock-ore-n.jpg']);
        this.load.image('returnMainMenuButton2', './assets/sprites/theme/returnMainMenu.png');
    }

    create(): void{
        // background canvas
        this.add.sprite(400, 300, 'bg2').setAlpha(0.8);

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
        const returnMainMenuButton = this.add.image(this.game.renderer.width/2+250,this.game.renderer.height/2+250,'returnMainMenuButton2')
        returnMainMenuButton.setInteractive();

        returnMainMenuButton.on("pointerdown",()=>{
            
            this.scene.start('MainMenu');
        });

        returnMainMenuButton.on('pointerover', function(pointer){
            returnMainMenuButton.setScale(0.85, 0.85);
        });
        returnMainMenuButton.on('pointerout', function(pointer){
            returnMainMenuButton.setScale(1, 1);
        });

        // enabling the lights for the cursor/ pointer
        this.lights.enable();
        this.lights.setAmbientColor(0x808080);
        // spotlight per click
        const spotlight = this.lights.addLight(400, 300, 280).setIntensity(3);

        this.input.on('pointermove', function (pointer) {

            spotlight.x = pointer.x;
            spotlight.y = pointer.y;
    
        });
        const colors = [
            0xffffff, 0xff0000, 0x00ff00, 0x00ffff, 0xff00ff, 0xffff00
        ];
        let currentColor = 0;

        this.input.on('pointerdown', function (pointer) {

            currentColor++;
    
            if (currentColor === colors.length)
            {
                currentColor = 0;
            }
    
            spotlight.setColor(colors[currentColor]);
    
        });
    }
}