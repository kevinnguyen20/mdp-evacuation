import { TileParser } from "../util/tileParser";

export class MainScene extends Phaser.Scene {

    private tileParser:TileParser = new TileParser();

    private playercount = 100;
    private playerInstances = [];
    private playercounttext;

    private score = 0;
    private scoreText;

    private queenPos = [];
    private queenAlive = true;
    private queen;

    private preMovePos = [];

    constructor() {
        super({
            key: "MainScene"
        });
    }

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
        this.load.image('queen', './assets/sprites/boar.png');
    }

    init(): void {
        this.data.set('playerScore', 0);
        this.data.set('playerWinningScore', 10);
    }

    create(): void {
        const map = this.make.tilemap({
            key: 'map',
            tileWidth: 32,
            tileHeight: 32
        });

        const tileset = map.addTilesetImage('scifi', 'tiles');
        const layer = map.createLayer(
            'Tile Layer 1', // layerID
            tileset,        // tileset
            0,              // x
            0               // y
        );
        const layer_new = layer as unknown as Phaser.Tilemaps.Tilemap;

        this.queen = this.add.image (400, 48,'queen');
        this.queenPos = [5,12];

        this.playercount = 8;
        this.playerInstances.push(this.queen);
        this.playercounttext = this.add.text (400, 48, '8', {color: '#FF0000' })
        this.playerInstances.push(this.playercounttext);

        this.scoreText = this.add.text(450,30, 'Score: ' + this.score);
        this.preMovePos = [400,48];
        
        const WAHRSCHEINLICHKEITEN = [
            [[null, null, null , null], [[1, 99, 99], [100, 100, 1], null, null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
            [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
            [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
            [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
            [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [[1,50, 50], [51,100, 50], null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
            [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
            [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]]
        ];
        const x = this.add.text (450, 45, this.queenPos[0]+ "," + this.queenPos[1]);


        this.input.keyboard.on ('keydown-A', () =>{
            if (this.queenAlive && this.queenValidMoveCheck(false, -32, layer_new)){ //if queen alive and queen can move to tile then perform move for rest 
                this.movePlayers(false, -32, layer_new, map)
                this.queenPos [1] = this.queenPos [1] - 1;      // queen moves one field left along the x axis
                x.setText(""+this.queenPos);
                // var ll = this.add.text (100,100, ''+WAHRSCHEINLICHKEITEN[this.queenPos[0]][this.queenPos[1]]);
                this.splitCalc(WAHRSCHEINLICHKEITEN[this.queenPos[0]][this.queenPos[1]+1], this.queen);
                this.preMovePos[0] = this.preMovePos [0]-32;
            }
        });

        this.input.keyboard.on ('keydown-D', () =>{
            //queen.x += 32;
            if (this.queenAlive && this.queenValidMoveCheck(false, +32, layer_new)){
                this.queenPos [1] = this.queenPos [1] + 1;      // queen moves one field right along the x axis
                //playercounttext.x += 32;
                this.movePlayers(false, +32, layer_new, map);
                x.setText(""+this.queenPos);
                this.splitCalc(WAHRSCHEINLICHKEITEN[this.queenPos[0]][this.queenPos[1]-1], this.queen);
                this.preMovePos[0] = this.preMovePos [0]+32;
            }

        });

        this.input.keyboard.on ('keydown-S', () =>{
            if (this.queenAlive && this.queenValidMoveCheck(true, +32, layer_new)){
                this.movePlayers(true, +32, layer_new, map)
                this.queenPos [0] = this.queenPos [0] - 1;      // queen moves one field down the y axis
                x.setText(""+this.queenPos);
                this.splitCalc(WAHRSCHEINLICHKEITEN[this.queenPos[0]][this.queenPos[1]+1], this.queen);
                this.preMovePos[1] = this.preMovePos [1]+32;
            }

        });

        this.input.keyboard.on ('keydown-W', () =>{
            if (this.queenAlive && this.queenValidMoveCheck(true, -32, layer_new)){
                this.movePlayers(true, -32, layer_new, map)
                this.queenPos [0] = this.queenPos [0] + 1;      // queen moves one field up the y axis
                x.setText(""+this.queenPos);
                this.splitCalc(WAHRSCHEINLICHKEITEN[this.queenPos[0]][this.queenPos[1]-1], this.queen);
                this.preMovePos[1] = this.preMovePos [1]-32;
            }

        });
      
    }

    /**
     * Checks if the queen moves in a valid direction
     * 
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     * @param layer the layer we're operating on
     * @returns true if the move is valid, false if not
     */

    private queenValidMoveCheck (xory: boolean, pos:number, layer: Phaser.Tilemaps.Tilemap): boolean{
        let tile:Phaser.Tilemaps.Tile = null;
        if (xory === false){
            tile = layer.getTileAtWorldXY(this.queen.x+pos, this.queen.y, true); 
        } else {
            tile = layer.getTileAtWorldXY(this.queen.x, this.queen.y+pos, true); 
        }

        if (this.tileParser.tileIDToAPIID_LVL1(tile.index) === TileParser.WALL_ID){
            //blocked, can't move, do nothing
            return false;
        }
        return true;
    }

    // Calculates whether the PlayerGroup splits after a PlayerMove and in which directions N,E,S,W, Figur ist die Figur die fuer ein split gecheckt wird, BUG!!!!
    // Datentypen von kevinnguyen geändert, optimiert Typsicherheit
    private splitCalc(arr:number[][], figur:Phaser.GameObjects.Image): void {
        const nmbr = Phaser.Math.Between(1,150);
        //var txt = this.add.text(100,100, '' +arr);
        for (let i = 0; i<=3; i++){
            if (arr[i] != null)
                if (nmbr >= arr[i][0] && nmbr <= arr[i][1]){ // WIR KOMMEN NIE IN DIE SCHLEIFE,ARR IST IMMER UNKNOWN!!!!
                    // von kevinnguyen auskommentiert, doSplit erwartet nur 2 Argumente, außerdem ist figur nicht vom Typ number
                    this.doSplit(i, arr[i][2]);
                }
        }
    }

    /**
     * Moves all the figures (including the queen!)
     * 
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     * @param layer the layer we're operating on
     * @param map the map we're operating on
     */

    private movePlayers(xory: boolean, pos: number, layer: Phaser.Tilemaps.Tilemap, map:Phaser.Tilemaps.Tilemap): void {
        this.playerInstances.forEach( (element)=> {
            let tile:Phaser.Tilemaps.Tile = null;

            // Determine if which axis we're moving on
            if (xory === false){
                tile = layer.getTileAtWorldXY(element.x+pos, element.y, true);
            } else {
                tile = layer.getTileAtWorldXY(element.x, element.y+pos, true); 
            }

            if (this.tileParser.tileIDToAPIID_LVL1(tile.index) === TileParser.WALL_ID){
                //blocked, can't move, do nothing
            }
            else {            
                if(xory === false){ element.x += pos; } else { element.y += pos; } // this must be done before the switch, don't know why though

                switch(this.tileParser.tileIDToAPIID_LVL1(tile.index)){
                    case TileParser.STOP_ID: {
                        map.putTileAt(21, tile.x, tile.y);
                        this.scoreText.setText('You finished the level with score ' + this.score + "!");
                        this.input.keyboard.enabled = false;
                        break;
                    }

                    case TileParser.ACTIONFIELD_ID: {
                        map.putTileAt(21, tile.x, tile.y);
                        this.score+= 1;
                        this.scoreText.setText('Score: ' + this.score);
                        break;
                    }
                    default: break;
                }
            }
        });
    }

    /**
     * 
     * @param direction the direction of the movement - 0 (down), 1 (right), 2 (up)
     * @param percentage 
     */
    private doSplit(direction: number, percentage: number): void {
        if (direction === 0){
            this.setFigureAt(this.preMovePos[0], this.preMovePos[1]-32, percentage);
        }
        else if (direction === 1){
            this.setFigureAt(this.preMovePos[0]+32, this.preMovePos[1], percentage);
        }
        else if (direction === 2){
            this.setFigureAt(this.preMovePos[0], this.preMovePos[1]+32, percentage);
        }
        else {
            this.setFigureAt(this.preMovePos[0], this.preMovePos[1], percentage);
        }
    }

    private setFigureAt(x: number, y: number, percentage: number): void {
        const queen = this.add.image (x, y, 'queen');
        // const tmp = this.playercount - percentage;
        const neueGruppe = this.add.text(x, y, '' + percentage , {color: '#FF0000'})
        this.playercount = this.playercount - percentage;
        this.playercounttext.setText(''+this.playercount);
        this.playerInstances.push(neueGruppe);
        this.playerInstances.push (queen);
    }

    update(): void {
        console.log("[0] update\n")
    }
}
