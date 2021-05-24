import { TileParser } from "../util/tileParser";
import { TilePiece } from "../util/tilePiece";
import { Player } from "../util/player"
import { LevelFunctions } from "../util/levelFunctions";

export class level1 extends Phaser.Scene {

    private tileParser:TileParser = new TileParser();

    private playercount: number;
    private playerInstances = [];
    private playercounttext;

    private score = 0;
    private scoreText = null;

    private queenPos:number[];
    private queenAlive = true;
    private queen = null;
    private queenPositionText = null;

    private playerList: Player[];
    private fiveTupelList: TilePiece[]; 

    private preMovePos = [];
    
    private map = null;

    private layerGround: Phaser.Tilemaps.Tilemap;
    private layerAction: Phaser.Tilemaps.Tilemap;
    private layerDesign: Phaser.Tilemaps.Tilemap;


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

        this.load.image('tileset-scifi','./assets/sprites/tileset-scifi.png');
        this.load.tilemapTiledJSON('map','./assets/sprites/Level_1.json');   
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

    /**
     * -----------DIRECTIONS-----------
     * 
     *               W(0)
     *          A(3) S(2) D(1)
     */



    create(): void {
        this.map = this.make.tilemap({
            key: 'map',
            tileWidth: 32,
            tileHeight: 32
        });

        //const layerX = 2/100 * window.innerWidth;
        //const layerY = 23/100 * window.innerHeight;

        //this.game.scale.updateCenter();

        const layerX = 1/90 * window.screen.width;
        const layerY = 1/20 * window.screen.height;

        const tileset = this.map.addTilesetImage('scifi', 'tileset-scifi');

        this.layerGround = this.map.createStaticLayer(
            'Ground', // layerID
            tileset,        // tileset
            layerX,              // x
            layerY              // y
        );

        this.layerDesign = this.map.createLayer(   // there is no need to read this layer ever, only create it
            'Design', // layerID
            tileset,        // tileset
            layerX,              // x
            layerY              // y
        );

        this.layerAction = this.map.createLayer(
            'Action', // layerID
            tileset,        // tileset
            layerX,              // x
            layerY              // y
        );

        this.fiveTupelList = TileParser.fiveTupleAPI(this.layerGround, this.layerAction);

        // sets the Startposition automatically by reading the Map
        const startingPosition: [number, number] = LevelFunctions.getStartPostition(this.layerGround);
        console.log("Start at X:" + startingPosition[0] / 32 + " Y:" + startingPosition[1] / 32);
        
        this.queenPos = [startingPosition[0] / 32, startingPosition[1] /32];
        this.queen = this.add.image(layerX + 512 + TileParser.TILE_SIZE / 2, layerY + 64 + TileParser.TILE_SIZE / 2,'queen');
        this.playercount = 8;
                
        this.playerInstances.push(this.queen);
        this.playerList = LevelFunctions.initFigureList(this.playercount, this.queenPos);
        this.fiveTupelList[this.queenPos[0] + 23*this.queenPos[1]].playersOnTop = this.playerList.length; //adds all players to the starting tile

        this.playercounttext = this.add.text(
            615,                    // x
            277,                     // y
            '8',                    // text
            {
                color: '#FF0000'    // style
            }
        )
        this.playerInstances.push(this.playercounttext);
        
        this.scoreText = this.add.text(
            2 * layerX, 
            layerY - 80,  
            'Score: ' + this.score
        );
        
        this.preMovePos = [400,48];
        
        this.queenPositionText = this.add.text(
            2 * layerX, 
            layerY - 60, 
            "Queen's position: (" + this.queenPos[0] + "," + this.queenPos[1] + ")"
        );

        

        //########################################
        // this.splitCalc() is producing a Uncaught TypeError, maybe cus the this.WAHRSCHEINLICHKEITEN[] is not updated for the new Levels
        //########################################

        this.input.keyboard.on('keydown-A', () =>{
            if(this.queenAlive && this.queenValidMoveCheck(false, -32, this.layerGround)) {
                
                this.queenPos[0] -= 1;
                this.playerList[0] = this.movePlayer(false, -32, this.layerGround, this.layerAction, this.map, this.playerList[0]);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.doSplit(false, -32);

                this.preMovePos[0] -= 32;
            }
        });

        this.input.keyboard.on('keydown-D', () =>{
            if (this.queenAlive && this.queenValidMoveCheck(false, +32, this.layerGround)){

                this.queenPos[0] += 1;
                this.playerList[0] = this.movePlayer(false, +32, this.layerGround, this.layerAction, this.map, this.playerList[0]);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.doSplit(false, +32);

                this.preMovePos[0] += 32;
            }
        });

        this.input.keyboard.on('keydown-S', () =>{
            if (this.queenAlive && this.queenValidMoveCheck(true, +32, this.layerGround)){

                this.queenPos[1] += 1;
                this.playerList[0] = this.movePlayer(true, +32, this.layerGround, this.layerAction, this.map, this.playerList[0]);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.doSplit(true, +32);

                this.preMovePos[1] += 32;
            }
        });

        this.input.keyboard.on('keydown-W', () =>{
            if (this.queenAlive && this.queenValidMoveCheck(true, -32, this.layerGround)){

                this.queenPos[1] -= 1;
                this.playerList[0] = this.movePlayer(true, -32, this.layerGround, this.layerAction, this.map, this.playerList[0]);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.doSplit(true, -32);

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

        if(TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID) 
            return false; //blocked, can't move, do nothing
        else
            return true;
    }

    /**
     * Executes the split for the non-queen players
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     */
    private doSplit(xory: boolean, pos: number): void {
        this.playerList.forEach( (element) =>{
            if(element.isQueen == false){
                if(element.followQueen){
                   element = this.movePlayer(xory, pos, this.layerGround, this.layerAction, this.map, element);
                }
                else{
                    const direction: number = this.generateDirection(this.fiveTupelList[(element.x + element.y*23)/32]);
                    switch(direction){
                        case 0: 
                            element = this.movePlayer(true, -32, this.layerGround, this.layerAction, this.map, element);
                            break;
                        case 1: 
                            element = this.movePlayer(false, +32, this.layerGround, this.layerAction, this.map, element);
                            break;
                        case 2: 
                            element = this.movePlayer(true, +32, this.layerGround, this.layerAction, this.map, element);
                            break;
                        case 3: 
                            element = this.movePlayer(false, -32, this.layerGround, this.layerAction, this.map, element);
                            break;
                    }
                }
            }
        });
    }
    

    /**
     * Moves a figure in a given direction (including the queen!)
     * 
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     * @param layer the layer we're operating on
     * @param map the map we're operating on
     */

    private movePlayer(xory: boolean, pos: number, layerGround: Phaser.Tilemaps.Tilemap, layerAction: Phaser.Tilemaps.Tilemap, map:Phaser.Tilemaps.Tilemap, element: Player): Player {        
        let tile:Phaser.Tilemaps.Tile = null;
        let tileAction:Phaser.Tilemaps.Tile = null;
            

        // Determine if which axis we're moving on
        if (xory === false){
            tile = layerGround.getTileAtWorldXY(element.x+pos, element.y, true);
            tileAction = layerAction.getTileAtWorldXY(element.x+pos, element.y, true); 
        } else {
            tile = layerGround.getTileAtWorldXY(element.x, element.y+pos, true); 
            tileAction = layerAction.getTileAtWorldXY(element.x, element.y+pos, true); 
        } 
        // eslint-disable-next-line no-empty
        if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID) {} //blocked, can't move, do nothing
        else {   
            this.fiveTupelList[(element.x + 23*element.y)/32].playersOnTop--; 

            if(xory === false){                 
                element.x += pos;
            } 
            else {
                element.y += pos;
            }

            this.fiveTupelList[(element.x + 23*element.y)/32].playersOnTop++;

            if(TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) == TileParser.STOP_ID) {
                this.scoreText.setText('Your final score: ' + this.score + "!");
                this.input.keyboard.enabled = false;
            }

            if(TileParser.tileIDToAPIID_scifiLVL_Action(tileAction.index) == TileParser.ACTIONFIELD_ID) {
                map.putTileAt(0, tileAction.x, tileAction.y);
                this.score += 1;
                this.scoreText.setText('Score: ' + this.score);
            }
        }
        
        return element;
    }

    /**
     * Determines the direction of the next split given the probabilities for each direction
     * 
     * @param currentTile the tile we're currently on 
     * @returns the direction of the split that occurs
     *          when leaving the tile - 0 (up), 1 (right), 2 (down), 3 (left)
     *           W(0)
     *      A(3) S(2) D(1)
     */
    private generateDirection(currentTile: TilePiece): number {
        const random: number = Math.random();     // returns a random num between 0 and 1
        if (random >= 0 &&
            random < currentTile.upProbability) {
            return 0;   // up
        } else if (random >= currentTile.upProbability &&
                   random < currentTile.upProbability + currentTile.downProbability) {
            return 2;   // down
        } else if (random >= currentTile.upProbability + currentTile.downProbability &&
                   random < currentTile.upProbability + currentTile.downProbability + currentTile.leftProbability) {
            return 3;   // left
        } else if (random >= currentTile.upProbability + currentTile.downProbability + currentTile.leftProbability &&
                   random < 1) {
            return 1;   // right
        }
        return -1;
    }


    /*

    doSplit() ist erstmal nicht benötigt...die Funktion bitte so lassen, vllt wird sie nützlich

    /**
     * 
     * @param direction the direction of the movement - 0 (up), 1 (right), 2 (down), 3 (left)
     *                   W(0)
     *              A(3) S(2) D(1)
     * @param percentage 
     
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
    */

    /*
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
    */

    update(): void {
        console.log();
    }
}
