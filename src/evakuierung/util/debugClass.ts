import { Figure } from "./figure";
import { TileParser } from "./tileParser";
import { TilePiece } from "./tilePiece";
import { LevelFunctions } from "./levelFunctions";

type debugFigure = {
    x: number;
    y: number;
    isQueen: boolean;
};

export class DebugClass {

    public static printFigure(figure: Figure | null): void {

        /*
         * figure can be "null" or "undefinded". Data type "null"
         * belongs to data type "object".
         */
        if(!figure || typeof figure !== "object") {
            console.log("[-] Fehler bei Debug-Info über <figure>");
            process.exit(1);
        } 
        else {
            const dFigure: debugFigure = null;
            dFigure.x = figure.x;
            dFigure.y = figure.y;
            dFigure.isQueen = figure.isQueen;


            if(dFigure.isQueen === true) 
                console.log("Königin: -----------------------")
            else if(dFigure.isQueen === false)
                console.log("Untertan: -----------------------");

            console.log(`Koordinaten: [${dFigure.x}, ${dFigure.y}]`);
        }
    }
}
