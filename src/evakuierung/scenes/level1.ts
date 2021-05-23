import { TileParser } from "../util/tileParser";
import { TilePiece } from "../util/tilePiece";
import { Player } from "../util/player"
import { LevelFunctions } from "../util/levelFunctions";

export class level1 extends Phaser.Scene {

    private tileParser:TileParser = new TileParser();

    private playercount: number;
    private playerInstances = [];
    private playercounttext: Phaser.GameObjects.Text;

    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text = null;

    // ??????????????????????????????????
    //  do we still need this
    private queenPos:number[];
    private queenAlive = true;
    private queen = null;
    private queenPositionText = null;
    // ??????????????????????????????????

    private figureInitCount: number = 8;
    private figureList: Player[] = [];

    private preMovePos = [];

    private map = null;
    
    private WAHRSCHEINLICHKEITEN = [
        [[null, null, null , null], [[1, 99, 99], [100, 100, 1], null, null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [[1,50, 50], [51,100, 50], null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]],
        [[null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null], [null, null, null , null]]
    ];



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

        const mapPosX = 1/90 * window.screen.width;
        const mapPosY = 1/20 * window.screen.height;

        const tileset = this.map.addTilesetImage('scifi', 'tileset-scifi');

        const layerGround = this.map.createStaticLayer(
            'Ground', // layerID
            tileset,        // tileset
            mapPosX,              // x
            mapPosY              // y
        );

        const layerDesign = this.map.createLayer(   // there is no need to read this layer ever, only create it
            'Design', // layerID
            tileset,        // tileset
            mapPosX,              // x
            mapPosY              // y
        );

        const layerAction = this.map.createLayer(
            'Action', // layerID
            tileset,        // tileset
            mapPosX,              // x
            mapPosY              // y
        );


        // sets the Startposition automatically by reading the Map
        const startingPosition: [number, number] = LevelFunctions.getStartPostition(layerGround);
        console.log("Start at X:" + startingPosition[0] / 32 + " Y:" + startingPosition[1] / 32);

        this.figureList = LevelFunctions.initFigureList(this.figureInitCount, startingPosition);

        this.queenPos = [startingPosition[0] / 32, startingPosition[1] /32];
        this.queen = this.add.image(mapPosX + 512 + TileParser.TILE_SIZE / 2, mapPosY + 64 + TileParser.TILE_SIZE / 2,'queen');

        this.playerInstances.push(this.queen);

        console.log("PlayerInsatnce");
        this.playerInstances.forEach((element) => {
            console.log("" + element);
        });


        let queen: Player;

        console.log("figureList");
        this.figureList.forEach((player) => {
            console.log(player.toString());
            player.image = this.add.image(mapPosX + player.x + TileParser.TILE_SIZE / 2, mapPosY + player.y + TileParser.TILE_SIZE / 2,'queen');
            if(player.isQueen) queen = player;
        });
        console.log("size: " + this.figureList.length)
        

        

        
        this.scoreText = this.add.text(
            2 * mapPosX, 
            mapPosY - 80,  
            'Score: ' + this.score
        );
        
        this.preMovePos = [400,48];
        
        this.queenPositionText = this.add.text(
            2 * mapPosX, 
            mapPosY - 60, 
            "Queen's position: (" + this.queenPos[0] + "," + this.queenPos[1] + ")"
        );

        

        //########################################
        // this.splitCalc() is producing a Uncaught TypeError, maybe cus the this.WAHRSCHEINLICHKEITEN[] is not updated for the new Levels
        //########################################

        this.input.keyboard.on('keydown-A', () =>{
            if(this.queenAlive && LevelFunctions.queenValidMoveCheck(false, -TileParser.TILE_SIZE, layerGround, queen)) {
                console.log("A");
                this.queenPos[0] -= 1;
                this.movePlayers(false, -32, layerGround, layerAction, this.map);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                //this.splitCalc(this.WAHRSCHEINLICHKEITEN[this.queenPos[0]][this.queenPos[1] + 1]);

                this.preMovePos[0] -= 32;
            }
        });

        this.input.keyboard.on('keydown-D', () =>{
            if(this.queenAlive && LevelFunctions.queenValidMoveCheck(false, TileParser.TILE_SIZE, layerGround, queen)) {
                console.log("D");
                this.queenPos[0] += 1;
                this.movePlayers(false, +32, layerGround, layerAction, this.map);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                //this.splitCalc(this.WAHRSCHEINLICHKEITEN[this.queenPos[0]][this.queenPos[1] - 1]);

                this.preMovePos[0] += 32;
            }
        });

        this.input.keyboard.on('keydown-S', () =>{
            if(this.queenAlive && LevelFunctions.queenValidMoveCheck(true, -TileParser.TILE_SIZE, layerGround, queen)) {
                console.log("S");
                this.queenPos[1] += 1;
                this.movePlayers(true, +32, layerGround, layerAction, this.map)
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                //this.splitCalc(this.WAHRSCHEINLICHKEITEN[this.queenPos[0]][this.queenPos[1] + 1]);

                this.preMovePos[1] += 32;
            }
        });

        this.input.keyboard.on('keydown-W', () =>{
            if(this.queenAlive && LevelFunctions.queenValidMoveCheck(true, TileParser.TILE_SIZE, layerGround, queen)) {
                console.log("W");
                this.queenPos[1] -= 1;
                this.movePlayers(true, -32, layerGround, layerAction, this.map)
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                //this.splitCalc(this.WAHRSCHEINLICHKEITEN[this.queenPos[0]][this.queenPos[1] - 1]);

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

    /*

    splitCalc IST NEU ZU IMPLEMENTIEREN !!!!!!!!!!!!!!

    private splitCalc(arr:number[][]): void {
        const nmbr = Phaser.Math.Between(1,150);
        for(let i = 0; i<=3; i++)
            if(arr[i] != null)
                if(nmbr>=arr[i][0] && nmbr<=arr[i][1]) {
                    //this.doSplit(i, arr[i][2]);
                }
    }
    */

    /**
     * Moves all the figures (including the queen!)
     * 
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     * @param layer the layer we're operating on
     * @param map the map we're operating on
     */

    private movePlayers(xory: boolean, pos: number, layerGround: Phaser.Tilemaps.Tilemap, layerAction: Phaser.Tilemaps.Tilemap, map:Phaser.Tilemaps.Tilemap): void {
        this.figureList.forEach( (figure)=> {
            let tile:Phaser.Tilemaps.Tile = null;
            let tileAction:Phaser.Tilemaps.Tile = null;
            

            // Determine if which axis we're moving on
            if (xory === false){
                tile = layerGround.getTileAtWorldXY(figure.x+pos, figure.y, true);
                tileAction = layerAction.getTileAtWorldXY(figure.x+pos, figure.y, true); 
            } else {
                tile = layerGround.getTileAtWorldXY(figure.x, figure.y+pos, true); 
                tileAction = layerAction.getTileAtWorldXY(figure.x, figure.y+pos, true); 
            } 
            // eslint-disable-next-line no-empty
            if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID) {} //blocked, can't move, do nothing
            else {           
                if(xory === false) figure.x += pos; 
                else figure.y += pos;

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
        });
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

        this.figureInitCount -= percentage;
        this.playercounttext.setText('' + this.figureInitCount);
        this.playerInstances.push(neueGruppe);
        this.playerInstances.push(queen);
    }

    update(): void {
        console.log();
    }
}
