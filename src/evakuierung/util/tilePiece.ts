// Class for each tile. There will be 13 * 7 tiles in total with each of them having
import { Figure } from "./figure"
import { TileParser } from "./tileParser";

export class TilePiece{
    public tileCoordinates: number[] = [];
    public directionProbabilities: number[] = []; // up right down left
    public tileType: boolean[] = []; // wall action goal

    // this is where the players on top of a tile are stored, 
    // it should be a list of objects, when the piglet class is created
    private _playersOnTop: Figure[] = [];

    constructor(coordinates: number[], directionProbabilities: number[], tileType: boolean[]) {
        this.tileCoordinates = coordinates;
        this.directionProbabilities = directionProbabilities;
        this.tileType = tileType;
    }

    public get playersOnTop(): Figure[] {
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
        const x = this.tileCoordinates[0];
        const y = this.tileCoordinates[1];
        if(x !== null && y !== null){
    
            const tile_up = layer.getTileAtWorldXY(x, y + Figure.STEP_SIZE);
            const tile_right = layer.getTileAtWorldXY(x + Figure.STEP_SIZE, y);
            const tile_down = layer.getTileAtWorldXY(x, y - Figure.STEP_SIZE);
            const tile_left = layer.getTileAtWorldXY(x - Figure.STEP_SIZE, y);

            let u = -1;
            let r = -1;
            let d = -1;
            let l = -1;

            // up neighbour tile
            u = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_up.index);
            this.directionProbabilities[0] = u !== -1 ? u : -1;

            // right neighbour tile
            r = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_right.index);
            this.directionProbabilities[1] = r !== -1 ? r : -1;

            // down neighbour tile
            d = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_down.index);
            this.directionProbabilities[2] = d !== -1 ? d : -1;

            // left neighbour tile
            l = TileParser.tileIDToAPIID_scifiLVL_Probability(tile_left.index);
            this.directionProbabilities[3] = l !== -1 ? l : -1;
        }
    }
    
}
