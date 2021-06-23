// just a substitute menu till the main menu is done adn fast transittion of levels 


export class MainMenu extends Phaser.Scene{

    constructor() {
        super({
            key: "MainMenu"
        });

    }


    preload(): void{
        
        this.load.image('play_button','./assets/sprites/play.png');
        this.load.image('alien', './assets/sprites/alien.svg');
        //this.load.image('level_button', './assets/sprites/level_button.png');
        this.load.image('level1_button','./assets/sprites/level1_button.png');
        this.load.image('level2_button','./assets/sprites/level2_button.png');
        this.load.image('level3_button','./assets/sprites/level3_button.png');
        this.load.image('back_button','./assets/sprites/back_button.png');
        this.load.image('difficulty', './assets/sprites/difficulty_button.png' );
        this.load.image('easy', './assets/sprites/easy_button.png' );
        this.load.image('medium', './assets/sprites/medium_button.png' );
        this.load.image('hard', './assets/sprites/hard_button.png' );
        
      
    }


    create(): void{
        let diff= 10;
        const text1 = this.add.text(130, 100,'EVAKUIERUNG', {font : " 74px Arial Black",}).setDepth(1);
        text1.setFill('#00f');
        text1.setColor('#00f')
        text1.setStroke('#fff', 16);
        text1.setShadow(2,2,'#00f',2,true,true);

        const level1button = this.add.image(200, this.game.renderer.height/2+100,'level1_button').setDepth(1);
        const level2button = this.add.image(400, this.game.renderer.height/2+100,'level2_button').setDepth(1);
        const level3button = this.add.image(600, this.game.renderer.height/2+100,'level3_button').setDepth(1);
        //const backButton = this.add.image(700, this.game.renderer.height-100,'back_button').setDepth(1);
        

       
        
        const playButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2,'play_button');
      
        
        const hoversprite = this.add.sprite(this.game.renderer.width/2-(200) , this.game.renderer.height/2,'alien');
        hoversprite.setScale(2);


        // PLAY BUTTON
        playButton.setInteractive()
        playButton.on("pointerdown",()=>{
          /*  this.scene.transition({
                target: "level1",
                duration: 10
            });*/
            this.scene.start('level1', {diff: diff});

        });
        playButton.on('pointerover', function(){playButton.setScale(0.85, 0.85)});
        playButton.on('pointerout', function(){ playButton.setScale(1, 1)});

        // level 1 button
        level1button.setInteractive();

        level1button.on("pointerdown",()=>{
            
            //this.scene.transition({
           //     target: "level1",
          //      duration: 10
          //  });
          this.scene.start('level1', {diff: diff});
        });

        level1button.on('pointerover', function(pointer){
            level1button.setScale(0.85, 0.85);
        });
        level1button.on('pointerout', function(pointer){
            level1button.setScale(1, 1);
        });

        // level 2 button

        level2button.setInteractive();

        

        level2button.on("pointerdown",()=>{
            
          /*  this.scene.transition({
                target: "level2",
                duration: 10
            });
            */
            this.scene.start('level2', {diff: diff});

        });

        level2button.on('pointerover', function(pointer){
            level2button.setScale(0.85, 0.85);
        });
        level2button.on('pointerout', function(pointer){
            level2button.setScale(1, 1);
        });

        // level 3 button 

        level3button.setInteractive();

        

        level3button.on("pointerdown",()=>{
            
           /* this.scene.transition({
                target: "level3",
                duration: 10,

            });*/
            this.scene.start('level3', {diff: diff});

        });

        level3button.on('pointerover', function(pointer){
            level3button.setScale(0.85, 0.85);
        });
        level3button.on('pointerout', function(pointer){
            level3button.setScale(1, 1);
        });

        const difficulty = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2+250,'difficulty').setDepth(1);
        const easy = this.add.image(this.game.renderer.width/2-200, this.game.renderer.height/2+250,'easy').setDepth(1);
        const medium = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2+250,'medium').setDepth(1);
        const hard = this.add.image(this.game.renderer.width/2+200, this.game.renderer.height/2+250,'hard').setDepth(1);
        easy.setVisible(false);
        medium.setVisible(false);
        hard.setVisible(false);
        const difficultytxt = this.add.text(this.game.renderer.width/2- 110, this.game.renderer.height/2+200, 'Current difficulty: easy')



        difficulty.setInteractive();
        easy.setInteractive();
        medium.setInteractive();
        hard.setInteractive();

        difficulty.on('pointerover', function(pointer){
            difficulty.setScale(0.85, 0.85);
        });
        difficulty.on('pointerout', function(pointer){
            difficulty.setScale(1, 1);
        });

        easy.on('pointerover', function(pointer){
            easy.setScale(0.85, 0.85);
        });
        easy.on('pointerout', function(pointer){
            easy.setScale(1, 1);
        });

        medium.on('pointerover', function(pointer){
            medium.setScale(0.85, 0.85);
        });
        medium.on('pointerout', function(pointer){
            medium.setScale(1, 1);
        });

        hard.on('pointerover', function(pointer){
            hard.setScale(0.85, 0.85);
        });
        hard.on('pointerout', function(pointer){
            hard.setScale(1, 1);
        });
        difficulty.on('pointerup', () => {
            difficulty.setVisible(false);
            easy.setVisible(true);
            medium.setVisible(true);
            hard.setVisible(true);
        })

        easy.on('pointerup', () => {
            diff = 10;
            difficulty.setVisible(true);
            easy.setVisible(false);
            medium.setVisible(false);
            hard.setVisible(false);
            difficultytxt.setText('Current difficulty: easy')
        })

        
        medium.on('pointerup', () => {
            diff = 20;
            difficulty.setVisible(true);
            easy.setVisible(false);
            medium.setVisible(false);
            hard.setVisible(false);
            difficultytxt.setText('Current difficulty: medium')
        })

        
        hard.on('pointerup', () => {
            diff = 30;
            difficulty.setVisible(true);
            easy.setVisible(false);
            medium.setVisible(false);
            hard.setVisible(false);
            difficultytxt.setText('Current difficulty: hard')
        })
        

        
    }
}