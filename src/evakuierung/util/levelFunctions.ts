import { Player } from "./player";
import { TileParser } from "./tileParser";
import { TilePiece } from "./tilePiece";

export class LevelFunctions {

    /**
     * @param playercount number of Players in the level
     * @param startpunkt coordinates of the startpunkt of the level, startpunkt [0] = x, startpunkt [1] = y
     * @returns list which contains each playerFigure
     */
    public static initFigureList(playercount: number, startpunkt: number[]): Player[] {
        const playerList: Player[] = [];
        playerList.push(new Player(startpunkt[0], startpunkt[1], true)); //creates queen
        for (let i = 0; i < playercount - 1; i++) {
            playerList.push(new Player(startpunkt[0], startpunkt[1], false)); //creates pawns
        }
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
            if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) == TileParser.START_ID) {
                X = tile.pixelX;
                Y = tile.pixelY;
            }
        })
        return [X, Y];
    }


    /**
     * Determines the direction of the next split given the probabilities for each direction
     * 
     * @param currentTile the tile we're currently on 
     * @returns the direction of the split that occurs
     *          when leaving the tile - 0 (up), 1 (right), 2 (down), 3 (left)
     *           W(0)
     *      A(3) S(2) D(1)
     */
     public static generateDirection(currentTile: TilePiece): number {
        const random: number = Math.random();     // returns a random num between 0 and 1
        if (random >= 0 &&
            random < currentTile.upProbability) {
            return 0;   // up
        } else if (random >= currentTile.upProbability &&
            random < currentTile.upProbability + currentTile.downProbability) {
            return 2;   // down
        } else if (random >= currentTile.upProbability + currentTile.downProbability &&
            random < currentTile.upProbability + currentTile.downProbability + currentTile.leftProbability) {
            return 3;   // left
        } else if (random >= currentTile.upProbability + currentTile.downProbability + currentTile.leftProbability &&
            random < 1) {
            return 1;   // right
        }
        return -1;
    }


    /**
     * Checks if the queen moves in a valid direction
     * 
     * @param xory true when moving on the y axis (up/down), false if moving on the x axis (left/right)
     * @param pos always has the value +32 or -32, because the tiles are 32x32
     * @param layer the layer we're operating on
     * @returns true if the move is valid, false if not
     */
     public static queenValidMoveCheck(xory: boolean, pos: number, layer: Phaser.Tilemaps.Tilemap, queen: Player): boolean {
        console.log("check move");
        let tile: Phaser.Tilemaps.Tile = null;
        console.log(queen);
        if (xory === false)
            tile = layer.getTileAtWorldXY(queen.x + pos, queen.y, true);
        else
            tile = layer.getTileAtWorldXY(queen.x, queen.y + pos, true);
            console.log("else");

        console.log("Tile: " + tile.index);
        if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID){
            console.log("wall");
            return false; //blocked, can't move, do nothing
        } else
            return true;
    }

}