import { level1 } from "./level1";
//import { LevelMenu } from "./LevelMenu";
export class MainMenu extends Phaser.Scene{

    constructor() {
        super({
            key: "MainMenu"
        });

    }


    preload(): void{
        this.load.image('title', './assets/sprites/2_curved.png');
        this.load.image('play_button','./assets/sprites/play.png');
        this.load.image('alien', './assets/sprites/alien.svg');
        this.load.image('level_button', './assets/sprites/level_button.png');
        this.load.image('support_button', './assets/sprites/supportus.png');
        this.load.image('backgroundimage', './assets/sprites/Zabelin.png' );
        // ./home/programmer/playingarea/markov-decision-processes-2/src/evakuierung/assets/sprites/Zabelin.png
        
        // audio for the start screen could be add here 

        const loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff // white
            }



        })
        // add lag to show the loading bar

        this.load.on("progress",(percent)=>{
            loadingBar.fillRect(0,this.game.renderer.height / 2, this.game.renderer.width *percent,50);
            console.log(percent);
        })

    }


    create(): void{
        const text1 = this.add.text(130, 100,'EVAKULIERUNG', {font : " 74px Arial Black",}).setDepth(1);
        text1.setFill('#00f');
        text1.setColor('#00f')
        text1.setStroke('#fff', 16);
        text1.setShadow(2,2,'#00f',2,true,true);


        this.add .image(this.game.renderer.width/2, this.game.renderer.height/2,'backgroundimage');
        // this.add.image(this.game.renderer.width/2, this.game.renderer.height*0.20,'title').setDepth(1);
        // could add some alien images near the logo
        // could be done better with image editor
        //this.add.image(30, this.game.renderer.height*0.10,'alien').setDepth(0);
        const playerbutton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2,'play_button');
        const levelbutton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2 + 100,'level_button');
        
        const hoversprite = this.add.sprite(this.game.renderer.width/2-(200) , this.game.renderer.height/2,'alien');
        hoversprite.setScale(2);


        playerbutton.setInteractive();

        playerbutton.on("pointerover",()=>{
            console.log("over");
            
        })

        playerbutton.on("pointerout",()=>{
            console.log("out");
            
        })

        playerbutton.on("pointerdown",()=>{
            console.log("pressed");
            this.scene.start('level1')
            
        })

        // level button console output

        levelbutton.setInteractive();

        levelbutton.on("pointerover",()=>{
            console.log("over level button ");
            
        })

        levelbutton.on("pointerout",()=>{
            console.log("out from level button");
            
        })

        levelbutton.on("pointerdown",()=>{
            console.log("pressed level button");
            this.scene.start('LevelMenu')
            
        })

        // support button 
        /*
        const supportbutton = this.add.image(600, this.game.renderer.height-100,'support_button');
        supportbutton.setInteractive();

        supportbutton.on("pointerover",()=>{
            console.log("over support button ");
            
        })

        supportbutton.on("pointerout",()=>{
            console.log("out from support button");
            
        })

        supportbutton.on("pointerdown",()=>{
            console.log("pressed support button");
            this.scene.start('LevelMenu')
            
        })
        */




       






    }
  





























}