export class TileParser {

    public static readonly WALL_ID = 9;
    public static readonly START_ID = 10;
    public static readonly STOP_ID = 11;
    // ----- Actionfields -----
    public static readonly ACTIONFIELD_ID = 12;
    public static readonly COIN_ID = 12;
    public static readonly PORTAL_BLUE_ID = 13;
    public static readonly PORTAL_ORANGE_ID = 14;
    // ------------------------
    
    
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
    }


    /**
     * Use only the Ground-Layer Tiles as Input
     */
    public tileIDToAPIID_scifiLVL_Ground(tileID: number) {
        if(tileID == 5 || tileID == 18 || tileID == 43)  return TileParser.WALL_ID;
        if(tileID == 1 || tileID == 2 || tileID == 15 || tileID == 16) return TileParser.START_ID;
        if(tileID == 69 || tileID == 70 || tileID == 83 || tileID == 84) return TileParser.STOP_ID;
    }

    /**
     * Use only the Ground-Layer Tiles as Input
     */
    public tileIDToAPIID_scifiLVL_Action(tileID: number) {
        if(tileID == 113) return TileParser.COIN_ID;
        if(tileID == 93) return TileParser.PORTAL_BLUE_ID;
        if(tileID == 94) return TileParser.PORTAL_ORANGE_ID;
    }
}