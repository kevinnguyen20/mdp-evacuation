import { level1 } from "./level1";
//import { LevelMenu } from "./LevelMenu";
export class MainMenu extends Phaser.Scene{

    constructor() {
        super({
            key: "MainMenu"
        });

    }


    preload(): void{
        //this.load.image('title', './assets/sprites/2_curved.png');
        this.load.image('play_button','./assets/sprites/play.png');
        this.load.image('alien', './assets/sprites/alien.svg');
        this.load.image('level_button', './assets/sprites/level_button.png');
        //this.load.image('support_button', './assets/sprites/supportus.png');
        this.load.image('backgroundimage', './assets/sprites/Zabelin.png' );
        // ./home/programmer/playingarea/markov-decision-processes-2/src/evakuierung/assets/sprites/Zabelin.png
        
        // audio for the start screen could be add here 

        const loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x00ff00 // green
            }
        });
        // add lag to show the loading bar
        for (let i=0;i<500;i++){
            this.load.image('play_button','./assets/sprites/play.png');
            this.load.image('alien' + i, './assets/sprites/alien.svg');
        }

        this.anims.create({
            key: 'coin',
            frames: this.anims.generateFrameNames('coinflip', { prefix: 'coinflip', end: 15, zeroPad: 4 }),
            frameRate: 16,
            yoyo: true,
            repeat: -1,
            repeatDelay: 300
        });

        this.load.on("progress",(percent)=>{
            loadingBar.fillRect(0,this.game.renderer.height / 2, this.game.renderer.width *percent,50);
            
        });
    }


    create(): void{
        const text1 = this.add.text(130, 100,'EVAKUIERUNG', {font : " 74px Arial Black",}).setDepth(1);
        text1.setFill('#00f');
        text1.setColor('#00f')
        text1.setStroke('#fff', 16);
        text1.setShadow(2,2,'#00f',2,true,true);

        this.add .image(this.game.renderer.width/2, this.game.renderer.height/2,'backgroundimage');
        // this.add.image(this.game.renderer.width/2, this.game.renderer.height*0.20,'title').setDepth(1);
        // could add some alien images near the logo
        // could be done better with image editor
        //this.add.image(30, this.game.renderer.height*0.10,'alien').setDepth(0);
        const playButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2,'play_button');
        const levelButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2 + 100,'level_button');
        
        const hoversprite = this.add.sprite(this.game.renderer.width/2-(200) , this.game.renderer.height/2,'alien');
        hoversprite.setScale(2);


        // PLAY BUTTON
        playButton.setInteractive()
        playButton.on("pointerdown",()=>{
            this.scene.transition({
                target: "level1",
                duration: 10
            });
        });
        playButton.on('pointerover', function(){playButton.setScale(0.85, 0.85)});
        playButton.on('pointerout', function(){ playButton.setScale(1, 1)});

        // LEVEL MENU BUTTON
        levelButton.setInteractive();
        levelButton.on("pointerdown",()=>{
            this.scene.start('LevelMenu');
        });
        levelButton.on('pointerover', function(){levelButton.setScale(0.85, 0.85)});
        levelButton.on('pointerout', function(){ levelButton.setScale(1, 1)});

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