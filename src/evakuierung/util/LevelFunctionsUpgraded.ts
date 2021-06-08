import { Tilemaps } from "phaser";
import { TilesetTileData } from "./animatedTile";
import { Figure } from "./figure";
import { TileParser } from "./tileParser";
import { TilePiece } from "./tilePiece";
import { AnimatedTile } from "../util/animatedTile";

type Layers = {
    layerGround: Phaser.Tilemaps.TilemapLayer;
    layerProbability: Phaser.Tilemaps.TilemapLayer;
    layerAction: Phaser.Tilemaps.TilemapLayer;
    layerDesign: Phaser.Tilemaps.TilemapLayer;
    layerPerspective: Phaser.Tilemaps.TilemapLayer;
};

type OurMap = {
    map: Phaser.Tilemaps.Tilemap;
    layers: Layers;
};

type MapPosition = {
    mapPosX: number;
    mapPosY: number;
};

type Figures = {
    figureInitCount: number;
    figureList: Figure[];
};

type Tiles = {
    tilesList: TilePiece[];
    fieldColor: Phaser.GameObjects.Image;
    goalTile: TilePiece;
    animatedTiles: AnimatedTile[];
};

type OurGame = {
    score: number;
    scoreText: Phaser.GameObjects.Text;
    queenPos: number[];
    gameFinished: boolean;
    preMovePos: number[];
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
        let goal = null;
        tileList.forEach((tile) => {
            if (tile.tileType[2] === true) {
                goal = tile;
            }
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
    public static winConditionReachedCheck(ourGame: OurGame, tiles: Tiles, scene: Phaser.Scene, nextLevel: number): void {
        const gameFinished = ourGame.gameFinished;
        const condition = ourGame.winCond;
        const survivorScoreText = ourGame.survivorScoreText;
        const survivorScore = tiles.goalTile.playersOnTop;

        if (gameFinished) {
            if (survivorScore >= condition) {
                survivorScoreText.setText("Congrats level passed with " + survivorScore + " aliens!")
                const nextLevelButton = scene.add.image(scene.sys.game.config.width as number / 2, scene.sys.game.config.height as number / 2, 'nextLevelButton');
                nextLevelButton.depth = 100;    // brings the button to the front
                nextLevelButton.setInteractive();
                nextLevelButton.on('pointerup', () => {
                    scene.scene.transition({
                        target: "level" + nextLevel,
                        duration: 10
                    })
                });
                nextLevelButton.on('pointerover', function () { nextLevelButton.setScale(0.85, 0.85) });
                nextLevelButton.on('pointerout', function () { nextLevelButton.setScale(1, 1) });
            }
            else {
                survivorScoreText.setText("Not enough aliens have reached the goal! " + survivorScore + " < " + condition + "\nRestart and keep on trying!");
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
            scene.scene.transition({
                target: "MainMenu",
                allowInput: true,
                duration: 10
            })
        });
        returnMainMenuButton.on('pointerover', function () { returnMainMenuButton.setScale(0.85, 0.85) });
        returnMainMenuButton.on('pointerout', function () { returnMainMenuButton.setScale(1, 1) });
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

        const arr = [];
        let x = 0;
        figList.forEach((element) => {
            if (element.x === goal.tileCoordinates[0] && element.y === goal.tileCoordinates[1]) {
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
        let tile: Phaser.Tilemaps.Tile = null;
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
                if (element.playersOnTop === 0) {
                    element.text.setText('' + element.playersOnTop);
                    element.text.setVisible(false);
                }
                else {
                    element.text.setText('' + element.playersOnTop);
                }
            }
            else if (element.text.visible === false && element.playersOnTop > 0) {
                element.text.setText('' + element.playersOnTop);
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
            element.text = add.text(element.tileCoordinates[0] + 38, element.tileCoordinates[1] + 104, '' + element.playersOnTop, { color: '#ffffff' }).setDepth(5);
            if (element.playersOnTop === 0)
                element.text.setVisible(false);
        });
    }


    /**
     * load the Layers according to the structure in Tiled
     * @param tileset 
     * @param x layer Postition X
     * @param y layer Position Y
     * @param map the map we create the layers on
     * @param layerGround 
     * @param layerProbability 
     * @param layerAction 
     * @param layerDesign 
     * @param layerPerspective 
     * @returns returns layers in the input order
     */
    public static setupLayer(tileset: Tilemaps.Tileset, coordinates: MapPosition, tmpMap: Phaser.Tilemaps.Tilemap): Layers{
        const x = coordinates.mapPosX;
        const y = coordinates.mapPosY;
        
        const tmplayerGround = tmpMap.createLayer(
            'Ground',
            tileset,
            x,
            y
        );

        const tmplayerProbability = tmpMap.createLayer(
            'Split',
            tileset,
            x,
            y

        );
        tmplayerProbability.setVisible(false);    // set true if you want to see the probabilities

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

        tmplayerGround.setDepth(0);
        tmplayerProbability.setDepth(1);
        tmplayerAction.setDepth(2);
        tmplayerDesign.setDepth(3);
        tmplayerPerspective.setDepth(20);

        const layers: Layers = {
            layerGround: tmplayerGround,
            layerProbability: tmplayerProbability,
            layerDesign: tmplayerDesign,
            layerAction: tmplayerAction,
            layerPerspective: tmplayerPerspective
        }

        return layers;
    }


    public static activateAnimations(tileset: Tilemaps.Tileset, map: Tilemaps.Tilemap, animatedTiles: AnimatedTile[]): void {
        const tileData = tileset.tileData as TilesetTileData;
        for (const tileid in tileData) {
            map.getLayer("Action").data.forEach(tileRow => {
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
