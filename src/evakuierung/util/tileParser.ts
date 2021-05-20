export class TileParser {

    public static readonly WALL_ID = 9;
    public static readonly START_ID = 10;
    public static readonly STOP_ID = 11;
    public static readonly ACTIONFIELD_ID = 12;
    
    constructor() {
        // maybe pass level informations to set/load which Level we are in, to chose the right function
    }

    // for each Level a different method, cus tileID == 5 may be double used with different meanings in another level
    // just add a new TileID to the matching return value (API_ID)
    // count always +1 to the TileID from the Program Tiled
    
    /**
     * Maps the given Tile_ID of Level 1 to the general API_ID  
     */
    public tileIDToAPIID_LVL1(tileID: number) {
        if(tileID === 5)  return TileParser.WALL_ID;
        if(tileID === 63) return TileParser.START_ID;
        if(tileID === 73) return TileParser.STOP_ID;
        if(tileID === 3)  return TileParser.ACTIONFIELD_ID;
    }

    

}