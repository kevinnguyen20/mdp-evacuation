// Class for each tile. There will be 13 * 7 tiles in total with each of them having
// their probabilities (for each direction) hard coded.
import { Player } from "../util/player"
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
}