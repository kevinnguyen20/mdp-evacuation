// Class for each tile. There will be 13 * 7 tiles in total with each of them having
import { Figure } from "./figure"

export class TilePiece{
    public tileCoordinates: number[] = []; // x, y in Pixel
    public tileType: boolean[] = []; // wall action goal
    public splitField: boolean; 
    public splitDirection!: number; // 0 Norden, 1 Osten, 2 Sueden, 3 Westen
    public splitPercentage: number;
    public text!: Phaser.GameObjects.Text;
    public directionProbabilities: unknown;
    public figureImages: Phaser.GameObjects.Image [] = [];
    public punishment = false; // true, wenn Bestrafungsfeld
    public fragezeichen = false; // true, wenn Fragezeichen

    public playersOnTopCounter = 0;
    public playerOnTopList: Figure[] = [];

    constructor(coordinates: number[], tileType: boolean[]) {
        this.tileCoordinates = coordinates;
        this.tileType = tileType;
        this.splitField = false;
        this.splitPercentage = 0;
    }

}
