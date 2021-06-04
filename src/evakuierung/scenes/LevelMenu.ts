
import { MainMenu } from "./MainMenu";

export class LevelMenu extends Phaser.Scene{

    constructor() {
        super({
            key: "LevelMenu"
        });
    }

    preload(): void{
        this.load.image('level1_button','./assets/sprites/level1_button.png');
        this.load.image('level2_button','./assets/sprites/level2_button.png');
        this.load.image('level3_button','./assets/sprites/level3_button.png');
        this.load.image('back_button','./assets/sprites/back_button.png');
        this.load.image('backgroundimage', './assets/sprites/Zabelin.png');
        //this.load.image('level1_button','./assets/sprites/level1_button.png');
    }


    create(): void{
        this.add .image(this.game.renderer.width/2, this.game.renderer.height/2,'backgroundimage');
        const level1button = this.add.image(200, this.game.renderer.height/2,'level1_button').setDepth(1);
        const level2button = this.add.image(400, this.game.renderer.height/2,'level2_button').setDepth(1);
        const level3button = this.add.image(600, this.game.renderer.height/2,'level3_button').setDepth(1);
        const backButton = this.add.image(700, this.game.renderer.height-100,'back_button').setDepth(1);
        
        // level1button 

        level1button.setInteractive();

        level1button.on("pointerover",()=>{console.log("over level1button")});
        level1button.on("pointerout",()=>{console.log("out level1button")});

        level1button.on("pointerdown",()=>{
            console.log("pressed level 1 button");
            this.scene.transition({
                target: "level1",
                duration: 10
            });
        });

        level1button.on('pointerover', function(pointer){
            level1button.setScale(0.85, 0.85);
        });
        level1button.on('pointerout', function(pointer){
            level1button.setScale(1, 1);
        });

        // level 2 button

        level2button.setInteractive();

        level2button.on("pointerover",()=>{console.log("over level1button")});
        level2button.on("pointerout",()=>{console.log("out level1button")});

        level2button.on("pointerdown",()=>{
            console.log("pressed level 2 button");
            this.scene.transition({
                target: "level2",
                duration: 10
            });
        });

        level2button.on('pointerover', function(pointer){
            level2button.setScale(0.85, 0.85);
        });
        level2button.on('pointerout', function(pointer){
            level2button.setScale(1, 1);
        });

        // level 3 button 

        level3button.setInteractive();

        level3button.on("pointerover",()=>{console.log("over level1button")});
        level3button.on("pointerout",()=>{console.log("out level1button")});

        level3button.on("pointerdown",()=>{
            console.log("pressed level 3 button");
            this.scene.transition({
                target: "level3",
                duration: 10
            });
        });

        level3button.on('pointerover', function(pointer){
            level3button.setScale(0.85, 0.85);
        });
        level3button.on('pointerout', function(pointer){
            level3button.setScale(1, 1);
        });

        // back button
        
        backButton.setInteractive();

        backButton.on("pointerover",()=>{console.log("over backButton")});
        backButton.on("pointerout",()=>{console.log("out backButton")});

        backButton.on("pointerdown",()=>{
            console.log("pressed backButton");
            this.scene.start('MainMenu');
        });

        backButton.on('pointerover', function(pointer){
            backButton.setScale(0.85, 0.85);
        });
        backButton.on('pointerout', function(pointer){
            backButton.setScale(1, 1);
        });
    }
} 