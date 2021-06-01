import { Tilemaps } from "phaser";
import { Figure } from "./figure";
import { TileParser } from "./tileParser";
import { TilePiece } from "./tilePiece";

export class LevelFunctions {

    /**
     * @param figure number of Players in the level
     * @param spawnPoint level coordinates of the spawnPoint, spawnPoint[0] = x, spawnPoint[1] = y
     * @returns list which contains each playerFigure
     */

    public static initFigureList(figure: number, spawnPoint: number[]): Figure[] {
        const playerList: Figure[] = [];

        playerList.push(new Figure(spawnPoint[0], spawnPoint[1], true)); //creates queen

        for (let i=0; i<figure-1; i++)
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
            if(TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.START_ID) {
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
    public static getGoalTile(tileList: TilePiece[]): TilePiece{
        let goal = null;
        tileList.forEach((tile) => {
            if (tile.tileType[2] === true){
                goal = tile;
            }
        })
        return goal;
    }

    /**
     * This function removes the Figures that reached the goal out of the figureList Array, so they won't move anymore
     * when they reach the goal
     * @param figureList our figureList
     * @param goalTile ourGoalTile
     */
    public static chainCharacters (figureList: Figure[], goalTile: TilePiece){
        const arr = [];
        let x = 0;
        figureList.forEach((element) => {
            if (element.x === goalTile.tileCoordinates[0] && element.y === goalTile.tileCoordinates[1]){
                arr.push(x);
            }
            x++;
        })
        let tmp = 0;
        arr.forEach((element) => {
            figureList.splice(element-tmp, 1);
            tmp++;
        })
    }
    // Please don't use the term "split". Instead, use followQueen or disobeyQueen :)
    // kevinnguyen changed this method radically (runtime optimized)
    /**
     * Determines the direction (if we disobey the queen) given the probabilities for each direction
     * 
     * @param tile the tile we're currently on 
     * @returns the direction - 0 (up), 1 (right), 2 (down), 3 (left)
     */

    public static generateDirection(tile: TilePiece): number {
        const random: number = Math.random()*100;
        if(random < tile.directionProbabilities[0])
            return 0;   // up

        else if(random < tile.directionProbabilities[0] + tile.directionProbabilities[1])
            return 1;   // right

        else if(random < tile.directionProbabilities[0] + tile.directionProbabilities[1] 
                        + tile.directionProbabilities[2]) 
            return 2;   // down

        else
            return 3;   // left
    }

    /**
     * Decides if a player should follow the queen
     * @returns True if the player shold go with the queen or else false
     */
    public static followQueen(tile: TilePiece):boolean {
        const randomNum: number = Math.random()*100;
        if (randomNum < tile.directionProbabilities[4]){
            return true;
        }
        else return false;
    }

    /**
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     * @param layer the layer we're operating on
     * @returns valid/invalid move
     */

    public static queenValidMoveCheck(xory: boolean, pos: number, layer: Phaser.Tilemaps.TilemapLayer, queen: Figure): boolean {
        let tile: Phaser.Tilemaps.Tile = null;
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
    public static updatePlayerCountText (tileList: TilePiece[]) : void {
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


    /**
     * Initializes all the text objects for the playercount on each Tile
     * 
     * @param tilesList 
     * @param add set to this.add
     */
    public static createPlayerCountText(tilesList: TilePiece[], add: Phaser.GameObjects.GameObjectFactory) : void{
        tilesList.forEach((element) => {
            element.text = add.text (element.tileCoordinates[0]+38, element.tileCoordinates[1]+104, ''+element.playersOnTop, {color: '#ffffff'} ).setDepth(5);
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
    public static setupLayer(tileset: Tilemaps.Tileset, x: number, y: number, map: Tilemaps.Tilemap, 
        layerGround: Tilemaps.TilemapLayer, layerProbability: Tilemaps.TilemapLayer,layerAction: Tilemaps.TilemapLayer,layerDesign: Tilemaps.TilemapLayer, layerPerspective: Tilemaps.TilemapLayer,): 
        [Tilemaps.TilemapLayer, Tilemaps.TilemapLayer, Tilemaps.TilemapLayer, Tilemaps.TilemapLayer, Tilemaps.TilemapLayer]{
        layerGround = map.createLayer(
            'Ground',       // layerID
            tileset,        // tileset
            x,        // x
            y         // y
        );

        layerProbability = map.createLayer(   // there is no need to read this layer ever, only create it
            'Probability',  // layerID
            tileset,        // tileset
            x,        // x
            y,        // y

        );
        layerProbability.setVisible(false);    // set true if you want to see the probabilities

        layerAction = map.createLayer(
            'Action',       // layerID
            tileset,        // tileset
            x,        // x
            y         // y
        );

        layerDesign = map.createLayer(
            'Design',       // layerID
            tileset,        // tileset
            x,        // x
            y         // y
        );

        layerPerspective = map.createLayer(
            'Perspective',  // layerID
            tileset,        // tileset
            x,        // x
            y         // y
        );

        layerGround.setDepth(0);
        layerProbability.setDepth(1);
        layerAction.setDepth(2);
        layerDesign.setDepth(3);
        layerPerspective.setDepth(20);

        return [layerGround, layerProbability, layerAction, layerDesign, layerPerspective];

    }

}
