import { TileParser } from "../util/tileParser";
import { TilePiece } from "../util/tilePiece";
import { Figure } from "../util/figure"
import { LevelFunctions } from "../util/levelFunctions";
import { Game, Tilemaps } from "phaser";

export class level2 extends Phaser.Scene {
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
    private gameFinished = false;
    private preMovePos = [];

    private map: Phaser.Tilemaps.Tilemap;


    private layerGround: Phaser.Tilemaps.TilemapLayer;
    private layerProbability: Phaser.Tilemaps.TilemapLayer;
    private layerAction: Phaser.Tilemaps.TilemapLayer;
    private layerDesign: Phaser.Tilemaps.TilemapLayer;
    private fieldColor: Phaser.GameObjects.Image = null;

    private mapPosX;
    private mapPosY;


    constructor() {
        super({
            key: "level2"
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
        this.load.tilemapTiledJSON('map2','./assets/sprites/Level_2.json');   
        this.load.image('queen', './assets/sprites/alien.svg');
        this.load.image('restartButton', './assets/sprites/restartButton.png');
        this.load.image('nextLevelButton', './assets/sprites/nextLevelButton.png');
        this.load.image('green', './assets/sprites/green.png');
        this.load.image('red', './assets/sprites/red.png');
        this.load.image('orange', './assets/sprites/orange.png');
        this.load.image('yellow', './assets/sprites/yellow.png');
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
            key: 'map2',
            tileWidth: 32,
            tileHeight: 32
        });

        this.cameras.main.setZoom(1.2,1.2);
        this.mapPosX = this.sys.game.config.width as number * 1/50;
        this.mapPosY = this.sys.game.config.height as number * 3.5/20;

        const tileset = this.map.addTilesetImage('scifi', 'tileset-scifi');

        this.layerGround = this.map.createLayer(
            'Ground',       // layerID
            tileset,        // tileset
            this.mapPosX,        // x
            this.mapPosY         // y
        );

        this.layerProbability = this.map.createLayer(   // there is no need to read this layer ever, only create it
            'Probability',  // layerID
            tileset,        // tileset
            this.mapPosX,        // x
            this.mapPosY,        // y

        );
        
        this.layerProbability.setVisible(false);    // set true if you want to see the probabilities

        this.layerAction = this.map.createLayer(
            'Action',       // layerID
            tileset,        // tileset
            this.mapPosX,        // x
            this.mapPosY         // y
        );

        this.layerDesign = this.map.createLayer(
            'Design',       // layerID
            tileset,        // tileset
            this.mapPosX,        // x
            this.mapPosY         // y
        );

        this.tilesList = TileParser.tileTupleAPI(this.layerGround, this.layerAction);

        // sets the Startposition automatically by reading the Map
        const startingPosition: [number, number] = LevelFunctions.getStartPostition(this.layerGround);
        console.log("Start at X:" + startingPosition[0] / 32 + " Y:" + startingPosition[1] / 32);

        this.figureList = LevelFunctions.initFigureList(this.figureInitCount, startingPosition);

        this.queenPos = [startingPosition[0] / 32, startingPosition[1] /32];

        console.log("figureList");
        this.figureList.forEach((figure) => {
            this.tilesList[figure.x/32 + figure.y/32 * this.layerAction.layer.width].playersOnTop++;
            console.log(figure.toString());
            figure.image = this.add.image(this.mapPosX + figure.x + Figure.STEP_SIZE / 2, this.mapPosY + figure.y + Figure.STEP_SIZE / 2,'queen').setDepth(2);
        });
        console.log("size: " + this.figureList.length) 


        const layerPerspective = this.map.createLayer(
            'Perspective',  // layerID
            tileset,        // tileset
            this.mapPosX,        // x
            this.mapPosY         // y
        );
        
        this.scoreText = this.add.text(
            this.mapPosX + 70, 
            this.mapPosY - 40,  
            'Score: ' + this.score
        );
        
        this.preMovePos = [400,48];
        
        this.queenPositionText = this.add.text(
            this.mapPosX + 70, 
            this.mapPosY - 20, 
            "Queen's position: (" + this.queenPos[0] + "," + this.queenPos[1] + ")"
        );

        const restartButton = this.add.image(this.mapPosX + 610, this.mapPosY - 27, 'restartButton');
        restartButton.setInteractive();
        restartButton.on('pointerup', () => {
            this.input.keyboard.enabled = true;
            this.gameFinished = false;
            this.score = 0;
            this.scene.restart();
        });
        restartButton.on('pointerover', function(pointer){
            restartButton.setScale(0.85, 0.85);
        });
        restartButton.on('pointerout', function(pointer){
            restartButton.setScale(1, 1);
        });
        

        this.createPlayerCountText(this.tilesList);

        //########################################
        // this.splitCalc() is producing a Uncaught TypeError, maybe cus the this.WAHRSCHEINLICHKEITEN[] is not updated for the new Levels
        //########################################

        this.input.keyboard.on('keydown-A', () =>{
            if(LevelFunctions.queenValidMoveCheck(false, -Figure.STEP_SIZE, this.layerGround, this.figureList[0])) {
                if(!this.gameFinished) {
                    this.queenPos[0] -= 1;
                    this.figureList[0] = this.movePlayer(false, -Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);
                    this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");
                    
                    this.moveInGeneratedDirection(false, -Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    this.updatePlayerCountText(this.tilesList);  

                    this.preMovePos[0] -= Figure.STEP_SIZE;
                }
            }
        });

        this.input.keyboard.on('keydown-D', () =>{
            if (LevelFunctions.queenValidMoveCheck(false, Figure.STEP_SIZE, this.layerGround, this.figureList[0])){
                if(!this.gameFinished) {
                    this.queenPos[0] += 1;
                    this.figureList[0] = this.movePlayer(false, Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);
                    this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                    this.moveInGeneratedDirection(false, Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    this.updatePlayerCountText(this.tilesList);

                    this.preMovePos[0] += Figure.STEP_SIZE;
                }
            }
        });

        this.input.keyboard.on('keydown-S', () =>{
            if (LevelFunctions.queenValidMoveCheck(true, Figure.STEP_SIZE, this.layerGround, this.figureList[0])){
                if(!this.gameFinished) {
                    this.queenPos[1] += 1;
                    this.figureList[0] = this.movePlayer(true, Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);
                    this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                    this.moveInGeneratedDirection(true, Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    this.updatePlayerCountText(this.tilesList);    

                    this.preMovePos[1] += Figure.STEP_SIZE;
                } 
            }
        });

        this.input.keyboard.on('keydown-W', () =>{
            if (LevelFunctions.queenValidMoveCheck(true, -Figure.STEP_SIZE, this.layerGround, this.figureList[0])){
                if(!this.gameFinished) {
                    this.queenPos[1] -= 1;
                    this.figureList[0] = this.movePlayer(true, -Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);
                    this.queenPositionText.setText("Queen's position: (" + this.queenPos + ")");

                    this.moveInGeneratedDirection(true, -Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    this.updatePlayerCountText(this.tilesList);    
                    
                    this.preMovePos[1] -= Figure.STEP_SIZE;
                }
            }
        });
    }

    /**
     * Moves non-queen players in queen's or a random directions
     * 
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     */
    public moveInGeneratedDirection(xory: boolean, pos: number, figureList: Figure[], tilesList: TilePiece[],
        layerGround: Phaser.Tilemaps.TilemapLayer, layerAction: Phaser.Tilemaps.TilemapLayer, map: Phaser.Tilemaps.Tilemap): void {
        figureList.forEach( (element) =>{
            if(element.isQueen == false){
                if(LevelFunctions.followQueen(tilesList[(element.x + 23*element.y)/32])){
                    element = this.movePlayer(xory, pos, layerGround, layerAction, map, element);
                }
                else{
                    const direction: number = LevelFunctions.generateDirection(tilesList[(element.x + element.y*23)/32]);
                    switch(direction){
                        case 0: 
                            element = this.movePlayer(true, -Figure.STEP_SIZE, layerGround, layerAction, map, element);
                            break;
                        case 1: 
                            element = this.movePlayer(false, Figure.STEP_SIZE, layerGround, layerAction, map, element);
                            break;
                        case 2: 
                            element = this.movePlayer(true, Figure.STEP_SIZE, layerGround, layerAction, map, element);
                            break;
                        case 3: 
                            element = this.movePlayer(false, -Figure.STEP_SIZE, layerGround, layerAction, map, element);
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

    private movePlayer(xory: boolean, pos: number, layerGround: Phaser.Tilemaps.TilemapLayer, layerAction: Phaser.Tilemaps.TilemapLayer, map:Phaser.Tilemaps.Tilemap, element: Figure): Figure {        
        let tile:Phaser.Tilemaps.Tile = null;
        let tileAction:Phaser.Tilemaps.Tile = null;
        let tilePr:Phaser.Tilemaps.Tile = null;
            

        // Determine if which axis we're moving on
        if (xory === false){
            tile = layerGround.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tileAction = layerAction.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tilePr = this.layerProbability.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
        } else {
            tile = layerGround.getTileAtWorldXY(element.image.x, element.image.y+pos, true); 
            tileAction = layerAction.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
            tilePr = this.layerProbability.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
        }
        // eslint-disable-next-line no-empty
        if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID) {} //blocked, can't move, do nothing
        else {   
            this.tilesList[(element.x + element.y * layerGround.layer.width)/32].playersOnTop--; 

            if(element.isQueen && this.fieldColor != null){
                this.fieldColor.destroy();
            }

            if(xory === false){                 
                element.updateCoordinates(pos, 0);   
            } 
            else {
                element.updateCoordinates(0, pos);
            }

            this.tilesList[(element.x + element.y * layerGround.layer.width)/32].playersOnTop++;

            //reveals the colour of the field after the queen steps on it
            if(element.isQueen){
                if(tilePr.index == 153){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'green').setDepth(1);
                }
                else if(tilePr.index == 165){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'orange').setDepth(1);
                }
                else if(tilePr.index == 164){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'yellow').setDepth(1);
                }
                else if(tilePr.index == 166){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'red').setDepth(1);
                }
            }

            if(!this.gameFinished) {
                if(TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) == TileParser.STOP_ID) {
                    this.scoreText.setText('Your final score: ' + this.score + "!");
                    this.input.keyboard.enabled = false;
                    this.gameFinished = true;
                    const nextLevelButton = this.add.image(this.sys.game.config.width as number / 2, this.sys.game.config.height as number / 2, 'nextLevelButton');
                    nextLevelButton.depth = 3;    // brings the button to the front
                    nextLevelButton.setInteractive();
                    nextLevelButton.on('pointerup', () => {
                        this.scene.transition({
                            target: "level3",
                            duration: 10
                        })
                    });
                    nextLevelButton.on('pointerover', function(pointer){
                        nextLevelButton.setScale(0.85, 0.85);
                    });
                    nextLevelButton.on('pointerout', function(pointer){
                        nextLevelButton.setScale(1, 1);
                    });
                }
            }
            
            if(TileParser.tileIDToAPIID_scifiLVL_Action(tileAction.index) == TileParser.ACTIONFIELD_ID) {
                layerAction.putTileAt(0, tileAction.x, tileAction.y);
                this.score += 1;
                this.scoreText.setText('Score: ' + this.score);
            }
        }
        
        return element;
    }
    /**
     * Initializes all the text objects for the playercount on each Tile
     * 
     * @param tilesList 
     */
    private createPlayerCountText(tilesList: TilePiece[]) : void{
        tilesList.forEach((element) => {
            element.text = this.add.text (element.tileCoordinates[0]+40, element.tileCoordinates[1]+125, ''+element.playersOnTop, {color: '#ffffff'} ).setDepth(2);
            if (element.playersOnTop === 0)
                element.text.setVisible(false);
        });
    }
    /**
     * Updates all the text objects for the playercount on each Tile 
     * !!! Should only be called after a Move has been processed !!!
     * 
     * @param tileList 
     */
    private updatePlayerCountText (tileList: TilePiece[]) : void {
        tileList.forEach((element) => {
            if (element.text.visible === true) {
                if(element.playersOnTop === 0){
                    element.text.setText(''+element.playersOnTop);
                    element.text.setVisible(false);
                }
                else{
                    element.text.setText(''+element.playersOnTop);
                }        
            }
            else if (element.text.visible === false && element.playersOnTop > 0) {
                element.text.setText(''+element.playersOnTop);
                element.text.setVisible(true);
            }
        })
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
