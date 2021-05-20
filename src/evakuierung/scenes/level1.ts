import { TileParser } from "../util/tileParser";

export class level1 extends Phaser.Scene {

    private tileParser:TileParser = new TileParser();

    private playercount;
    private playerInstances = [];
    private playercounttext;

    private score = 0;
    private scoreText = null;

    private queenPos = [];
    private queenAlive = true;
    private queen = null;
    private queenPositionText = null;

    private preMovePos = [];
    
    private WAHRSCHEINLICHKEITEN = [
        [[null, null, null , null], [[1, 99, 99], [100, 100, 1], null, null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [[1,50, 50], [51,100, 50], null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]]
    ];

    private map = null;


    constructor() {
        super({
            key: "level1"
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
        this.data.set('playerWinningScore', 8);
    }


    /*********************************************
    -------------FOR TILEMAP----------------------
    **********************************************
    x
    |
    |
    |
    |
    |
    |
    |________________________ y
    0

    **********************************************
    **********************************************
    **********************************************/

    /*********************************************
    -------------FOR GAMESCREEN-------------------
    **********************************************

    0 _______________________ x
    |
    |
    |
    |
    |
    |
    |
    y 
    
    **********************************************
    **********************************************
    **********************************************/



    create(): void {
        this.map = this.make.tilemap({
            key: 'map',
            tileWidth: 32,
            tileHeight: 32
        });

        const tileset = this.map.addTilesetImage('scifi', 'tiles');
        const layer = this.map.createLayer(
            'Tile Layer 1', // layerID
            tileset,        // tileset
            0,              // x
            0               // y
        );
        
        this.queen = this.add.image(400, 48,'queen');
        this.queenPos = [5,12];

        this.playercount = 8;
        this.playerInstances.push(this.queen);
        this.playercounttext = this.add.text(
            365,                    // x
            48,                     // y
            '8',                    // text
            {
                color: '#FF0000'    // style
            }
        )
        this.playerInstances.push(this.playercounttext);

        this.scoreText = this.add.text(
            430,
            30, 
            'Score: ' + this.score
        );

        this.preMovePos = [400,48];
        
        this.queenPositionText = this.add.text(
            430, 
            50, 
            "Queen's position: (" + this.queenPos[0] + "," + this.queenPos[1] + ")"
        );

        
        this.input.keyboard.on('keydown-A', () =>{
            if(this.queenAlive && this.queenValidMoveCheck(false, -32, layer)) {
                
                this.queenPos[1] -= 1;
                this.movePlayers(false, -32, layer, this.map);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.splitCalc(this.WAHRSCHEINLICHKEITEN[
                    this.queenPos[0]
                ][
                    this.queenPos[1] + 1
                ]);

                this.preMovePos[0] -= 32;
            }
        });

        this.input.keyboard.on('keydown-D', () =>{
            if (this.queenAlive && this.queenValidMoveCheck(false, +32, layer)){

                this.queenPos[1] += 1;
                this.movePlayers(false, +32, layer, this.map);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.splitCalc(this.WAHRSCHEINLICHKEITEN[
                    this.queenPos[0]
                ][
                    this.queenPos[1] - 1
                ]);

                this.preMovePos[0] += 32;
            }
        });

        this.input.keyboard.on('keydown-S', () =>{
            if (this.queenAlive && this.queenValidMoveCheck(true, +32, layer)){

                this.queenPos[0] -= 1;
                this.movePlayers(true, +32, layer, this.map)
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.splitCalc(this.WAHRSCHEINLICHKEITEN[
                    this.queenPos[0]
                ][
                    this.queenPos[1] + 1
                ]);

                this.preMovePos[1] += 32;
            }
        });

        this.input.keyboard.on('keydown-W', () =>{
            if (this.queenAlive && this.queenValidMoveCheck(true, -32, layer)){

                this.queenPos[0] += 1;
                this.movePlayers(true, -32, layer, this.map)
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.splitCalc(this.WAHRSCHEINLICHKEITEN[
                    this.queenPos[0]
                ][
                    this.queenPos[1] - 1
                ]);

                this.preMovePos[1] -= 32;
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
    private queenValidMoveCheck(xory: boolean, pos:number, layer: Phaser.Tilemaps.Tilemap): boolean {
        let tile: Phaser.Tilemaps.Tile = null;
        if(xory === false) 
            tile = layer.getTileAtWorldXY(this.queen.x+pos, this.queen.y, true); 
        else 
            tile = layer.getTileAtWorldXY(this.queen.x, this.queen.y+pos, true); 

        if(this.tileParser.tileIDToAPIID_LVL1(tile.index) === TileParser.WALL_ID) 
            return false; //blocked, can't move, do nothing
        else
            return true;
    }

    private splitCalc(arr:number[][]): void {
        const nmbr = Phaser.Math.Between(1,150);
        for(let i = 0; i<=3; i++)
            if(arr[i] != null)
                if(nmbr>=arr[i][0] && nmbr<=arr[i][1])
                    this.doSplit(i, arr[i][2]);
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
            if (xory === false)
                tile = layer.getTileAtWorldXY(element.x+pos, element.y, true);
            else 
                tile = layer.getTileAtWorldXY(element.x, element.y+pos, true); 

            // eslint-disable-next-line no-empty
            if (this.tileParser.tileIDToAPIID_LVL1(tile.index) === TileParser.WALL_ID) {} //blocked, can't move, do nothing
            else {           
                if(xory === false) element.x += pos; 
                else element.y += pos;

                switch(this.tileParser.tileIDToAPIID_LVL1(tile.index)){
                    case TileParser.STOP_ID:
                        map.putTileAt(21, tile.x, tile.y);
                        this.scoreText.setText('Your final score: ' + this.score + "!");
                        this.input.keyboard.enabled = false;
                        break;

                    case TileParser.ACTIONFIELD_ID:
                        map.putTileAt(21, tile.x, tile.y);
                        this.score += 1;
                        this.scoreText.setText('Score: ' + this.score);
                        break;
                    
                    default:
                        break;
                }
            }
        });
    }

    /**
     * 
     * @param direction the direction of the movement - 0 (up), 1 (right), 2 (down), 3 (left)
     * @param percentage 
     */
    private doSplit(direction: number, percentage: number): void {
        if (direction === 0)
            this.setFigureAt(this.preMovePos[0], this.preMovePos[1] - 32, percentage);

        else if (direction === 1)
            this.setFigureAt(this.preMovePos[0] + 32, this.preMovePos[1], percentage);

        else if (direction === 2)
            this.setFigureAt(this.preMovePos[0], this.preMovePos[1] + 32, percentage);

        else
            this.setFigureAt(this.preMovePos[0] - 32, this.preMovePos[1], percentage);
    }

    private setFigureAt(x: number, y: number, percentage: number): void {
        const queen = this.add.image (x, y, 'queen');
        const neueGruppe = this.add.text(
            x, 
            y, 
            '' + percentage, 
            {
                color: '#FF0000'
            }
        );

        this.playercount -= percentage;
        this.playercounttext.setText('' + this.playercount);
        this.playerInstances.push(neueGruppe);
        this.playerInstances.push (queen);
    }



    update(): void {
        console.log();
    }
}
