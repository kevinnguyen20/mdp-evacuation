import { TileParser } from "../util/tileParser";
import { TilePiece } from "../util/tilePiece";
import { Figure } from "../util/figure"
import { AnimatedTile } from "../util/animatedTile";

import { Figures, LevelFunctionsUpgraded, MapPosition, OurGame, OurMap, Tiles } from "../util/LevelFunctionsUpgraded";
import { RestartButton } from "../util/RestartButton";
import { OurMovement } from "../util/OurMovement";

export class level3 extends Phaser.Scene {
    private ourGame: OurGame;
    private mapPosition: MapPosition;
    private tiles: Tiles;
    private figures: Figures;
    private ourMap: OurMap;

    private score = 0;
    private winCondition = 6;

    constructor() {
        super({
            key: "level3"
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
        this.load.tilemapTiledJSON('map3','./assets/sprites/Level_3.json');   
        this.load.image('queen', './assets/sprites/alien.svg');
        this.load.image('restartButton', './assets/sprites/restartButton.png');
        this.load.image('nextLevelButton', './assets/sprites/nextLevelButton.png');
        this.load.image('returnMainMenuButton', './assets/sprites/returnMainMenu.png');
        this.load.image('green', './assets/sprites/green.png');
        this.load.image('red', './assets/sprites/red.png');
        this.load.image('orange', './assets/sprites/orange.png');
        this.load.image('yellow', './assets/sprites/yellow.png');
    }

    init(): void {
        this.data.set('playerScore', 0);
        this.data.set('playerWinningScore', 8);
    }

    create(): void {
        this.input.keyboard.enabled = true;
        this.cameras.main.setZoom(1.2,1.2);

        // MAP
        this.mapPosition = {
            mapPosX: this.sys.game.config.width as number * 1/50,
            mapPosY: this.sys.game.config.height as number * 3.5/20
        };
        
        const tmpMap = this.make.tilemap({
            key: 'map3',
            tileWidth: 32,
            tileHeight: 32
        });
        
        const tileset = tmpMap.addTilesetImage('scifi', 'tileset-scifi');
        this.ourMap = {
            map: tmpMap,
            layers: LevelFunctionsUpgraded.setupLayer(tileset, this.mapPosition, tmpMap)
        };

        // TILES
        const t1 = TileParser.tileTupleAPI(this.ourMap.layers.layerGround, this.ourMap.layers.layerAction, this.ourMap.layers.layerSplit, this.ourMap.layers.layerDirection);
        const t2 = LevelFunctionsUpgraded.getGoalTile(t1);
        this.tiles = {
            tilesList: t1,
            queenFieldIndicator: null,
            goalTile: t2,
            animatedTiles: []
        };
        LevelFunctionsUpgraded.activateAnimations(tileset, this.ourMap.map, this.tiles.animatedTiles);

        // FIGURES
        const startingPosition: [number, number] = LevelFunctionsUpgraded.getStartPostition(this.ourMap.layers.layerGround);
        this.figures = {
            figureInitCount: 14,
            figureList: LevelFunctionsUpgraded.initFigureList(14, startingPosition)
        };
        this.figures.figureList.forEach((figure) => {
            this.tiles.tilesList[figure.x/32 + figure.y/32 * this.ourMap.layers.layerAction.layer.width].playersOnTopCounter++;
            figure.image = this.add.image(this.mapPosition.mapPosX + figure.x + Figure.STEP_SIZE / 2, 
                this.mapPosition.mapPosY + figure.y + Figure.STEP_SIZE / 2,'queen').setDepth(4);
            this.tiles.tilesList[figure.x/32 + figure.y/32 * this.ourMap.layers.layerAction.layer.width].playerOnTopList.push(figure);
        });
        LevelFunctionsUpgraded.visualizePlayerCount(this.tiles.tilesList);
        // GAME
        this.ourGame = {
            score: this.score,
            scoreText: this.add.text(
                this.mapPosition.mapPosX + 70, 
                this.mapPosition.mapPosY - 40,  
                'Coins collected: ' + this.score
            ),
            queenPos: [startingPosition[0]/32, startingPosition[1]/32],
            gameFinished: false,
            survivorScoreText: this.add.text(
                this.mapPosition.mapPosX + 70, 
                this.mapPosition.mapPosY - 20,  
                '' + this.winCondition + ' aliens (including queen) must reach the goal! ' 
            ),
            winCond: this.winCondition
        };

        // RESTART BUTTON
        const restartButton = this.add.image(this.mapPosition.mapPosX+610, this.mapPosition.mapPosY-27, 'restartButton');
        RestartButton.init(restartButton, this.mapPosition, this, this.ourGame)
        
        // MOVEMENT
        LevelFunctionsUpgraded.addReturnButton(this);
        LevelFunctionsUpgraded.createPlayerCountText(this.tiles.tilesList, this.add);
        
        this.input.keyboard.on('keydown-A', () =>{
            if(LevelFunctionsUpgraded.queenValidMoveCheck(false, -Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished)
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'left', this.mapPosition, 1);
        });

        this.input.keyboard.on('keydown-D', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(false, Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished)
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'right', this.mapPosition, 1);
        });

        this.input.keyboard.on('keydown-S', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(true, Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished)
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'down', this.mapPosition, 1);
        });

        this.input.keyboard.on('keydown-W', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(true, -Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished)
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'up', this.mapPosition, 1);
        });
    }

    /**
     * Moves non-queen players in queen's or a random directions
     * 
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     */
    /*
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
    */

    update(): void {
        this.tiles.animatedTiles.forEach(tile => tile.update(14));
    }
}
