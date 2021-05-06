
export class MainScene extends Phaser.Scene {

    private timeAccumulator = 0.0;
    private playercount = 100;
    private playerInstances = [];
    private score = 0;
    private scoreText;
    private playercounttext;
    private spielerstartpunkt = [];

    constructor() {
        super({
            key: "MainScene"
        });
    }

    gameRestart() {
        this.scene.restart();
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
      //this.add.image(300,300,"tiles"); sanity check
      var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32});
      var tileset = map.addTilesetImage('scifi', 'tiles');
      var layer = map.createLayer('Tile Layer 1', tileset, 0, 0);
      var player = this.add.image (400,48,'player');
      this.playercount = 100;
      this.playercounttext = this.add.text (400, 48, '100' ,{color: '#FF0000' })
      this.playerInstances.push(player);
      this.playerInstances.push(this.playercounttext);
      this.scoreText = this.add.text(16,16, 'Score:0');
      this.spielerstartpunkt = [5,12];
      var WAHRSCHEINLICHKEITEN = [[[null, null, null , null], [[1, 99, 99], [100, 100, 1], null, null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],     [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],     [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],     [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]], [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [[1,50, 50], [1,50, 50], null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],     [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],     [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]]];
      var x = this.add.text (30,30, ""+this.spielerstartpunkt[0]+this.spielerstartpunkt[1]);


      this.input.keyboard.on ('keydown-A', () =>{
            this.movePlayers(false, -32, layer, map)
            this.spielerstartpunkt [1] = this.spielerstartpunkt [1] - 1;
            x.setText(""+this.spielerstartpunkt);
          //  var ll = this.add.text (100,100, ''+WAHRSCHEINLICHKEITEN[this.spielerstartpunkt[0]][this.spielerstartpunkt[1]]);
            this.splitCalc(WAHRSCHEINLICHKEITEN[this.spielerstartpunkt[0][this.spielerstartpunkt[1]]], player);
          });

      this.input.keyboard.on ('keydown-D', () =>{
            //player.x += 32;
            this.spielerstartpunkt [1] = this.spielerstartpunkt [1] + 1;
            //playercounttext.x += 32;
            this.movePlayers(false, +32, layer, map);
            x.setText(""+this.spielerstartpunkt);
            this.splitCalc(WAHRSCHEINLICHKEITEN[this.spielerstartpunkt[0][this.spielerstartpunkt[1]]], player);

      });

      this.input.keyboard.on ('keydown-S', () =>{
           this.movePlayers(true, +32, layer, map)
           this.spielerstartpunkt [0] = this.spielerstartpunkt [0] - 1;
           x.setText(""+this.spielerstartpunkt);
           this.splitCalc(WAHRSCHEINLICHKEITEN[this.spielerstartpunkt[0][this.spielerstartpunkt[1]]], player);

      });

      this.input.keyboard.on ('keydown-W', () =>{
            this.movePlayers(true, -32, layer, map)
            this.spielerstartpunkt [0] = this.spielerstartpunkt [0] + 1;
            x.setText(""+this.spielerstartpunkt);
            this.splitCalc(WAHRSCHEINLICHKEITEN[this.spielerstartpunkt[0][this.spielerstartpunkt[1]]], player);
      });
      
    }
    //Calculates whether the PlayerGroup splits after a PlayerMove and in which directions N,E,S,W, Figur ist die Figur die fuer ein split gecheckt wird, BUG!!!!
    private splitCalc(arr:any, figur:any): void {
        var nmbr = Phaser.Math.Between(1,100);
        //var txt = this.add.text(100,100, '' +arr);
        for (var i = 0; i<=3; i++){
            if (arr[i] != null)
              if (nmbr >= arr[i][0] && nmbr <= arr[i][1]){ // WIR KOMMEN NIE IN DIE SCHLEIFE IMMER ARR IST IMMER UNKNOWN
                  this.doSplit(i, figur, arr[i][2]);
              }
        }
    }

    //Bewegt alle Figuren des Spielers, x wenn false y wenn true, pos ist entweder +32 oder -32
    private movePlayers(xory: boolean, pos: number, layer: any, map:any): void {
        this.playerInstances.forEach( (element)=> {
            if (xory === false){
                var tile = layer.getTileAtWorldXY(element.x+pos, element.y, true); 
                if (tile.index === 5){
                    //blocked can't move
                }
                else {
                  //  player.x -= 32;
                  //  playercounttext.x -= 32;
                  element.x += pos;
                    if (tile.index === 3) { //ACTiON FELD HIER NUR BELOHNUNGEN/STERNE, WIRD AUFGESAMMELT UND NORMALER TILE WIRD GEPLACED
                        map.putTileAt(21, tile.x, tile.y);
                        this.score+= 1;
                        this.scoreText.setText('Score:' + this.score);
                    }
                    if (tile.index === 73){ // erreicht das rote Ziel, ist nur in links movement, da man auf der map nur von links ans ziel kommt 
                        map.putTileAt(21, tile.x, tile.y);
                        this.scoreText.setText('Du hast das Ziel erreicht mit Score:' +this.score);
                    }
        
                }
            }
            else {
                var tile = layer.getTileAtWorldXY(element.x, element.y+pos, true); 
                if (tile.index === 5){
                    //blocked can't move
                }
                else {                  //  player.x -= 32;
                  //  playercounttext.x -= 32;
                  element.y += pos;
                  if (tile.index === 3) { //ACTiON FELD HIER NUR BELOHNUNGEN/STERNE, WIRD AUFGESAMMELT UND NORMALER TILE WIRD GEPLACED
                        map.putTileAt(21, tile.x, tile.y);
                        this.score+= 1;
                        this.scoreText.setText('Score:' + this.score);
                    }
                    if (tile.index === 73){ // erreicht das rote Ziel, ist nur in links movement, da man auf der map nur von links ans ziel kommt 
                        map.putTileAt(21, tile.x, tile.y);
                        this.scoreText.setText('Du hast das Ziel erreicht mit Score:' +this.score);
                    }
        
                }
            }

            });
    }
    private doSplit(dir: number, figur:any, percentage: number): void {
        if (dir === 0){
            this.setFigureAt(figur.x, figur.y-32, percentage);
        }
        if (dir === 1){
            this.setFigureAt(figur.x+32, figur.y, percentage);
        }
        if (dir === 2){
            this.setFigureAt(figur.x, figur.y+32, percentage);
        }
        else {
            this.setFigureAt(figur.x-32, figur.y, percentage);
        }
    }

    private setFigureAt(x: number, y: number, percentage: number): void {
        var player = this.add.image (x,y,'player');
        var tmp = this.playercount - percentage;
        var neueGruppe = this.add.text(x,y, ''+percentage ,{color: '#FF0000' })
        this.playercount
        this.playerInstances.push(neueGruppe);
        this.playerInstances.push (player);
    }


    private setupWorld(): void {
    }

    private setupCollision(): void {
    }

    update(): void {
        
    }
}

