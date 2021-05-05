
export class MainScene extends Phaser.Scene {

    private timeAccumulator = 0.0;

    private speedMultiplier: number;

    constructor() {
        super({
            key: "MainScene"
        });
    }

    gameRestart() {
        this.scene.restart();
    }

    gameSpeedUp() {
        this.speedMultiplier = 2.0;
    }

    gameSlowDown() {
        this.speedMultiplier = 0.5;
    }

    gameNormalSpeed() {
        this.speedMultiplier = 1.0;
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        );
        this.load.image('tiles','./assets/sprites/scifitiles-sheet.png');
        this.load.tilemapTiledJSON('map','./assets/sprites/lvl.json');   
     }

     init(): void {
        this.data.set('playerScore', 0);
        this.data.set('playerWinningScore', 10);
    }

    create(): void {
      //this.add.image(300,300,"tiles"); sanity check
      var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32});
      var tileset = map.addTilesetImage('scifi', 'tiles');
      var layer = map.createLayer('Tile Layer 1', tileset, 0, 0);
    }

    private setupWorld(): void {
    }

    private setupCollision(): void {
    }

    update(): void {
    }
}
