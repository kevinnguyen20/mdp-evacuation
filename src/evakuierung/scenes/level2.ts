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
    // ??????????????????????????????????

    private figureInitCount = 8;
    private figureList: Figure[];
    private tilesList: TilePiece[]; 
    private gameFinished = false;
    private preMovePos = [];
    private survivorScore = 0;
    private survivorScoreText = Phaser.GameObjects.Text = null;
    private winCond = 6;

    private map: Phaser.Tilemaps.Tilemap;

    private layerGround: Phaser.Tilemaps.TilemapLayer;
    private layerProbability: Phaser.Tilemaps.TilemapLayer;
    private layerAction: Phaser.Tilemaps.TilemapLayer;
    private layerDesign: Phaser.Tilemaps.TilemapLayer;
    private layerPerspective: Phaser.Tilemaps.TilemapLayer; 
    private fieldColor: Phaser.GameObjects.Image = null;
    private goalTile: TilePiece;

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

    *************************s*********************/

    /**
     * -----------DIRECTIONS-----------
     * 
     *               W(0)
     *          A(3) S(2) D(1)
     */

    create(): void {
        this.gameFinished = false;
        this.input.keyboard.enabled = true;
        this.map = this.make.tilemap({
            key: 'map2',
            tileWidth: 32,
            tileHeight: 32
        });

        this.cameras.main.setZoom(1.2,1.2);
        this.mapPosX = this.sys.game.config.width as number * 1/50;
        this.mapPosY = this.sys.game.config.height as number * 3.5/20;

        const tileset = this.map.addTilesetImage('scifi', 'tileset-scifi');

        const setupLayer = LevelFunctions.setupLayer(tileset, this.mapPosX, this.mapPosY, this.map, this.layerGround, this.layerProbability, this.layerAction, this.layerDesign, this.layerPerspective);
        this.layerGround = setupLayer[0];
        this.layerProbability = setupLayer[1];
        this.layerAction = setupLayer[2];
        this.layerDesign = setupLayer[3];
        this.layerPerspective = setupLayer[4];

        this.tilesList = TileParser.tileTupleAPI(this.layerGround, this.layerAction);
        this.goalTile = LevelFunctions.getGoalTile(this.tilesList);


        // set the probabilities per Tile according to the map
        this.tilesList.forEach((tile) => {
            tile.setTileProbability(this.layerProbability);
        });

        // sets the Startposition automatically by reading the Map
        const startingPosition: [number, number] = LevelFunctions.getStartPostition(this.layerGround);

        this.figureList = LevelFunctions.initFigureList(this.figureInitCount, startingPosition);

        this.queenPos = [startingPosition[0] / 32, startingPosition[1] /32];

        this.figureList.forEach((figure) => {
            this.tilesList[figure.x/32 + figure.y/32 * this.layerAction.layer.width].playersOnTop++;
            figure.image = this.add.image(this.mapPosX + figure.x + Figure.STEP_SIZE / 2, this.mapPosY + figure.y + Figure.STEP_SIZE / 2,'queen').setDepth(2);
        });
        
        this.scoreText = this.add.text(
            this.mapPosX + 70, 
            this.mapPosY - 40,  
            'Coins collected: ' + this.score
        );

        this.survivorScoreText = this.add.text(
            this.mapPosX + 70, 
            this.mapPosY - 20,  
            '' + this.winCond + ' aliens (including queen) must reach the goal! ' 
        );
        
        this.preMovePos = [400,48];
        
        const restartButton = this.add.image(this.mapPosX + 610, this.mapPosY - 27, 'restartButton');
        restartButton.setInteractive();
        restartButton.on('pointerup', () => {
            this.input.keyboard.enabled = true;
            this.gameFinished = false;
            this.score = 0;
            this.scene.restart();
        });
        restartButton.on('pointerover', function(){restartButton.setScale(0.85, 0.85)});
        restartButton.on('pointerout', function(){restartButton.setScale(1, 1)});
        
        LevelFunctions.addReturnButton(this);
        LevelFunctions.createPlayerCountText(this.tilesList, this.add);

        this.input.keyboard.on('keydown-A', () =>{
            if(LevelFunctions.queenValidMoveCheck(false, -Figure.STEP_SIZE, this.layerGround, this.figureList[0])) {
                if(!this.gameFinished) {
                    this.queenPos[0] -= 1;
                    this.figureList[0] = this.movePlayer(false, -Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);
                    
                    this.moveInGeneratedDirection(false, -Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);

                    LevelFunctions.updatePlayerCountText(this.tilesList);  
                    this.preMovePos[0] -= Figure.STEP_SIZE;    
                    LevelFunctions.chainCharacters(this.figureList, this.goalTile);
                    LevelFunctions.winConditionReachedCheck(this.gameFinished, this.survivorScoreText, this.goalTile.playersOnTop, this.winCond, this, 3);
                }
            }
        });

        this.input.keyboard.on('keydown-D', () =>{
            if (LevelFunctions.queenValidMoveCheck(false, Figure.STEP_SIZE, this.layerGround, this.figureList[0])){
                if(!this.gameFinished) {
                    this.queenPos[0] += 1;
                    this.figureList[0] = this.movePlayer(false, Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);

                    this.moveInGeneratedDirection(false, Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    LevelFunctions.updatePlayerCountText(this.tilesList);

                    this.preMovePos[0] += Figure.STEP_SIZE;
                    LevelFunctions.chainCharacters(this.figureList, this.goalTile);                
                    LevelFunctions.winConditionReachedCheck(this.gameFinished, this.survivorScoreText, this.goalTile.playersOnTop, this.winCond, this, 3);
                }
            }
        });

        this.input.keyboard.on('keydown-S', () =>{
            if (LevelFunctions.queenValidMoveCheck(true, Figure.STEP_SIZE, this.layerGround, this.figureList[0])){
                if(!this.gameFinished) {
                    this.queenPos[1] += 1;
                    this.figureList[0] = this.movePlayer(true, Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);

                    this.moveInGeneratedDirection(true, Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    LevelFunctions.updatePlayerCountText(this.tilesList);    

                    this.preMovePos[1] += Figure.STEP_SIZE;
                    LevelFunctions.chainCharacters(this.figureList, this.goalTile);                
                    LevelFunctions.winConditionReachedCheck(this.gameFinished, this.survivorScoreText, this.goalTile.playersOnTop, this.winCond, this, 3);
                } 
            }
        });

        this.input.keyboard.on('keydown-W', () =>{
            if (LevelFunctions.queenValidMoveCheck(true, -Figure.STEP_SIZE, this.layerGround, this.figureList[0])){
                if(!this.gameFinished) {
                    this.queenPos[1] -= 1;
                    this.figureList[0] = this.movePlayer(true, -Figure.STEP_SIZE, this.layerGround, this.layerAction, this.map, this.figureList[0]);

                    this.moveInGeneratedDirection(true, -Figure.STEP_SIZE, this.figureList, this.tilesList, 
                        this.layerGround, this.layerAction, this.map);
                    LevelFunctions.updatePlayerCountText(this.tilesList);    
                    
                    this.preMovePos[1] -= Figure.STEP_SIZE;
                    LevelFunctions.chainCharacters(this.figureList, this.goalTile);                
                    LevelFunctions.winConditionReachedCheck(this.gameFinished, this.survivorScoreText, this.goalTile.playersOnTop, this.winCond, this, 3);
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
                if(LevelFunctions.followQueen(tilesList[(element.x + element.y * layerGround.layer.width)/32])){
                    element = this.movePlayer(xory, pos, layerGround, layerAction, map, element);
                }
                else{
                    const direction: number = LevelFunctions.generateDirection(tilesList[(element.x + element.y * layerGround.layer.width)/32]);
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

            const depth = 1;
            if(element.isQueen){
                ///////// log Tile at queens position //////////
                console.log(this.tilesList.find((tile) => (tile.tileCoordinates[0] === element.x && tile.tileCoordinates[1] === element.y)).toString());
                ////////////////////////////////////////////////
                if(tilePr.index == 153){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'green').setDepth(depth);
                }
                else if(tilePr.index == 165){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'orange').setDepth(depth);
                }
                else if(tilePr.index == 164){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'yellow').setDepth(depth);
                }
                else if(tilePr.index == 166){
                    this.fieldColor = this.add.image(this.mapPosX + element.x + Figure.STEP_SIZE / 2, this.mapPosY + element.y + Figure.STEP_SIZE / 2,'red').setDepth(depth);
                }
            }

            if(!this.gameFinished) {
                if(TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) == TileParser.STOP_ID) {
                    if(element.isQueen){
                        this.scoreText.setText('Your final score: ' + this.score + "!");
                        this.input.keyboard.enabled = false;
                        this.gameFinished = true;
                    }
                }
            }
            
            if(TileParser.tileIDToAPIID_scifiLVL_Action(tileAction.index) == TileParser.ACTIONFIELD_ID) {
                layerAction.putTileAt(0, tileAction.x, tileAction.y);
                this.score += 1;
                this.scoreText.setText('Coins collected: ' + this.score);
            }
        }
        return element;
    }

    update(): void {
        console.log();
    }
}
