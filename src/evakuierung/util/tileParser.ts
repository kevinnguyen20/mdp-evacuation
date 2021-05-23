import { TilePiece } from "./tilePiece";

export class TileParser {

    public static readonly TILE_SIZE = 32;


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
    public static readonly PROBABILITY_0 = 0;
    public static readonly PROBABILITY_1 = 10;
    public static readonly PROBABILITY_2 = 20;
    public static readonly PROBABILITY_3 = 30;
    public static readonly PROBABILITY_4 = 40;
    public static readonly PROBABILITY_5 = 50;
    public static readonly PROBABILITY_6 = 60;
    public static readonly PROBABILITY_7 = 70;
    public static readonly PROBABILITY_8 = 80;
    public static readonly PROBABILITY_9 = 100;

    
    
    constructor() {
        // maybe pass level informations, so we can determine the Layer in here?
    }

    // as the Tileset is the same in every Level, the TileIDs are in every Level the same

    // Want to add new Tiles to map? 
    // open Tiled, click on the Tile u want to add and count +1 to the TileID
    
    /**
     * Maps the given Tile_ID of Level 1 to the general API_ID  
     * FOR THE OLD FIRST MAP
     */
    public tileIDToAPIID_LVL1(tileID: number) {
        if(tileID === 5)  return TileParser.WALL_ID;
        if(tileID === 63) return TileParser.START_ID;
        if(tileID === 73) return TileParser.STOP_ID;
        if(tileID === 3)  return TileParser.ACTIONFIELD_ID;
        return -1;
    }


    /**
     * Use only the Ground-Layer Tiles as Input
     */
    public static tileIDToAPIID_scifiLVL_Ground(tileID: number) {
        if(tileID == 5 || tileID == 18 || tileID == 43)  return TileParser.WALL_ID;
        if(tileID == 1 || tileID == 2 || tileID == 15 || tileID == 16) return TileParser.START_ID;
        if(tileID == 69 || tileID == 70 || tileID == 83 || tileID == 84) return TileParser.STOP_ID;
        return -1;
    }

    /**
     * Use only the Action-Layer Tiles as Input
     */
    public static tileIDToAPIID_scifiLVL_Action(tileID: number) {
        if(tileID == 113) return TileParser.COIN_ID;
        if(tileID == 93) return TileParser.PORTAL_BLUE_ID;
        if(tileID == 94) return TileParser.PORTAL_ORANGE_ID;
        return -1;
    }


    /**
     * Use only the Probability-Layer Tiles as Input
     */
    public static tileIDToAPIID_scifiLVL_Probability(tileID: number) {
        if(tileID == 122) return TileParser.PROBABILITY_0;
        if(tileID == 123) return TileParser.PROBABILITY_1;
        if(tileID == 124) return TileParser.PROBABILITY_2;
        if(tileID == 125) return TileParser.PROBABILITY_3;
        if(tileID == 126) return TileParser.PROBABILITY_4;
        if(tileID == 136) return TileParser.PROBABILITY_5;
        if(tileID == 136) return TileParser.PROBABILITY_6;
        if(tileID == 136) return TileParser.PROBABILITY_7;
        if(tileID == 136) return TileParser.PROBABILITY_8;
        if(tileID == 136) return TileParser.PROBABILITY_9;
        return -1;
    }

    /**
     * 
     * @param groundLayer groundLayer des Levels, um herauszufinden welcher Tile eine Wand, Ziel und Start ist 
     * @param actionLayer actionLayer des Levels, um herauszufinden welcher Tile ein actionField ist
     * @returns fiveTuple, access the tiles in the fiveTuple with coordinates, e.g. fiveTuple[x+y*tilemapwidth]
     */
    public static fiveTupleAPI (groundLayer: Phaser.Tilemaps.Tilemap, actionLayer: Phaser.Tilemaps.Tilemap) : TilePiece[] {
        //TODO Wahrscheinlichkeiten in den einzelnen Tiles implementieren
        const fiveTuple = [];
        for (let x = 0; x<= groundLayer.width-1; x++){
            for (let y = 0; y <= groundLayer.height-1; y++){
                let tile = groundLayer.getTileAtWorldXY(x, y, true); 
                if (this.tileIDToAPIID_scifiLVL_Ground(tile.index) === this.WALL_ID){ //is Tile a wall?
                    fiveTuple.push(new TilePiece (x, y, 0 ,0, 0, 0, true, false, false));
                }
                else if (this.tileIDToAPIID_scifiLVL_Ground(tile.index) === this.STOP_ID){ //is Tile the goal?
                    fiveTuple.push(new TilePiece (x, y, 0, 0, 0, 0, false, false, true));
                }
                else{
                    let action = false;
                    if (this.tileIDToAPIID_scifiLVL_Action(tile.index) === this.ACTIONFIELD_ID){ //is Tile an actionfield?
                        action = true;
                    }
                    fiveTuple.push(new TilePiece(x, y, 0, 0, 0, 0, false, action, false))
                }
            }
        }
        return fiveTuple;      
    }


}