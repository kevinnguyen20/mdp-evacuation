import { Player } from "./player";
import { TileParser } from "./tileParser";

export class LevelFunctions{

    /**
     * @param playercount number of Players in the level
     * @param startpunkt coordinates of the startpunkt of the level, startpunkt [0] = x, startpunkt [1] = y
     * @returns list which contains each playerFigure
     */
    public static initFigureList(playercount: number, startpunkt: number[]): Player[]{
        const playerList: Player[] = [];
        playerList.push (new Player(startpunkt[0], startpunkt[1], true)); //creates queen
        for (let i = 0; i < playercount-1; i++){
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
            if(TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) == TileParser.START_ID){
                X = tile.pixelX;
                Y = tile.pixelY;
            }
        })
        return [X, Y];
    }




}