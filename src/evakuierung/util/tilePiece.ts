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
    public figureImages: Phaser.GameObjects.Image [] = [];
    public punishment; // true, wenn Bestrafungsfeld

    // this is where the players on top of a tile are stored, 
    // it should be a list of objects, when the piglet class is created
    public playersOnTopCounter = 0;
    public playerOnTopList: Figure[] = [];

    constructor(coordinates: number[], tileType: boolean[]) {
        this.tileCoordinates = coordinates;
        this.tileType = tileType;
        this.splitField = false;
        this.splitPercentage = 0;
    }

}
