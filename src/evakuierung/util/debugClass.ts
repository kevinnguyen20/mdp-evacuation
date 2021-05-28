import { Figure } from "./figure";
import { TileParser } from "./tileParser";
import { TilePiece } from "./tilePiece";
import { LevelFunctions } from "./levelFunctions";

type Coordination = {
    x: number;
    y: number;
};

type debugFigure = {
    spawnCoordinates: Coordination;
    coordinates: Coordination;
    isQueen: boolean;
    image: Phaser.GameObjects.Image;
};

type debugTilePiece = {
    coordinate
}

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
        if(this.checkFigureNull(figure)) {
            console.log("[-] Fehler bei Debug-Info über <figure>");
            process.exit(1);
        }
        else {
            const dFigure: debugFigure = null;
            dFigure.spawnCoordinates.x = figure.x;
            dFigure.spawnCoordinates.y = figure.y;
            
            if(dFigure.isQueen === true) 
                console.log("Königin: -----------------------")
            else if(dFigure.isQueen === false)
                console.log("Untertan: -----------------------");

            console.log(`Koordinaten: [${dFigure.spawnCoordinates.x}, ${dFigure.spawnCoordinates.y}]`);
        }
    }

    public static printFigure(figure: Figure | null | undefined): void {

        if(this.checkFigureNull(figure)) {
            console.log("[-] Fehler bei Debug-Info über <figure>");
            process.exit(1);
        } 
        else {
            const dFigure: debugFigure = null;
            dFigure.coordinates.x = figure.x;
            dFigure.coordinates.x = figure.y;
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

            console.log(`Koordinaten: [${dFigure.coordinates.x}, ${dFigure.coordinates.y}]`);
            console.log(dFigure.image);
        }
    }

    /* Debug information about <tilePiece>
     */

    public static printTilePiece(tilePiece: TilePiece | null | undefined): void {
        if(this.checkFigureNull) {
            console.log("[-] Fehler bei Debug-Info über <tilePiece>");
            process.exit(1);
        }
        else {

        }
    }
}
