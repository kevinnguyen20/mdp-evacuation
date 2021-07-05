export class Theme extends Phaser.Scene{
    public i ;
    public hsv;
    public text1;
    constructor() {
        super({
            key: "Theme"
        });
        this.i = 0;

    }
    preload(): void{
        
        this.load.image('bg', ['assets/sprites/theme/rock-ore.jpg', 'assets/sprites/theme/rock-ore-n.jpg']);
        this.load.image('particle', 'assets/sprites/yellow.png');
        this.load.image('returnMainMenuButton', './assets/sprites/returnMainMenu.png');
        this.load.bitmapFont('ice', ['assets/sprites/theme/iceicebaby.png', 'assets/sprites/theme/iceicebaby_n.png'], 'assets/sprites/theme/iceicebaby.xml');

        // for the buttons

        this.load.image('play_button','./assets/sprites/theme/play_button.png');
        this.load.image('levels_button', './assets/sprites/theme/levels_button.png')
        this.load.image('level1_button','./assets/sprites/theme/level1_button.png');
        this.load.image('level2_button','./assets/sprites/theme/level2_button.png');
        this.load.image('level3_button','./assets/sprites/theme/level3_button.png');
        this.load.image('difficulty', './assets/sprites/theme/difficulty_button.png');
        this.load.image('easy', './assets/sprites/theme/easy_button.png');
        this.load.image('medium', './assets/sprites/theme/medium_button.png');
        this.load.image('hard', './assets/sprites/theme/hard_button.png');


    }
    create(): void{

        // the main heading with new font style
        this.add.sprite(400, 300, 'bg').setPipeline('Light2D').setAlpha(0.8);

        this.add.bitmapText(30, 150, 'ice', 'EVAKUIERUNG', 110).setCenterAlign().setPipeline('Light2D');
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


        let diff = 10;

        const playButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2,'play_button');
        const levelButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2+100,'levels_button').setDepth(1);
        

        // PLAY BUTTON
        playButton.setInteractive()
        playButton.on("pointerdown",()=>{
            this.scene.start('level1', {diff: diff});
        });
        playButton.on('pointerover', function(){playButton.setScale(0.85, 0.85)});
        playButton.on('pointerout', function(){playButton.setScale(1, 1)});
         
        // LEVEL MENU BUTTON
        levelButton.setInteractive();
        levelButton.on("pointerdown",()=>{
            this.scene.start('LevelMenu', {diff: diff});
        });
        levelButton.on('pointerover', function(){levelButton.setScale(0.85, 0.85)});
        levelButton.on('pointerout', function(){ levelButton.setScale(1, 1)});

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
 
       
 


        // back to main menu 

        const backButton = this.add.image(100, 50,'returnMainMenuButton');
        backButton.setInteractive();
        backButton.on("pointerdown",()=>{
            this.scene.start('MainMenu');
        });
        backButton.on('pointerover', function(){backButton.setScale(0.85, 0.85);});
        backButton.on('pointerout', function(){backButton.setScale(1, 1);});
        

    }


}
