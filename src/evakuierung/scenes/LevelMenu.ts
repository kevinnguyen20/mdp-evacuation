
import { MainMenu } from "./MainMenu";

export class LevelMenu extends Phaser.Scene{


    constructor() {
        super({
            key: "LevelMenu"
        });
         
    }

    preload(): void{

        this.load.image('bg', ['assets/sprites/theme/rock-ore.jpg', 'assets/sprites/theme/rock-ore-n.jpg']);
        this.load.image('level1_button','./assets/sprites/level1_button.png');
        this.load.image('level2_button','./assets/sprites/level2_button.png');
        this.load.image('level3_button','./assets/sprites/level3_button.png');
        this.load.image('back_button','./assets/sprites/back_button.png');
        this.load.image('difficulty', './assets/sprites/theme/difficulty_button.png');
        this.load.image('easy', './assets/sprites/theme/easy_button.png');
        this.load.image('medium', './assets/sprites/theme/medium_button.png');
        this.load.image('hard', './assets/sprites/theme/hard_button.png');
        
    }

    


    create(): void{

        let diff = 10;


        this.add.sprite(400, 300, 'bg').setPipeline('Light2D').setAlpha(0.8);

        const level1button = this.add.image(200, this.game.renderer.height/2,'level1_button').setDepth(1);
        const level2button = this.add.image(400, this.game.renderer.height/2,'level2_button').setDepth(1);
        const level3button = this.add.image(600, this.game.renderer.height/2,'level3_button').setDepth(1);
        const backButton = this.add.image(700, this.game.renderer.height-100,'back_button').setDepth(1);
        
        // LEVEL 1 BUTTON
        level1button.setInteractive();
        level1button.on("pointerdown",()=>{
            this.scene.start('level1', {diff: diff});
            
        });
        level1button.on('pointerover', function(){level1button.setScale(0.85, 0.85);});
        level1button.on('pointerout', function(){level1button.setScale(1, 1);});

        // LEVEL 2 BUTTON
        level2button.setInteractive();
        level2button.on("pointerdown",()=>{
            this.scene.start('level2', {diff: diff});
            
        });
        level2button.on('pointerover', function(){level2button.setScale(0.85, 0.85);});
        level2button.on('pointerout', function(){level2button.setScale(1, 1);});

        // LEVEL 3 BUTTON
        level3button.setInteractive();
        level3button.on("pointerdown",()=>{
            this.scene.start('level3', {diff: diff});
            
        });
        level3button.on('pointerover', function(){level3button.setScale(0.85, 0.85);});
        level3button.on('pointerout', function(){level3button.setScale(1, 1);});


        const difficulty = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2+250,'difficulty').setDepth(1);
        const easy = this.add.image(this.game.renderer.width/2-200, this.game.renderer.height/2+250,'easy').setDepth(1);
        const medium = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2+250,'medium').setDepth(1);
        const hard = this.add.image(this.game.renderer.width/2+200, this.game.renderer.height/2+250,'hard').setDepth(1);
        easy.setVisible(false);
        medium.setVisible(false);
        hard.setVisible(false);
        const difficultytxt = this.add.text(this.game.renderer.width/2- 110, this.game.renderer.height/2+200, 'Current difficulty: easy');


        difficulty.setInteractive();
        easy.setInteractive();
        medium.setInteractive();
        hard.setInteractive();

        difficulty.on('pointerover', function(){difficulty.setScale(0.85, 0.85);});
        difficulty.on('pointerout', function(){difficulty.setScale(1, 1);});

        easy.on('pointerover', function(){easy.setScale(0.85, 0.85);});
        easy.on('pointerout', function(){easy.setScale(1, 1);});

        medium.on('pointerover', function(){medium.setScale(0.85, 0.85);});
        medium.on('pointerout', function(){medium.setScale(1, 1);});

        hard.on('pointerover', function(){hard.setScale(0.85, 0.85);});
        hard.on('pointerout', function(){hard.setScale(1, 1);});

        difficulty.on('pointerup', () => {
            difficulty.setVisible(false);
            easy.setVisible(true);
            medium.setVisible(true);
            hard.setVisible(true);
        });

        easy.on('pointerup', () => {
            diff = 10;
            difficulty.setVisible(true);
            easy.setVisible(false);
            medium.setVisible(false);
            hard.setVisible(false);
            difficultytxt.setText('Current difficulty: easy')
        });
        
        medium.on('pointerup', () => {
            diff = 20;
            difficulty.setVisible(true);
            easy.setVisible(false);
            medium.setVisible(false);
            hard.setVisible(false);
            difficultytxt.setText('Current difficulty: medium')
        });
        
        hard.on('pointerup', () => {
            diff = 30;
            difficulty.setVisible(true);
            easy.setVisible(false);
            medium.setVisible(false);
            hard.setVisible(false);
            difficultytxt.setText('Current difficulty: hard')
        });

        // back button
        
        backButton.setInteractive();

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