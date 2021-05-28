import { Figure } from "./figure";
import { TileParser } from "./tileParser";
import { TilePiece } from "./tilePiece";
import { LevelFunctions } from "./levelFunctions";

type debugFigure = {
    spawnX: number;
    spawnY: number;
    x: number;
    y: number;
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
    public static Figure(figure: Figure | null | undefined): boolean {
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

    public static printSpawnPosition(figure: Figure | null): void {
        if(!(this.Figure(figure))) {
            console.log("[-] Fehler bei Debug-Info über <figure>");
            process.exit(1);
        }
        else {
            const dFigure: debugFigure = null;
            dFigure.spawnX = figure.x;
            dFigure.spawnY = figure.y;
            
            if(dFigure.isQueen === true) 
                console.log("Königin: -----------------------")
            else if(dFigure.isQueen === false)
                console.log("Untertan: -----------------------");

            console.log(`Koordinaten: [${dFigure.spawnX}, ${dFigure.spawnY}]`);
        }
    }

    public static printFigure(figure: Figure | null): void {

        if(!(this.Figure(figure))) {
            console.log("[-] Fehler bei Debug-Info über <figure>");
            process.exit(1);
        } 
        else {
            const dFigure: debugFigure = null;
            dFigure.x = figure.x;
            dFigure.y = figure.y;
            dFigure.isQueen = figure.isQueen;
            dFigure.image = figure.image;


            if(dFigure.isQueen === true) 
                console.log("Königin: -----------------------")
            else if(dFigure.isQueen === false)
                console.log("Untertan: -----------------------");

            console.log(`Koordinaten: [${dFigure.x}, ${dFigure.y}]`);
            console.log(dFigure.image);
        }
    }
}
