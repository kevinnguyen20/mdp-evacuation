import { Figure } from "./figure";
import { TileParser } from "./tileParser";
import { TilePiece } from "./tilePiece";
import { LevelFunctions } from "./levelFunctions";

type Coordination = {
    x: number;
    y: number;
}

type debugFigure = {
    spawnCoordination: Coordination;
    coordination: Coordination;
    isQueen: boolean;
    image: Phaser.GameObjects.Image;
};

export class DebugClass {

    /**
     * figure can be "null" or "undefinded". Data type "null"
     * belongs to data type "object".
     * @param figure the movable object on the map
     * @returns 
     */
    public static checkFigureNull(figure: Figure | null | undefined): boolean {
        if(figure === undefined) {
            console.log("[-] <figure> ist undefinded");
            return false;
        }
        else if(figure === null) {
            console.log("[-] <figure> ist null");
            return false;
        }
        else if(typeof figure === "object")
            return true;

        else {
            console.log("[-] Unexpected error occured in <figure>");
            return false;
        }
    }


    /*
     * 
     * Debug information for <figure>
     */

    public static printSpawnPosition(figure: Figure | null | undefined): void {
        if(!(this.checkFigureNull(figure))) {
            console.log("[-] Fehler bei Debug-Info über <figure>");
            process.exit(1);
        }
        else {
            const dFigure: debugFigure = null;
            dFigure.spawnCoordination.x = figure.x;
            dFigure.spawnCoordination.y = figure.y;
            
            if(dFigure.isQueen === true) 
                console.log("Königin: -----------------------")
            else if(dFigure.isQueen === false)
                console.log("Untertan: -----------------------");

            console.log(`Koordinaten: [${dFigure.spawnCoordination.x}, ${dFigure.spawnCoordination.y}]`);
        }
    }

    public static printFigure(figure: Figure | null | undefined): void {

        if(!(this.checkFigureNull(figure))) {
            console.log("[-] Fehler bei Debug-Info über <figure>");
            process.exit(1);
        } 
        else {
            const dFigure: debugFigure = null;
            dFigure.coordination.x = figure.x;
            dFigure.coordination.x = figure.y;
            dFigure.isQueen = figure.isQueen;
            dFigure.image = figure.image;


            if(dFigure.isQueen === true) 
                console.log("Königin: -----------------------")
            else if(dFigure.isQueen === false)
                console.log("Untertan: -----------------------");
            else {
                console.log("[-] Fehler bei <figure> isQueen");
                process.exit(1);
            }

            console.log(`Koordinaten: [${dFigure.coordination.x}, ${dFigure.coordination.y}]`);
            console.log(dFigure.image);
        }
    }

    /* Debug information about <tilePiece>
     */

    public
}
