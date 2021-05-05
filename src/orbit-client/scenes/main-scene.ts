
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
        this.load.image('player', './assets/sprites/boar.png');
     }

     init(): void {
        this.data.set('playerScore', 0);
        this.data.set('playerWinningScore', 10);
    }
    //THE SPRITES ARE FILLERS!
    create(): void {
        //TODO ES MUESSEN DIE WAHRSCHEINLICHKEITEN FUER SPLITS EINGEFUERHRT WERDEN
      //this.add.image(300,300,"tiles"); sanity check
      var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32});
      var tileset = map.addTilesetImage('scifi', 'tiles');
      var layer = map.createLayer('Tile Layer 1', tileset, 0, 0);
      var player = this.add.image (400,48,'player');
      var score = 0; //speichert die belohnungen
      var scoreText = this.add.text(16,16, 'score:0');

      this.input.keyboard.on ('keydown-A', function(event){
        var tile = layer.getTileAtWorldXY(player.x-32,player.y, true); 
        if (tile.index === 5){
            //blocked can't move
        }
        else {
            player.x -= 32;
            if (tile.index === 3) { //ACTiON FELD HIER NUR BELOHNUNGEN/STERNE, WIRD AUFGESAMMELT UND NORMALER TILE WIRD GEPLACED
                map.putTileAt(21, tile.x, tile.y);
                score+= 1;
                scoreText.setText('Score:' + score);
            }
            if (tile.index === 73){ // erreicht das rote Ziel, ist nur in links movement, da man auf der map nur von links ans ziel kommt 
                map.putTileAt(21, tile.x, tile.y);
                scoreText.setText('Du hast das Ziel erreicht mit Score:' +score);
            }

        }
      });

      this.input.keyboard.on ('keydown-D', function(event){
        var tile = layer.getTileAtWorldXY(player.x+32,player.y, true);
        if (tile.index === 5){
            //blocked can't move
        }
        else {
            player.x += 32;
            if (tile.index === 3) { 
                map.putTileAt(21, tile.x, tile.y);
                score+= 1;
                scoreText.setText('Score:' + score);
            }
        }
      });

      this.input.keyboard.on ('keydown-S', function(event){
        var tile = layer.getTileAtWorldXY(player.x,player.y+32, true);
        if (tile.index === 5){
            //blocked can't move
        }
        else {
            player.y += 32;
            if (tile.index === 3) {
                map.putTileAt(21, tile.x, tile.y);
                score+= 1;
                scoreText.setText('Score:' + score);
            }
        }
      });

      this.input.keyboard.on ('keydown-W', function(event){
        var tile = layer.getTileAtWorldXY(player.x,player.y-32, true);
        if (tile.index === 5){
            //blocked can't move
        }
        else {
            player.y -= 32;
            if (tile.index === 3) {
                map.putTileAt(21, tile.x, tile.y);
                score+= 1;
                scoreText.setText('Score:' + score);
            }
        }
      });
      
    }

    private setupWorld(): void {
    }

    private setupCollision(): void {
    }

    update(): void {
        
    }
}
