// Class for each tile. There will be 13 * 7 tiles in total with each of them having
// their probabilities (for each direction) hard coded.
import { Player } from "../util/player"
import { TileParser } from "./tileParser";
export class TilePiece{
    public x: number;
    public y: number;
    public upProbability: number;
    public downProbability: number;
    public leftProbability: number;
    public rightProbability: number;
    private _playersOnTop: Player[] = [];   // this is where the players on top of a tile are stored, it should be a list of objects, when the piglet class is created
    public wall: boolean; //is the Tile a Wall?
    public action: boolean; // is the Tile a actionField?
    public goal: boolean; // ist the Tile the goal?

    constructor(x: number, y: number, upProbability: number, downProbability: number, leftProbability: number, rightProbability: number, wall: boolean, action: boolean, goal: boolean ) {
        this.x = x;
        this.y = y;
        this.upProbability = upProbability;
        this.downProbability = downProbability;
        this.leftProbability = leftProbability;
        this.rightProbability = rightProbability;
        this.wall = wall;
        this.action = action;
        this.goal = goal;
    }

    // can be accessed with dot notation
    public get playersOnTop() {
        return this._playersOnTop;
    }

    /**
     * Sets the TileProbabilities for the given TilePiece
     * If it has no Probability or Something went wrong -> -1
     * 
     * !!!!!! not yet tested
     * 
     * @param tilePiece make sure that the Position for this TilePiece is already set
     * @param layer input the Probability-Layer from the Level
     */
    private setTileProbability (layer: Phaser.Tilemaps.Tilemap): void {
        if(this.x != null && this.y != null){
    
            const tile_right = layer.getTileAtWorldXY(this.x + TileParser.TILE_SIZE, this.y);
            const tile_left = layer.getTileAtWorldXY(this.x - TileParser.TILE_SIZE, this.y);
            const tile_up = layer.getTileAtWorldXY(this.x, this.y + TileParser.TILE_SIZE);
            const tile_down = layer.getTileAtWorldXY(this.x, this.y - TileParser.TILE_SIZE);

            let l = -1;
            let r = -1;
            let u = -1;
            let d = -1;

            if((r = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_right.index)) != -1){    // right neighbour tile
                this.rightProbability = r;
            } else {
                this.rightProbability = -1;
            }

            if((l = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_left.index)) != -1){    // left neighbour tile
                this.leftProbability = l;
            } else {
                this.leftProbability = -1;
            }

            if((u = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_up.index)) != -1){    // up neighbour tile
                this.upProbability = u;
            } else {
                this.upProbability = -1;
            }

            if((d = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_down.index)) != -1){    // down neighbour tile
                this.downProbability = d;
            } else {
                this.downProbability = -1;
            }
        }
    }
    
}