export class Theme extends Phaser.Scene{
    public i;
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
        this.load.image('alien', './assets/sprites/alien.svg');
        this.load.image('alienBlue1', 'assets/sprites/alien_blue_1.png');
        this.load.image('alienBlue2', 'assets/sprites/alien_blue_2.png');
        this.load.image('alienPurple', 'assets/sprites/alien_purple.png');

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
        this.load.image('help_button', './assets/sprites/theme/help_button.png');


        // audio and music

        this.load.audio('berghain', './assets/sprites/synthwavehouse.mp3');
        this.load.audio('gameOver', './assets/sprites/GameOver.wav');
        this.load.audio('victory', './assets/sprites/Victory.wav');
        this.load.image('soundOn', './assets/sprites/soundOnBlack.png');
        this.load.image('soundOff', './assets/sprites/soundOffBlack.png');

        // for the animation flares

        this.load.image('blueFlare', 'assets/sprites/theme/blue-flare.png');
        this.load.image('whiteFlare', 'assets/sprites/theme/white-flare.png');
    }

    create(): void{
        const hoversprite = this.add.sprite(this.game.renderer.width/2-(220) , this.game.renderer.height/2-200,'alien');
        hoversprite.setScale(2);
        hoversprite.setDepth(0.9);
        hoversprite.setRotation(90);

        const alien2 = this.add.sprite(this.game.renderer.width/2+(30) , this.game.renderer.height/2-260,'alienBlue2');
        alien2.setScale(2);
        alien2.setDepth(0.4);

        const alien3 = this.add.sprite(this.game.renderer.width/2+370 , this.game.renderer.height/2-260,'alienPurple');
        alien3.setScale(3);
        alien3.setDepth(0.1);
        alien3.setRotation(5)

        // the main heading with new font style
        this.add.sprite(400, 300, 'bg').setPipeline('Light2D').setAlpha(0.8);

        this.add.bitmapText(this.game.renderer.width/2- 360, this.game.renderer.height/2-250, 'ice', 'EVAKUIERUNG', 110).setCenterAlign().setPipeline('Light2D');
        // enabling the lights for the cursor/ pointer
        this.lights.enable();
        this.lights.setAmbientColor(0x808080);
        // spotlight per click
        const spotlight = this.lights.addLight(400, 300, 280).setIntensity(3);

        this.input.on('pointermove', function (pointer: {x: number; y: number}) {
            spotlight.x = pointer.x;
            spotlight.y = pointer.y;
        });
        const colors = [
            0xffffff, 0xff0000, 0x00ff00, 0x00ffff, 0xff00ff, 0xffff00
        ];
        let currentColor = 0;

        this.input.on('pointerdown', function () {
            currentColor++;
            if (currentColor === colors.length)
                currentColor = 0;
    
            spotlight.setColor(colors[currentColor]);
        });

        // flare feature
        // const particles = this.add.particles('whiteFlare');

        // const emitter = particles.createEmitter({
        //     lifespan: 1000,
        //     speed: { min: 100, max: 200 },
        //     angle: 240,
        //     gravityY: 300,
        //     rotate: { start: 0, end: 360 },
        //     scale: { start: 0.5, end: 0 },
        //     blendMode: 'difference'
        // });

        const emitter = this.add.particles(undefined, undefined, 'whiteFlare', {
            lifespan: 1000,
            speed: { min: 100, max: 200 },
            angle: 240,
            gravityY: 300,
            rotate: { start: 0, end: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'difference'
        });

        const flare1 = this.add.image(-400,  this.game.renderer.height/2-250, 'whiteFlare').setBlendMode('difference').setDepth(2);
        const flare2 = this.add.image(-400,  this.game.renderer.height/2-250, 'blueFlare').setBlendMode('difference').setDepth(2);
        
        emitter.startFollow(flare1);
        this.tweens.add({
            targets: [ flare1,flare2 ],
            x: 2000,
            duration: 6000,
            ease: 'Power1',
            repeat: -1
        });

        // difficulty feature
        let diff = 30;

        const playButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2 - 90,'play_button');
        const levelButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2-10,'levels_button').setDepth(1);
        

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
            backgroundMusic.stop();
        });
        levelButton.on('pointerover', function(){levelButton.setScale(0.85, 0.85)});
        levelButton.on('pointerout', function(){ levelButton.setScale(1, 1)});

        // background music
        const backgroundMusic = this.sound.add('berghain');
        const musicConfig = {
            mute: false,
            volume: 0.14,
            rate: 1,
            detune: 0,
            loop: true,
            delay: 0
        }
        backgroundMusic.play(musicConfig);

        // SOUND BUTTON
        const soundButton = this.add.image(this.game.renderer.width/2+250, this.game.renderer.height/2+250,'soundOn').setInteractive();
        soundButton.on('pointerover', function(){soundButton.setScale(0.85, 0.85);});
        soundButton.on('pointerout', function(){soundButton.setScale(1, 1);});
        soundButton.on("pointerdown",()=>{
            if (soundButton.texture.key == 'soundOn') {
                soundButton.setTexture('soundOff');
                this.game.sound.stopAll();
            } else if (soundButton.texture.key == 'soundOff') {
                soundButton.setTexture('soundOn');
                backgroundMusic.play(musicConfig);
            }
        });

        // help button
        const helpButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2+70,'help_button');
        helpButton.setInteractive();
        helpButton.on('pointerover', function(){helpButton.setScale(0.85, 0.85);});
        helpButton.on('pointerout', function(){helpButton.setScale(1, 1);});
        helpButton.on("pointerdown",()=>{
            this.scene.start('HelpMenu');
            backgroundMusic.stop();
        });


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
        const backButton = this.add.image(this.game.renderer.width/2-250, this.game.renderer.height/2+250,'returnMainMenuButton');
        backButton.setInteractive();
        backButton.on("pointerdown",()=>{
            this.scene.start('MainMenu');
        });
        backButton.on('pointerover', function(){backButton.setScale(0.85, 0.85);});
        backButton.on('pointerout', function(){backButton.setScale(1, 1);});
    }
}
