export class MainScene extends Phaser.Scene {

    private timeAccumulator = 0.0;
    private playercount = 100;
    private playerInstances = [];
    private score = 0;
    private scoreText;
    private playercounttext;
    private spielerstartpunkt = [];
    private layer;
    private preMovePos =[];

    constructor() {
        super({
            key: "MainScene"
        });
    }

    // Rückgabewert hinzugefügt
    gameRestart(): void {
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
        const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32});
        const tileset = map.addTilesetImage('scifi', 'tiles');
        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0);

        // von kevinnguyen hinzugefügt, optimiert Typsicherheit
        const layer_new = layer as unknown as Phaser.Tilemaps.Tilemap;

        const player = this.add.image (400,48,'player');
        this.playercount = 100;
        this.playercounttext = this.add.text (400, 48, '100' ,{color: '#FF0000' })
        this.playerInstances.push(player);
        this.playerInstances.push(this.playercounttext);
        this.scoreText = this.add.text(16,16, 'Score:0');
        this.spielerstartpunkt = [5,12];
        this.preMovePos = [400,48];
        const WAHRSCHEINLICHKEITEN = [[[null, null, null , null], [[1, 99, 99], [100, 100, 1], null, null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],     [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],     [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],     [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]], [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [[1,50, 50], [51,100, 50], null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],     [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],     [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]]];
        const x = this.add.text (30,30, ""+this.spielerstartpunkt[0]+this.spielerstartpunkt[1]);


        this.input.keyboard.on ('keydown-A', () =>{
            this.movePlayers(false, -32, layer_new, map)
            this.spielerstartpunkt [1] = this.spielerstartpunkt [1] - 1;
            x.setText(""+this.spielerstartpunkt);
            // var ll = this.add.text (100,100, ''+WAHRSCHEINLICHKEITEN[this.spielerstartpunkt[0]][this.spielerstartpunkt[1]]);
            this.splitCalc(WAHRSCHEINLICHKEITEN[this.spielerstartpunkt[0]][this.spielerstartpunkt[1]+1], player);
            this.preMovePos[0] = this.preMovePos [0]-32;
        });

        this.input.keyboard.on ('keydown-D', () =>{
            //player.x += 32;
            this.spielerstartpunkt [1] = this.spielerstartpunkt [1] + 1;
            //playercounttext.x += 32;
            this.movePlayers(false, +32, layer_new, map);
            x.setText(""+this.spielerstartpunkt);
            this.splitCalc(WAHRSCHEINLICHKEITEN[this.spielerstartpunkt[0]][this.spielerstartpunkt[1]-1], player);
            this.preMovePos[0] = this.preMovePos [0]+32;

        });

        this.input.keyboard.on ('keydown-S', () =>{
            this.movePlayers(true, +32, layer_new, map)
            this.spielerstartpunkt [0] = this.spielerstartpunkt [0] - 1;
            x.setText(""+this.spielerstartpunkt);
            this.splitCalc(WAHRSCHEINLICHKEITEN[this.spielerstartpunkt[0]][this.spielerstartpunkt[1]+1], player);
            this.preMovePos[1] = this.preMovePos [1]+32;

        });

        this.input.keyboard.on ('keydown-W', () =>{
            this.movePlayers(true, -32, layer_new, map)
            this.spielerstartpunkt [0] = this.spielerstartpunkt [0] + 1;
            x.setText(""+this.spielerstartpunkt);
            this.splitCalc(WAHRSCHEINLICHKEITEN[this.spielerstartpunkt[0]][this.spielerstartpunkt[1]-1], player);
            this.preMovePos[1] = this.preMovePos [1]-32;

        });
      
    }
    //Calculates whether the PlayerGroup splits after a PlayerMove and in which directions N,E,S,W, Figur ist die Figur die fuer ein split gecheckt wird, BUG!!!!
    // Datentypen von kevinnguyen geändert, optimiert Typsicherheit
    private splitCalc(arr:number[][], figur:Phaser.GameObjects.Image): void {
        const nmbr = Phaser.Math.Between(1,150);
        //var txt = this.add.text(100,100, '' +arr);
        for (let i = 0; i<=3; i++){
            if (arr[i] != null)
                if (nmbr >= arr[i][0] && nmbr <= arr[i][1]){ // WIR KOMMEN NIE IN DIE SCHLEIFE,ARR IST IMMER UNKNOWN!!!!
                    // von kevinnguyen auskommentiert, doSplit erwartet nur 2 Argumente, außerdem ist figur nicht vom Typ number
                    this.doSplit(i /*, figur*/ , arr[i][2]);
                }
        }
    }

    //Bewegt alle Figuren des Spielers, x wenn false y wenn true, pos ist entweder +32 oder -32
    // Datentypen von kevinnguyen geändert, optimiert Typsicherheit
    private movePlayers(xory: boolean, pos: number, layer: Phaser.Tilemaps.Tilemap, map:Phaser.Tilemaps.Tilemap): void {
        this.playerInstances.forEach( (element)=> {
            if (xory === false){
                const tile = layer.getTileAtWorldXY(element.x+pos, element.y, true); 
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
                const tile = layer.getTileAtWorldXY(element.x, element.y+pos, true); 
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
    private doSplit(dir: number /*, figur:any*/ , percentage: number): void {
        if (dir === 0){
            this.setFigureAt(this.preMovePos[0], this.preMovePos[1]-32, percentage);
        }
        else if (dir === 1){
            this.setFigureAt(this.preMovePos[0]+32, this.preMovePos[1], percentage);
        }
        else if (dir === 2){
            this.setFigureAt(this.preMovePos[0], this.preMovePos[1]+32, percentage);
        }
        else {
            this.setFigureAt(this.preMovePos[0], this.preMovePos[1], percentage);
        }
    }

    private setFigureAt(x: number, y: number, percentage: number): void {
        const player = this.add.image (x,y,'player');
        // const tmp = this.playercount - percentage;
        const neueGruppe = this.add.text(x,y, ''+percentage ,{color: '#FF0000' })
        this.playercount = this.playercount - percentage;
        this.playercounttext.setText(''+this.playercount);
        this.playerInstances.push(neueGruppe);
        this.playerInstances.push (player);
    }


    private setupWorld(): void {
        console.log("[0] setupWorld\n")
    }

    private setupCollision(): void {
        console.log("[0] setupCollision\n")
    }

    update(): void {
        console.log("[0] update\n")
    }
}

