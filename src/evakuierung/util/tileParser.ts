import { OurMap } from "./LevelFunctionsUpgraded";
import { TilePiece } from "./tilePiece";

export class TileParser {
    // API Codes
    public static readonly WALL_ID = 9;
    public static readonly START_ID = 10;
    public static readonly STOP_ID = 11;
    // ----- Actionfields -----
    public static readonly ACTIONFIELD_ID = 12;
    public static readonly COIN_ID = 12;
    public static readonly PORTAL_BLUE_ID = 13;
    public static readonly PORTAL_ORANGE_ID = 14;
    // ----- Probability -----
    public static readonly DIRECTION: number[] = [0,1,2,3] 

    public static tileIDToAPIID_scifiLVL_Ground(tileID: number): number {
        if(tileID === 5 || tileID === 18 || tileID === 43)  return TileParser.WALL_ID;
        if(tileID === 1 || tileID === 2 || tileID === 15 || tileID === 16) return TileParser.START_ID;
        if(tileID === 69 || tileID === 70 || tileID === 83 || tileID === 84) return TileParser.STOP_ID;
        return -1;
    }

    public static tileIDToAPIID_scifiLVL_Action(tileID: number): number {
        if(tileID === 155 || tileID === 156|| tileID === 157|| tileID === 158|| tileID === 159|| tileID === 160) return TileParser.COIN_ID;
        if(tileID === 93) return TileParser.PORTAL_BLUE_ID;
        if(tileID === 94) return TileParser.PORTAL_ORANGE_ID;
        return -1;
    }

    public static tileIDToAPIID_scifiLVL_Direction(tileID:number): number {
        if(tileID === 151) return TileParser.DIRECTION[0]; //hellblau oben
        if(tileID === 153) return TileParser.DIRECTION[1]; //gruen  rechts
        if(tileID === 150) return TileParser.DIRECTION[2]; //weiS   unten
        if(tileID === 166) return TileParser.DIRECTION[3]; //rot    links
        return 0;
    }

    public static tileIDToAPIID_scifiLVL_Split(tileID:number): boolean {
        return (tileID === 179 || tileID === 180 
            || tileID === 181 || tileID === 182 
            || tileID === 99);
    }

    public static tileIDToAPIID_scifiLVL_SplitPercentage(tileID:number): number {
        if(tileID === 166) return 0.25; //red
        else if(tileID === 164) return 0.4; //yellow
        else if(tileID === 150) return 0.5; //white
        else if(tileID === 153) return 0.8; //green
        else return 1;
    }

    public static TileIDToAPIID_scifiLVL_Punishment(tileID:number): boolean {
        return tileID === 169;
    }

    public static TileIDToAPIID_scifiLVL_Fragezeichen(tileID:number): boolean {
        return tileID === 99;
    }

    public static tileTupleAPI (ourMap: OurMap) : TilePiece[] {
        const layerDirection = ourMap.layers.layerDirection;
        const layerFragezeichen = ourMap.layers.layerFragezeichen;
        const layerAction = ourMap.layers.layerAction;
        const layerPercentage = ourMap.layers.layerPercentage;
        const layerPunishment = ourMap.layers.layerPunishment;
        const layerSplit = ourMap.layers.layerSplit;
        
        const tileTuple: TilePiece[] = [];
        this.ground(ourMap, tileTuple);

        layerAction.forEachTile((tile) => { //check if it is an actionField
            const index: number = this.tileIDToAPIID_scifiLVL_Action(tile.index);
            if (index === this.ACTIONFIELD_ID){
                const x = tileTuple[tile.x+(tile.y*layerAction.layer.width)];
                x.tileType[1] = true;
            }
        });

        layerSplit.forEachTile((tile) => { //check if it is a split field
            const index: number = tile.index;
            if (this.tileIDToAPIID_scifiLVL_Split(index)){
                tileTuple[tile.x+(tile.y*layerAction.layer.width)].splitField = true;      
            }
        });

        layerDirection.forEachTile((tile)=> { //determines the direction for the split
            const index: number = tile.index;
            tileTuple[tile.x+(tile.y*layerAction.layer.width)].splitDirection = this.tileIDToAPIID_scifiLVL_Direction(index);
        });

        layerPercentage.forEachTile((tile)=>{ //determines the split percentage
            const index: number = tile.index;
            tileTuple[tile.x+(tile.y*layerAction.layer.width)].splitPercentage = this.tileIDToAPIID_scifiLVL_SplitPercentage(index);
            tile.setSize(18,18,32,32);
            tile.pixelX = tile.pixelX+7;
            tile.pixelY = tile.pixelY+7;
        });
        
        layerPunishment.forEachTile((tile) => {
            const index: number = tile.index;
            tileTuple[tile.x+(tile.y*layerAction.layer.width)].punishment = this.TileIDToAPIID_scifiLVL_Punishment(index);
        });

        layerFragezeichen.forEachTile((tile) => {
            const index: number = tile.index;
            tileTuple[tile.x+(tile.y*layerAction.layer.width)].fragezeichen = this.TileIDToAPIID_scifiLVL_Fragezeichen(index);
            tile.setSize(36,36,32,32);
            tile.pixelX = tile.pixelX -2;
            tile.pixelY = tile.pixelY -2;
        })
        return tileTuple;      
    }

    private static ground(ourMap: OurMap, tileTuple: TilePiece[]): void {
        const layerGround = ourMap.layers.layerGround;
        layerGround.forEachTile((tile) => {
            const index = this.tileIDToAPIID_scifiLVL_Ground(tile.index);
            let arr!: boolean[];
            switch (index) {
                case this.WALL_ID:
                    arr = [true, false, false];
                    break;
                case this.STOP_ID:
                    arr = [false, false, true];
                    break;
                default:
                    arr = [false, false, false];
                    break;
            }
            tileTuple.push(new TilePiece(
                [tile.pixelX, tile.pixelY],
                arr
            ));
        });
    }
}
