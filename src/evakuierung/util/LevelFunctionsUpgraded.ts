import { Scene, Tilemaps } from "phaser";
import { TilesetTileData } from "./animatedTile";
import { Figure } from "./figure";
import { TileParser } from "./tileParser";
import { TilePiece } from "./tilePiece";
import { AnimatedTile } from "../util/animatedTile";

export type TileSet = {
    tile: Phaser.Tilemaps.Tile,
    tileAction: Phaser.Tilemaps.Tile,
    tilePr: Phaser.Tilemaps.Tile,
    tileFr: Phaser.Tilemaps.Tile
};
export type Meta = {
    coordinates: boolean,
    pos: number
};
export type Wrapper = {
    ourMap: OurMap,
    tiles: Tiles,
    scene: Phaser.Scene,
    ourGame: OurGame,
    mapPosition: MapPosition,
    figures: Figure[]
};
export type Layers = {
    layerGround: Phaser.Tilemaps.TilemapLayer;
    layerSplit: Phaser.Tilemaps.TilemapLayer;
    layerAction: Phaser.Tilemaps.TilemapLayer;
    layerDesign: Phaser.Tilemaps.TilemapLayer;
    layerPerspective: Phaser.Tilemaps.TilemapLayer;
    layerDirection: Phaser.Tilemaps.TilemapLayer;
    layerPercentage: Phaser.Tilemaps.TilemapLayer;
    layerPunishment: Phaser.Tilemaps.TilemapLayer;
    layerFragezeichen: Phaser.Tilemaps.TilemapLayer;
};
export type OurMap = {
    map: Phaser.Tilemaps.Tilemap;
    layers: Layers;
};
export type MapPosition = {
    mapPosX: number;
    mapPosY: number;
};
export type Figures = {
    figureInitCount: number;
    figureList: Figure[];
};
export type Tiles = {
    tilesList: TilePiece[];
    queenFieldIndicator?: Phaser.GameObjects.Image;
    goalTile: TilePiece;
    animatedTiles: AnimatedTile[];
};
export type OurGame = {
    score: number;
    scoreText: Phaser.GameObjects.Text;
    movesLeft: number,
    movesLeftText: Phaser.GameObjects.Text;
    splitFieldsToVisit: number,
    queenPos: number[];
    gameFinished: boolean;
    survivorScoreText: Phaser.GameObjects.Text;
    winCond: number;
};

export class LevelFunctionsUpgraded {

    /**
     * @param figure number of Players in the level
     * @param spawnPoint level coordinates of the spawnPoint, spawnPoint[0] = x, spawnPoint[1] = y
     * @returns list which contains each playerFigure
     */
    public static initFigureList(figure: number, spawnPoint: number[]): Figure[] {
        const playerList: Figure[] = [];

        playerList.push(new Figure(spawnPoint[0], spawnPoint[1], true)); //creates queen

        for (let i = 0; i < figure - 1; i++)
            playerList.push(new Figure(spawnPoint[0], spawnPoint[1], false)); //creates subjects

        return playerList;
    }

