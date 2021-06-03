
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
        const backbutton = this.add.image(700, this.game.renderer.height-100,'back_button').setDepth(1);
        
        // level1button 

        level1button.setInteractive();

        level1button.on("pointerover",()=>{
            console.log("over level1button");
            
        })

        level1button.on("pointerout",()=>{
            console.log("out level1button");
            
        })

        level1button.on("pointerdown",()=>{
            console.log("pressed level 1 button");
            this.scene.start('level1');
            
        })

        // level 2 button

        level2button.setInteractive();

        level2button.on("pointerover",()=>{
            console.log("over level2button");
            
        })

        level2button.on("pointerout",()=>{
            console.log("out level2button");
            
        })

        level2button.on("pointerdown",()=>{
            console.log("pressed level 2 button");
            this.scene.start('level2');
            
        })

        // level 3 button 

        level3button.setInteractive();

        level3button.on("pointerover",()=>{
            console.log("over level3button");
            
        })

        level3button.on("pointerout",()=>{
            console.log("out level3button");
            
        })

        level3button.on("pointerdown",()=>{
            console.log("pressed level3 button");
            this.scene.start('level3');
            
        })

        // back button
        
        backbutton.setInteractive();

        backbutton.on("pointerover",()=>{
            console.log("over backbutton");
            
        })

        backbutton.on("pointerout",()=>{
            console.log("out backbutton");
            
        })

        backbutton.on("pointerdown",()=>{
            console.log("pressed backbutton");
            this.scene.start('MainMenu');
            
        })

       
















    }













} 