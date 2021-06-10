// Class for each tile. There will be 13 * 7 tiles in total with each of them having
import { Figure } from "./figure"
import { TileParser } from "./tileParser";

export class TilePiece{
    public tileCoordinates: number[] = []; // x, y in Pixel
    public tileType: boolean[] = []; // wall action goal
    public splitField: boolean; 
    public splitDirection: number; // 0 Norden, 1 Osten, 2 Sueden, 3 Westen
    public splitPercentage: number;
    public text;
    public directionProbabilities;

    // this is where the players on top of a tile are stored, 
    // it should be a list of objects, when the piglet class is created
    public playersOnTop = 0;

    constructor(coordinates: number[], tileType: boolean[]) {
        this.tileCoordinates = coordinates;
        this.tileType = tileType;
        this.splitField = false;
        this.splitPercentage = 0;
    }

    // can be accessed with dot notation
    public get getPlayersOnTop(): number {
        return this.playersOnTop;
    }

    /*(public toString = (): string => {
        return `Tile pos (${this.tileCoordinates[0]/Figure.STEP_SIZE}, ${this.tileCoordinates[1]/Figure.STEP_SIZE}), prob.: [${this.directionProbabilities[0]}, ${this.directionProbabilities[1]}, ${this.directionProbabilities[2]}, ${this.directionProbabilities[3]}, ${this.directionProbabilities[4]}]`;
    }

    
     * Sets the TileProbabilities for the given TilePiece
     * If it has no Probability or Something went wrong -> -1
     * 
     * !!!!!! not yet tested
     * 
     * @param layerProbability input the Probability-Layer from the Level
     *
    public setTileProbability(layerProbability: Phaser.Tilemaps.TilemapLayer): void { //TODO Repair function
        const x = this.tileCoordinates[0] / Figure.STEP_SIZE;
        const y = this.tileCoordinates[1] / Figure.STEP_SIZE;

       
        
        if (x !== null && y !== null ) { //no walkable Tile is on the Edge

            if (layerProbability.layer.data[y][x].index == -1) { //not walkable
                this.directionProbabilities[0] = 0;
                this.directionProbabilities[1] = 0;
                this.directionProbabilities[2] = 0;
                this.directionProbabilities[3] = 0;
                this.directionProbabilities[4] = 100;
            } else { //walkable
                
                this.toString;
                let tile_up = null;
                let tile_right = null;
                let tile_down = null;
                let tile_left = null;

                
                tile_up = layerProbability.layer.data[y - 1][x].index;
                tile_right = layerProbability.layer.data[y][x + 1].index;
                tile_down = layerProbability.layer.data[y + 1][x].index;
                tile_left = layerProbability.layer.data[y][x - 1].index;

                this.directionProbabilities[0] = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_up);    // up neighbour tile
                this.directionProbabilities[1] = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_right); // right neighbour tile
                this.directionProbabilities[2] = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_down);  // down neighbour tile
                this.directionProbabilities[3] = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_left);  // left neighbour tile

                this.directionProbabilities[4] = 92; // set follow queen to 92%

            }
        }
        
    }
*/
}
