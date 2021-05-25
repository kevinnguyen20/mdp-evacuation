import { TileParser } from "../util/tileParser";
import { TilePiece } from "../util/tilePiece";
import { Figure } from "../util/figure"
import { LevelFunctions } from "../util/levelFunctions";

export class level1 extends Phaser.Scene {
    private score = 0;
    private scoreText: Phaser.GameObjects.Text = null;

    // ??????????????????????????????????
    //  do we still need this
    private queenPos:number[];
    private queenPositionText = null;
    // ??????????????????????????????????

    private figureInitCount = 8;
    private figureList: Figure[];
    private tilesList: TilePiece[]; 

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

    0 _______________________ x
    |
    |
    |
    |
    |
    |
    |
    y 

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
        const mapPosY = 2/20 * window.screen.height;

        const tileset = this.map.addTilesetImage('scifi', 'tileset-scifi');

        this.layerGround = this.map.createStaticLayer(
            'Ground', // layerID
            tileset,        // tileset
            mapPosX,              // x
            mapPosY              // y
        );

        this.layerDesign = this.map.createLayer(   // there is no need to read this layer ever, only create it
            'Design', // layerID
            tileset,        // tileset
            mapPosX,              // x
            mapPosY              // y
        );

        this.layerAction = this.map.createLayer(
            'Action', // layerID
            tileset,        // tileset
            mapPosX,              // x
            mapPosY              // y
        );

        this.tilesList = TileParser.tileTupleAPI(this.layerGround);

        // sets the Startposition automatically by reading the Map
        const startingPosition: [number, number] = LevelFunctions.getStartPostition(this.layerGround);
        console.log("Start at X:" + startingPosition[0] / 32 + " Y:" + startingPosition[1] / 32);

        this.figureList = LevelFunctions.initFigureList(this.figureInitCount, startingPosition);

        this.queenPos = [startingPosition[0] / 32, startingPosition[1] /32];

        let queen: Figure;

        console.log("figureList");
        this.figureList.forEach((figure) => {
            console.log(figure.toString());
            figure.image = this.add.image(mapPosX + figure.x + Figure.STEP_SIZE / 2, mapPosY + figure.y + Figure.STEP_SIZE / 2,'queen');
            if(figure.isQueen) queen = figure;
        });
        console.log("size: " + this.figureList.length) 


        const layerPerspective = this.map.createLayer(
            'Perspective', // layerID
            tileset,        // tileset
            mapPosX,              // x
            mapPosY              // y
        );
        
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
            if(LevelFunctions.queenValidMoveCheck(false, -Figure.STEP_SIZE, this.layerGround, this.figureList[0])) {
                
                this.queenPos[0] -= 1;
                this.figureList[0] = this.movePlayer(false, -Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.decideDirection(false, -Figure.STEP_SIZE);

                this.preMovePos[0] -= Figure.STEP_SIZE;
            }
        });

        this.input.keyboard.on('keydown-D', () =>{
            if (LevelFunctions.queenValidMoveCheck(false, Figure.STEP_SIZE, this.layerGround, this.figureList[0])){

                this.queenPos[0] += 1;
                this.figureList[0] = this.movePlayer(false, Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.decideDirection(false, Figure.STEP_SIZE);

                this.preMovePos[0] += Figure.STEP_SIZE;
            }
        });

        this.input.keyboard.on('keydown-S', () =>{
            if (LevelFunctions.queenValidMoveCheck(true, Figure.STEP_SIZE, this.layerGround, this.figureList[0])){

                this.queenPos[1] += 1;
                this.figureList[0] = this.movePlayer(true, Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.decideDirection(true, Figure.STEP_SIZE);

                this.preMovePos[1] += Figure.STEP_SIZE;
            }
        });

        this.input.keyboard.on('keydown-W', () =>{
            if (LevelFunctions.queenValidMoveCheck(true, -Figure.STEP_SIZE, this.layerGround, this.figureList[0])){

                this.queenPos[1] -= 1;
                this.figureList[0] = this.movePlayer(true, -Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);
                this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                this.decideDirection(true, -Figure.STEP_SIZE);

                this.preMovePos[1] -= Figure.STEP_SIZE;
            }
        });
    }


    /**
     * Decides the direction in which the non-queen players should be moved
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     */
    private decideDirection(xory: boolean, pos: number): void {
        this.figureList.forEach( (element) =>{
            if(element.isQueen == false){
                if(LevelFunctions.followQueen(this.tilesList[(element.x + 23*element.y)/32])){
                    element = this.movePlayer(xory, pos, this.layerGround, this.layerAction, this.map, element);
                }
                else{
                    const direction: number = LevelFunctions.generateDirection(this.tilesList[(element.x + element.y*23)/32]);
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

    private movePlayer(xory: boolean, pos: number, layerGround: Phaser.Tilemaps.Tilemap, layerAction: Phaser.Tilemaps.Tilemap, map:Phaser.Tilemaps.Tilemap, element: Figure): Figure {        
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
            this.tilesList[(element.x + 23*element.y)/32].playersOnTop--; 

            if(xory === false){                 
                element.updateCoordinates(pos, 0);
            } 
            else {
                element.updateCoordinates(0, pos);
            }

            this.tilesList[(element.x + 23*element.y)/32].playersOnTop++;

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

        this.figureInitCount -= percentage;
        this.playercounttext.setText('' + this.figureInitCount);
        this.playerInstances.push(neueGruppe);
        this.playerInstances.push(queen);
    }
    */

    update(): void {
        console.log();
    }
}
