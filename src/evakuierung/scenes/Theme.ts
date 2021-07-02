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
        
        this.load.image("button","assets/sprites/play.png");
        
        this.load.image('particle', 'assets/sprites/yellow.png');
        this.load.image('returnMainMenuButton', './assets/sprites/returnMainMenu.png');
        this.load.bitmapFont('ice', ['assets/sprites/theme/iceicebaby.png', 'assets/sprites/theme/iceicebaby_n.png'], 'assets/sprites/theme/iceicebaby.xml');

    }
    create(): void{

        
        
        this.add.bitmapText(30, 150, 'ice', 'EVAKUIERUNG', 110).setCenterAlign().setPipeline('Light2D');

        this.lights.enable();
        this.lights.setAmbientColor(0x808080);

        const spotlight = this.lights.addLight(400, 300, 280).setIntensity(3);

        this.input.on('pointermove', function (pointer) {

            spotlight.x = pointer.x;
            spotlight.y = pointer.y;
    
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
