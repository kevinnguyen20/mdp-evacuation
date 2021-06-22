import { TileParser } from "../util/tileParser";
import { TilePiece } from "../util/tilePiece";
import { Figure } from "../util/figure"
import { AnimatedTile } from "../util/animatedTile";

import { Figures, LevelFunctionsUpgraded, MapPosition, OurGame, OurMap, Tiles } from "../util/LevelFunctionsUpgraded";
import { RestartButton } from "../util/RestartButton";
import { OurMovement } from "../util/OurMovement";

export class level2 extends Phaser.Scene {
    private ourGame: OurGame;
    private mapPosition: MapPosition;
    private tiles: Tiles;
    private figures: Figures;
    private ourMap: OurMap;

    private score = 0;
    private winCondition = 8;
    private figureImages: Phaser.Textures.Texture[] = [];
    private movesLeft = 45; //this should be changed if it's changed in RestartButton.ts


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
        this.load.image('returnMainMenuButton', './assets/sprites/returnMainMenu.png');
        this.load.image('red', './assets/sprites/red.png');
        this.load.image('alienGreen1', 'assets/sprites/alien_green_1.png');
        this.load.image('alienGreen2', 'assets/sprites/alien_green_2.png');
        this.load.image('alienGreen3', 'assets/sprites/alien_green_3.png');
        this.load.image('alienGreen4', 'assets/sprites/alien_green_4.png');
        this.load.image('alienBlue1', 'assets/sprites/alien_blue_1.png');
        this.load.image('alienBlue2', 'assets/sprites/alien_blue_2.png');
        this.load.image('alienPurple', 'assets/sprites/alien_purple.png');
    }

    init(): void {
        this.data.set('playerScore', 0);
        this.data.set('playerWinningScore', 8);
    }

    create(): void {
        this.input.keyboard.enabled = true;
        this.cameras.main.setZoom(1.2,1.2);
        
        this.figureImages.push(this.textures.get('alienGreen1'));
        this.figureImages.push(this.textures.get('alienGreen2'));
        this.figureImages.push(this.textures.get('alienGreen3'));
        this.figureImages.push(this.textures.get('alienGreen4')); 
        this.figureImages.push(this.textures.get('alienPurple'));  
        this.figureImages.push(this.textures.get('alienBlue1'));
        this.figureImages.push(this.textures.get('alienBlue2'));       
        
        // MAP
        this.mapPosition = {
            mapPosX: this.sys.game.config.width as number * 1/50,
            mapPosY: this.sys.game.config.height as number * 3.5/20
        };
        
        const tmpMap = this.make.tilemap({
            key: 'map2',
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
            figure.image.setVisible(false);
            this.tiles.tilesList[figure.x/32 + figure.y/32 * this.ourMap.layers.layerAction.layer.width].playerOnTopList.push(figure);
        });
        LevelFunctionsUpgraded.visualizePlayerCount(this.tiles.tilesList, this.figureImages, this);
        // GAME
        this.ourGame = {
            score: this.score,
            scoreText: this.add.text(
                this.mapPosition.mapPosX + 70, 
                this.mapPosition.mapPosY - 40,  
                'Coins collected: ' + this.score
            ),
            movesLeft: this.movesLeft,
            movesLeftText: this.add.text(
                this.mapPosition.mapPosX + 260, 
                this.mapPosition.mapPosY - 40,  
                'Moves left: ' + this.movesLeft
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
        RestartButton.init(restartButton, this.mapPosition, this, this.ourGame);
        
        // MOVEMENT
        LevelFunctionsUpgraded.addReturnButton(this);
        LevelFunctionsUpgraded.createPlayerCountText(this.tiles.tilesList, this.add);
        
        this.input.keyboard.on('keydown-A', () =>{
            if(LevelFunctionsUpgraded.queenValidMoveCheck(false, -Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished){
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'left', this.mapPosition, 3);
                    LevelFunctionsUpgraded.visualizePlayerCount(this.tiles.tilesList, this.figureImages, this);
                    this.ourGame.movesLeft--;
                    LevelFunctionsUpgraded.checkMovesLeft(this, this.ourGame);
                }

        });

        this.input.keyboard.on('keydown-D', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(false, Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished){
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'right', this.mapPosition, 3);
                    LevelFunctionsUpgraded.visualizePlayerCount(this.tiles.tilesList, this.figureImages, this);
                    this.ourGame.movesLeft--;
                    LevelFunctionsUpgraded.checkMovesLeft(this, this.ourGame);
                }

        });

        this.input.keyboard.on('keydown-S', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(true, Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished){
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'down', this.mapPosition, 3);
                    LevelFunctionsUpgraded.visualizePlayerCount(this.tiles.tilesList, this.figureImages, this);
                    this.ourGame.movesLeft--;
                    LevelFunctionsUpgraded.checkMovesLeft(this, this.ourGame);
                }

        });

        this.input.keyboard.on('keydown-W', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(true, -Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0]))
                if(!this.ourGame.gameFinished){
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'up', this.mapPosition, 3);
                    LevelFunctionsUpgraded.visualizePlayerCount(this.tiles.tilesList, this.figureImages, this);
                    this.ourGame.movesLeft--;
                    LevelFunctionsUpgraded.checkMovesLeft(this, this.ourGame);
                }

        });
    }


    update(): void {
        this.tiles.animatedTiles.forEach(tile => tile.update(14));
    }
}
