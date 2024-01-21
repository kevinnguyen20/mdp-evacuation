import { TileParser } from "../util/tileParser";
import { Figure } from "../util/figure"

import { Figures, LevelFunctionsUpgraded, MapPosition, OurGame, OurMap, Tiles } from "../util/LevelFunctionsUpgraded";
import { RestartButton } from "../util/RestartButton";
import { OurMovement } from "../util/OurMovement";

export class level1 extends Phaser.Scene {
    private ourGame!: OurGame;
    private mapPosition!: MapPosition;
    private tiles!: Tiles;
    private figures!: Figures;
    private ourMap!: OurMap;

    private score = 0;
    private winCondition = 8;
    private figureImages: Phaser.Textures.Texture[] = [];
    private movesLeft = 40; // this should be changed if it's changed in RestartButton.ts
    private splitFieldsToVisit = 2; // this should be changed for balancing part
    private diff = 10; // represents the difficulty set by the Player 10 easy, 20 medium, 30 hard


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
        this.load.audio('theme1', './assets/sprites/synthwavehouse.mp3');
    }

    init(data: { diff: number; }): void {
        this.data.set('playerScore', 0);
        this.data.set('playerWinningScore', 8);
        this.diff = data.diff;
    }

    create(): void {
        this.game.sound.stopAll();
        this.input.keyboard.enabled = true;
        this.cameras.main.setZoom(1.2,1.2);

        this.figureImages.push(this.textures.get('alienGreen1'));
        this.figureImages.push(this.textures.get('alienGreen2'));
        this.figureImages.push(this.textures.get('alienGreen3'));
        this.figureImages.push(this.textures.get('alienGreen4'));
        this.figureImages.push(this.textures.get('alienPurple'));   
        this.figureImages.push(this.textures.get('alienBlue1'));
        this.figureImages.push(this.textures.get('alienBlue2'));
        
        // BACKGROUND MUSIC
        // LevelFunctionsUpgraded.addMusic(this);
        const backgroundMusic = this.sound.add('theme1');
        const musicConfig = {
            mute: false,
            volume: 0.14,
            rate: 1,
            detune: 0,
            loop: true,
            delay: 0
        }
        backgroundMusic.play(musicConfig);
        const soundButton = this.add.image(this.sys.game.config.width as number * 1 / 50 + 100, this.sys.game.config.height as number * 3.5 / 20 + 415,'soundOn').setInteractive();
        soundButton.on('pointerover', function(){soundButton.setScale(0.85, 0.85);});
        soundButton.on('pointerout', function(){soundButton.setScale(1, 1);});
        soundButton.on("pointerdown",()=>{
            if (soundButton.texture.key == 'soundOn') {
                soundButton.setTexture('soundOff');
                this.game.sound.stopAll();
            } else if (soundButton.texture.key == 'soundOff') {
                soundButton.setTexture('soundOn');
                backgroundMusic.play(musicConfig);
            }
        });

        // MAP
        this.mapPosition = {
            mapPosX: this.sys.game.config.width as number * 1/50,
            mapPosY: this.sys.game.config.height as number * 3.5/20
        };
        
        const tmpMap = this.make.tilemap({
            key: 'map',
            tileWidth: 32,
            tileHeight: 32
        });

        const tileset = tmpMap.addTilesetImage('scifi', 'tileset-scifi');
        this.ourMap = {
            map: tmpMap,
            layers: LevelFunctionsUpgraded.setupLayer(tileset, this.mapPosition, tmpMap)
        };

        // TILES
        const t1 = TileParser.tileTupleAPI(this.ourMap);
        const t2 = LevelFunctionsUpgraded.getGoalTile(t1);
        this.tiles = {
            tilesList: t1,
            queenFieldIndicator: undefined,
            goalTile: t2,
            animatedTiles: []
        };
        LevelFunctionsUpgraded.activateAnimations(tileset, this.ourMap.map, this.tiles.animatedTiles);

        // FIGURES
        const startingPosition: [number, number] = LevelFunctionsUpgraded.getStartPostition(this.ourMap.layers.layerGround);
        this.figures = {
            figureInitCount: this.diff,
            figureList: LevelFunctionsUpgraded.initFigureList(this.diff, startingPosition)
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
                'Coins: ' + this.score + '/3'
            ),
            movesLeft: this.movesLeft,
            movesLeftText: this.add.text(
                this.mapPosition.mapPosX + 280, 
                this.mapPosition.mapPosY - 40,  
                'Steps: ' + this.movesLeft
            ),
            splitFieldsToVisit: this.splitFieldsToVisit,
            queenPos: [startingPosition[0]/32, startingPosition[1]/32],
            gameFinished: false,
            survivorScoreText: this.add.text(
                this.mapPosition.mapPosX + 70, 
                this.mapPosition.mapPosY - 20,  
                'Win condition: ' + this.winCondition + ' aliens and ' + this.splitFieldsToVisit + ' split fields' 
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
            if(LevelFunctionsUpgraded.queenValidMoveCheck(false, -Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0])){
                if(!this.ourGame.gameFinished){
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'left', this.mapPosition, 2, this.diff);
                    LevelFunctionsUpgraded.groupOnBestrafungsFeld(this.tiles.tilesList, this.figures);
                    LevelFunctionsUpgraded.updatePlayerCountText(this.tiles.tilesList);
                    LevelFunctionsUpgraded.visualizePlayerCount(this.tiles.tilesList, this.figureImages, this);
                    this.ourGame.movesLeft--;
                    LevelFunctionsUpgraded.checkMovesLeft(this, this.ourGame);
                    LevelFunctionsUpgraded.queenAliveCheck(this, this.ourGame, this.figures);
                }
            }
        });

        this.input.keyboard.on('keydown-D', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(false, Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0])){
                if(!this.ourGame.gameFinished){
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'right', this.mapPosition, 2, this.diff);
                    LevelFunctionsUpgraded.groupOnBestrafungsFeld(this.tiles.tilesList, this.figures);
                    LevelFunctionsUpgraded.updatePlayerCountText(this.tiles.tilesList);
                    LevelFunctionsUpgraded.visualizePlayerCount(this.tiles.tilesList, this.figureImages, this);
                    this.ourGame.movesLeft--;
                    LevelFunctionsUpgraded.checkMovesLeft(this, this.ourGame);
                    LevelFunctionsUpgraded.queenAliveCheck(this, this.ourGame, this.figures);
                }
            }
        });

        this.input.keyboard.on('keydown-S', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(true, Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0])){
                if(!this.ourGame.gameFinished){
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'down', this.mapPosition, 2, this.diff);
                    LevelFunctionsUpgraded.groupOnBestrafungsFeld(this.tiles.tilesList, this.figures);
                    LevelFunctionsUpgraded.updatePlayerCountText(this.tiles.tilesList);
                    LevelFunctionsUpgraded.visualizePlayerCount(this.tiles.tilesList, this.figureImages, this);
                    this.ourGame.movesLeft--;
                    LevelFunctionsUpgraded.checkMovesLeft(this, this.ourGame);
                    LevelFunctionsUpgraded.queenAliveCheck(this, this.ourGame, this.figures);
                }
            }
        });

        this.input.keyboard.on('keydown-W', () =>{
            if (LevelFunctionsUpgraded.queenValidMoveCheck(true, -Figure.STEP_SIZE, this.ourMap, this.figures.figureList[0])){
                if(!this.ourGame.gameFinished){
                    OurMovement.doMove(this.ourGame, this.figures, this.tiles, this.ourMap, this, 'up', this.mapPosition, 2, this.diff);
                    LevelFunctionsUpgraded.groupOnBestrafungsFeld(this.tiles.tilesList, this.figures);
                    LevelFunctionsUpgraded.updatePlayerCountText(this.tiles.tilesList);
                    LevelFunctionsUpgraded.visualizePlayerCount(this.tiles.tilesList, this.figureImages, this);
                    this.ourGame.movesLeft--;
                    LevelFunctionsUpgraded.checkMovesLeft(this, this.ourGame);
                    LevelFunctionsUpgraded.queenAliveCheck(this, this.ourGame, this.figures);
                }
            }
        });
    }


    update(): void {
        this.tiles.animatedTiles.forEach(tile => tile.update(11));
    }
}
