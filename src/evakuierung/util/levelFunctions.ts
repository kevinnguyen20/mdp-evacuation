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

    public static getStartPostition(layerGround: Phaser.Tilemaps.Tilemap): [number, number] {
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

    // Please don't use the term "split". Instead, use followQueen or disobeyQueen :)
    // kevinnguyen changed this method radically (runtime optimized)
    /**
     * Determines the direction (if we disobey the queen) given the probabilities for each direction
     * 
     * @param tile the tile we're currently on 
     * @returns the direction - 0 (up), 1 (right), 2 (down), 3 (left)
     */

    public static generateDirection(tile: TilePiece): number {
        const random: number = Math.random();
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
        const randomNum: number = Math.random();
        if (randomNum < tile[4]){
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

    public static queenValidMoveCheck(xory: boolean, pos: number, layer: Phaser.Tilemaps.Tilemap, queen: Figure): boolean {
        let tile: Phaser.Tilemaps.Tile = null;
        tile = xory ? tile = layer.getTileAtWorldXY(queen.image.x, queen.image.y + pos, true) :
            tile = layer.getTileAtWorldXY(queen.image.x + pos, queen.image.y, true);

        return TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID ?
            false : true;   // false means blocked, freeze
    }

}
