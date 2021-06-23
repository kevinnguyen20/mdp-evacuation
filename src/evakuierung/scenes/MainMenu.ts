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
        
      
    }


    create(): void{
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
            this.scene.transition({
                target: "level1",
                duration: 10
            });
        });
        playButton.on('pointerover', function(){playButton.setScale(0.85, 0.85)});
        playButton.on('pointerout', function(){ playButton.setScale(1, 1)});

        // level 1 button
        level1button.setInteractive();


        level1button.on("pointerdown",()=>{
            
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

        

        level2button.on("pointerdown",()=>{
            
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

        

        level3button.on("pointerdown",()=>{
            
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


        
    }
}