    /**
     * Reads through the Tiles of the Ground-Layer and gets the Position from the starting Tile
     * @param layerGround inout the Ground-Layer
     * @returns Tupel [X, Y] and null if not Start was found
     */
    public static getStartPostition(layerGround: Phaser.Tilemaps.TilemapLayer): [number, number] {
        let X = 0;
        let Y = 0;

        layerGround.forEachTile((tile) => {
            if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.START_ID) {
                X = tile.pixelX;
                Y = tile.pixelY;
            }
        })
        return [X, Y];
    }
    /**
     * @param tileList our tileList consisting of our API
     * @returns the goal Tile
     */
    public static getGoalTile(tileList: TilePiece[]): TilePiece {
        let goal!: TilePiece;
        tileList.forEach((tile) => {
            if (tile.tileType[2] === true)
                goal = tile;
        })
        return goal;
    }

    /**
     * @param gameFinished bool if game is in a finished state
     * @param survivorScoreText 
     * @param survivorScore aliens that reached the goal
     * @param condition amount of aliens that have to reach the goal to proceed to the next level
     * @param scene the scene (level) you're currently in
     * @param nextLevel the level you're transitioning to
     */
    public static winConditionReachedCheck(ourGame: OurGame, tiles: Tiles, scene: Phaser.Scene, nextLevel: number, diff: number): void {
        const gameFinished = ourGame.gameFinished;
        const condition = ourGame.winCond;
        const survivorScoreText = ourGame.survivorScoreText;
        const survivorScore = tiles.goalTile.playersOnTopCounter;
        const splitFieldsVisited = ourGame.splitFieldsToVisit;

        if (gameFinished) {
            if (survivorScore >= condition && splitFieldsVisited <= 0) {
                scene.game.sound.stopAll();
                const victory = scene.sound.add('victory');
                const musicConfig = {
                    mute: false,
                    volume: 0.1,
                    rate: 1,
                    detune: 0,
                    loop: false,
                    delay: 0
                }
                victory.play(musicConfig);
                survivorScoreText.setText("Congrats level passed with " + survivorScore + " aliens!")
                const nextLevelButton = scene.add.image(scene.sys.game.config.width as number / 2, scene.sys.game.config.height as number / 2, 'nextLevelButton');
                nextLevelButton.depth = 100;    // brings the button to the front
                nextLevelButton.setInteractive();
                nextLevelButton.on('pointerup', () => {
                    /*scene.scene.transition({
                        target: "level" + nextLevel,
                        duration: 10
                    })*/
                    scene.scene.start("level" +nextLevel, {diff: diff})
                });
                nextLevelButton.on('pointerover', function () { nextLevelButton.setScale(0.85, 0.85) });
                nextLevelButton.on('pointerout', function () { nextLevelButton.setScale(1, 1) });
            }
            else {
                scene.game.sound.stopAll();
                const gameOver = scene.sound.add('gameOver');
                const musicConfig = {
                    mute: false,
                    volume: 0.14,
                    rate: 1,
                    detune: 0,
                    loop: false,
                    delay: 0
                }
                gameOver.play(musicConfig);
                if(splitFieldsVisited > 0 && survivorScore < condition){
                    survivorScoreText.setText("Both win conditions did not pass!");
                }
                else if(splitFieldsVisited > 0){
                    survivorScoreText.setText("Not enough split fields were visited!");   
                }
                else{
                    survivorScoreText.setText("Not enough aliens have reached the goal! " + survivorScore + " < " + condition + "\nRestart and keep on trying!");
                }
            }
        }
    }

    /**
     * Adds the return button to the lower right corner
     * 
     * @param scene the scene (level) you're currently in
     */
    public static addReturnButton(scene: Phaser.Scene): void {
        const returnMainMenuButton = scene.add.image(scene.sys.game.config.width as number * 1 / 50 + 610, scene.sys.game.config.height as number * 3.5 / 20 + 415, 'returnMainMenuButton');
        returnMainMenuButton.setInteractive();
        returnMainMenuButton.on('pointerup', () => {
            scene.game.sound.stopAll();
            scene.scene.transition({
                target: "MainMenu",
                allowInput: true,
                duration: 10
            })
        });
        returnMainMenuButton.on('pointerover', function (){returnMainMenuButton.setScale(0.85, 0.85) });
        returnMainMenuButton.on('pointerout', function (){returnMainMenuButton.setScale(1, 1) });
    }

    /**
     * Adds background music and a sound on/off button to the lower left corner
     * 
     * @param scene the scene (level) you're currently in
     */
    public static addMusic(scene: Phaser.Scene): void {
        const backgroundMusic = scene.sound.add('berghain');
        const musicConfig = {
            mute: false,
            volume: 0.14,
            rate: 1,
            detune: 0,
            loop: true,
            delay: 0
        }
        backgroundMusic.play(musicConfig);
        const soundButton = scene.add.image(scene.sys.game.config.width as number * 1 / 50 + 100, scene.sys.game.config.height as number * 3.5 / 20 + 415,'soundOn').setInteractive();
        soundButton.on('pointerover', function(){soundButton.setScale(0.85, 0.85);});
        soundButton.on('pointerout', function(){soundButton.setScale(1, 1);});
        soundButton.on("pointerdown",()=>{
            if (soundButton.texture.key == 'soundOn') {
                soundButton.setTexture('soundOff');
                scene.game.sound.stopAll();
            } else if (soundButton.texture.key == 'soundOff') {
                soundButton.setTexture('soundOn');
                backgroundMusic.play(musicConfig);
            }
        });
    }

    /**
     * This function removes the Figures that reached the goal out of the figureList Array, so they won't move anymore
     * when they reach the goal
     * @param figureList our figureList
     * @param goalTile ourGoalTile
     */
    public static chainCharacters(fig: Figures, tiles: Tiles): void {
        const figList = fig.figureList;
        const goal = tiles.goalTile;

        const arr: number[] = [];
        let x = 0;
        figList.forEach((element) => {
            if (element.x === goal.tileCoordinates[0] && element.y === goal.tileCoordinates[1] && !element.isQueen) {
                arr.push(x);
            }
            x++;
        })
        let tmp = 0;
        arr.forEach((element) => {
            figList.splice(element - tmp, 1);
            tmp++;
        })
    }

    /**
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     * @param layer the layer we're operating on
     * @returns valid/invalid move
     */
    public static queenValidMoveCheck(xory: boolean, pos: number, map: OurMap, queen: Figure): boolean {
        let tile!: Phaser.Tilemaps.Tile;
        const layer = map.layers.layerGround;

        tile = xory ? tile = layer.getTileAtWorldXY(queen.image.x, queen.image.y + pos, true) :
            tile = layer.getTileAtWorldXY(queen.image.x + pos, queen.image.y, true);

        return TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID ?
            false : true;   // false means blocked, freeze
    }


    /**
     * Updates all the text objects for the playercount on each Tile 
     * !!! Should only be called after a Move has been processed !!!
     * 
     * @param tileList 
     */
    public static updatePlayerCountText(tileList: TilePiece[]): void {
        tileList.forEach((element) => {
            if (element.text.visible === true) {
                if (element.playersOnTopCounter === 0) {
                    element.text.setText('' + element.playersOnTopCounter);
                    element.text.setVisible(false);
                }
                else {
                    element.text.setText('' + element.playersOnTopCounter);
                }
            }
            else if (element.text.visible === false && element.playersOnTopCounter > 0) {
                element.text.setText('' + element.playersOnTopCounter);
                element.text.setVisible(true);
            }
        })
    }


    /**
     * Initializes all the text objects for the playercount on each Tile
     * 
     * @param tilesList 
     * @param add set to this.add
     */
    public static createPlayerCountText(tilesList: TilePiece[], add: Phaser.GameObjects.GameObjectFactory): void {
        tilesList.forEach((element) => {
            element.text = add.text(element.tileCoordinates[0] + 38, element.tileCoordinates[1] + 104, '' + element.playersOnTopCounter, { color: '#ffffff' }).setDepth(5);
            if (element.playersOnTopCounter === 0)
                element.text.setVisible(false);
        });
    }

    public static setupLayer(tileset: Tilemaps.Tileset | null, coordinates: MapPosition, tmpMap: Phaser.Tilemaps.Tilemap): Layers {
        const x = coordinates.mapPosX;
        const y = coordinates.mapPosY;

        if (!tileset) {
            return {
                layerAction: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                layerDesign: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                layerDirection: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                layerFragezeichen: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                layerGround: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                layerPercentage: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                layerPerspective: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                layerPunishment: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                layerSplit: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, "")

            }
        } else {        
            const tmplayerGround = tmpMap.createLayer(
                'Ground',
                tileset,
                x,
                y
            );

            const tmplayerFragezeichen = tmpMap.createLayer(
                'Fragezeichen',
                tileset,
                x,
                y
            );
            
            const tmpPunishment = tmpMap.createLayer (
                'Punishment',
                tileset,
                x,
                y
            )
            const tmplayerSplit = tmpMap.createLayer(
                'Split',
                tileset,
                x,
                y

            );

            const tmplayerAction = tmpMap.createLayer(
                'Action',
                tileset,
                x,
                y
            );

            const tmplayerDesign = tmpMap.createLayer(
                'Design',
                tileset,
                x,
                y
            );

            const tmplayerPerspective = tmpMap.createLayer(
                'Perspective',
                tileset,
                x,
                y
            );

            const tmplayerDirection = tmpMap.createLayer(
                'Direction',
                tileset,
                x,
                y
            )

            if (tmplayerDirection) {
                tmplayerDirection.setVisible(false);
            }
            
            const tmplayerPercentage = tmpMap.createLayer(
                'splitPercentage',
                tileset,
                x,
                y
            );
        
            if (tmplayerAction && tmplayerDesign && tmplayerDirection && tmplayerFragezeichen && tmplayerGround && tmplayerPercentage && tmplayerPerspective && tmplayerSplit && tmpPunishment) {
                tmplayerFragezeichen.setDepth(10);
                tmplayerGround.setDepth(0);
                tmplayerSplit.setDepth(3);
                tmplayerAction.setDepth(1);
                tmplayerDesign.setDepth(2);
                tmplayerPercentage.setDepth(4);
                tmplayerPerspective.setDepth(20);
            }

            // eslint-disable-next-line prefer-const
            /*
            let layers: Layers = {
                layerGround: tmplayerGround,
                layerProbability: tmplayerProbability,
                layerDesign: tmplayerDesign,
                layerAction: tmplayerAction,
                layerPerspective: tmplayerPerspective
            }*/

            if (tmplayerAction && tmplayerDesign && tmplayerDirection && tmplayerFragezeichen && tmplayerGround && tmplayerPercentage && tmplayerPerspective && tmplayerSplit && tmpPunishment) {
                return {
                    layerGround: tmplayerGround,
                    layerSplit: tmplayerSplit,
                    layerDesign: tmplayerDesign,
                    layerAction: tmplayerAction,
                    layerPerspective: tmplayerPerspective,
                    layerDirection: tmplayerDirection,
                    layerPercentage: tmplayerPercentage,
                    layerPunishment: tmpPunishment,
                    layerFragezeichen: tmplayerFragezeichen
                };
            } else {
                return {
                    layerAction: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                    layerDesign: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                    layerDirection: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                    layerFragezeichen: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                    layerGround: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                    layerPercentage: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                    layerPerspective: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                    layerPunishment: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, ""),
                    layerSplit: new Phaser.Tilemaps.TilemapLayer(new Scene, new Tilemaps.Tilemap(new Scene, new Tilemaps.MapData), 0, "")
    
                }
            }
        }
    }


    public static activateAnimations(tileset: Tilemaps.Tileset | null, map: Tilemaps.Tilemap, animatedTiles: AnimatedTile[]): void {
        if (!tileset) {
            return;
        }
        const tileData = tileset.tileData as TilesetTileData;
        for (const tileid in tileData) {
            const actionLayer = map.getLayer("Action");
            if (actionLayer) {
                // map.getLayer("Action").data.forEach(tileRow => {
                actionLayer.data.forEach(tileRow => {    
                    tileRow.forEach(tile => {
                        if (tile.index - tileset.firstgid === parseInt(tileid, 10)) {
                            animatedTiles.push(
                                new AnimatedTile(
                                    tile,
                                    tileData[tileid].animation,
                                    tileset.firstgid
                                )
                            );
                        }
                    });
                });
            }

            const punishmentLayer = map.getLayer("Punishment");
            if (punishmentLayer) {
                // map.getLayer("Punishment").data.forEach(tileRow => {
                punishmentLayer.data.forEach(tileRow => {
                    tileRow.forEach(tile => {
                        if (tile.index - tileset.firstgid === parseInt(tileid, 10)) {
                            animatedTiles.push(
                                new AnimatedTile(
                                    tile,
                                    tileData[tileid].animation,
                                    tileset.firstgid
                                )
                            );
                        }
                    });
                });
            }

        }
    }

    /**
     * initializes each PlayerSprite in a Position where they are visuably recognizable and countable for the player
     * @param tileList our Tileslist
     */
    public static visualizePlayerCount (tileList: TilePiece[], figurenImages: Phaser.Textures.Texture[], scene: Phaser.Scene): void {

        tileList.forEach((tile) => {
            while (tile.figureImages.length > 0){
                const image = tile.figureImages.pop();
                typeof image === "undefined" ? "" : image.destroy();
            }
            if (tile.playersOnTopCounter> 0){
                this.placeFigureSpritesOnTile(tile, figurenImages, scene);
            }
        })
    }

    /**
     * Places the PlayerSprites according to the nmbr of figures on the tile
     * @param tile the Tile we place the images on
     * @param figurenImages all our figure images
     * @param scene our levelscene
     */
    public static placeFigureSpritesOnTile (tile:TilePiece, figurenImages: Phaser.Textures.Texture[], scene: Phaser.Scene): void{
        let anzahlDerFiguren = tile.playersOnTopCounter;
        while (anzahlDerFiguren > 0) {
            if (anzahlDerFiguren >= 10) {
                let anzahl = 0;
                while(anzahlDerFiguren>=10){
                    tile.figureImages.push(scene.add.image(tile.tileCoordinates[0]+34+ (anzahl * - 8), tile.tileCoordinates[1]+120, figurenImages[6]));
                    anzahlDerFiguren -= 10;
                    anzahl++;
                } 
            }
            else if (anzahlDerFiguren >= 5 ){
                tile.figureImages.push(scene.add.image(tile.tileCoordinates[0]+32, tile.tileCoordinates[1]+120, figurenImages[4]));
                anzahlDerFiguren = anzahlDerFiguren - 5;
            }
            else {
                for(let blueCount = 0; anzahlDerFiguren>0; blueCount++){
                    tile.figureImages.push(scene.add.image(tile.tileCoordinates[0]+32, tile.tileCoordinates[1]+120, figurenImages[blueCount]));
                    anzahlDerFiguren--;
                }
            }
        }
        tile.figureImages.forEach((figures) => {
            figures.setDepth(4);
        })
    }

    /**
     * Checks if there are any moves left and if not the games stops. It also refreshes the left moves' counter. 
     * 
     * @param scene The scene we are working on
     * @param ourGame The game instance we use
     */
    public static checkMovesLeft(scene : Phaser.Scene, ourGame: OurGame) : void{
        if(ourGame.movesLeft == 0){
            if(!ourGame.gameFinished){
                scene.game.sound.stopAll();
                const gameOver = scene.sound.add('gameOver');
                const musicConfig = {
                    mute: false,
                    volume: 0.14,
                    rate: 1,
                    detune: 0,
                    loop: false,
                    delay: 0
                }
                gameOver.play(musicConfig);
                scene.input.disable;
                ourGame.gameFinished = true;
                ourGame.movesLeftText.setText('Steps: ' + ourGame.movesLeft);
                ourGame.survivorScoreText.setText('Oh no, you are out of moves. Try again!')
            }
        }
        else{
            ourGame.movesLeftText.setText('Steps: ' + ourGame.movesLeft);
        }
    }
    /**
     * Checks if a figure is on a Bestrafungsfeld if so this figure "dies"
     * @param tileList our tiles
     * @param fig our figures
     */
    public static groupOnBestrafungsFeld (tileList: TilePiece[], fig: Figures) :void {
        let index = 0;
        tileList.forEach((tile) => {
            if (tile.punishment && tile.playerOnTopList.length > 0){
                tile.playerOnTopList.forEach((figure) => {
                    index = 0;
                    fig.figureList.some((figToDel)=> {
                        if (figure === figToDel) {
                            fig.figureList.splice(index, 1);
                        }
                        index++;
                    })
                })
                tile.playerOnTopList = [];
                tile.playersOnTopCounter = 0;
            }
        })
    }

    public static queenAliveCheck (scene:Phaser.Scene, ourGame: OurGame, fig:Figures): void {
        let queenAlive = false;
        fig.figureList.forEach((figure) => {
            if (figure.isQueen) 
                queenAlive = true
        })

        if (!queenAlive) {
            if (scene.input.keyboard) {
                scene.input.keyboard.enabled = false;
            }
            const survivorScoreText = ourGame.survivorScoreText;
            scene.game.sound.stopAll();
            const gameOver = scene.sound.add('gameOver');
            const musicConfig = {
                mute: false,
                volume: 0.14,
                rate: 1,
                detune: 0,
                loop: false,
                delay: 0
            }
            gameOver.play(musicConfig);
            survivorScoreText.setText('Your Queen died! Try Again!')
        }
        
    }
}
