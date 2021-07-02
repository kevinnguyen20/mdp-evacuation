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

    }
    create(): void{

        
        this.add.sprite(400, 300, 'bg').setPipeline('Light2D').setAlpha(0.8);
        this.add.text(250,400,"CLICK ON THE SCREEN").setAlign("center").setScale(2);
        this.add.bitmapText(30, 150, 'ice', 'EVAKUIERUNG', 110).setCenterAlign().setPipeline('Light2D');

        this.lights.enable();
        this.lights.setAmbientColor(0x808080);

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
