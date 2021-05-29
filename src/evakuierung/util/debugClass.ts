import { Figure } from "./figure";
import { TileParser } from "./tileParser";
import { TilePiece } from "./tilePiece";
import { LevelFunctions } from "./levelFunctions";

type Coordinates = {
    x: number;
    y: number;
};

type Probabilities = {
    up: number;
    right: number;
    down: number;
    left: number;
    followQueen: number;
};

type TileType = {
    wall: boolean;
    action: boolean;
    goal: boolean;
};

type debugFigure = {
    coordinates: Coordinates;
    isQueen: boolean;
    image: Phaser.GameObjects.Image;
};

type debugTilePiece = {
    coordinates: Coordinates;
    probabilites: Probabilities;
    tileType: TileType;
    playersOnTop: number;
};

export class DebugClass {

    public static checkUndefined(object: Figure 
    | TilePiece 
    | null 
    | undefined): boolean {
        if(typeof object === "undefined") {
            console.error("object is undefinded");
            return true;
        }
        else if(object === null) {
            console.error("object is null");
            return true;
        }
        else
            return false;
    }

    public static checkNull(object: Figure 
    | TilePiece
    | null 
    | undefined): boolean {
        if(this.checkUndefined(object)) {
            console.error("Unexpected error occured in checkNull");
            return true;
        }
        else if(object instanceof Figure)
            return false;
        else if(object instanceof TilePiece)
            return false;



        else {
            console.error("Unexpected error in checkNull");
            process.exit(1);
        }

    }

    public static checkBoolean(value: boolean | null | undefined): boolean {
        if(value === true)
            return true;
        else if(value === false)
            return true;
        else if(typeof value === "undefined")
            return false;
        else if(value === null)
            return false;
        else {
            console.error("Unexpected error in checkBoolean");
            process.exit(1);
        }
    }

    public static checkNumber(value: number | null | undefined): boolean {
        if(typeof value === "number")
            return true;
        else if(typeof value === "undefined")
            return false;
        else if(value === null)
            return false;
        else {
            console.error("Unexpected error in checkNumber");
            process.exit(1);
        }
    }

    public static checkString(value: string | null | undefined): boolean {
        if(typeof value === "string")
            return true;
        else if(typeof value === "undefined")
            return false;
        else if(value === null)
            return false;
        else {
            console.error("Unexpected error in checkString");
            process.exit(1);
        }
    }


    /*
     * 
     * Debug information about <figure>
     */

    public static isQueen(dFigure: debugFigure): void {
        if(dFigure.isQueen === true) 
            console.log("Königin: -----------------------")
        else if(dFigure.isQueen === false)
            console.log("Untertan: -----------------------");
        else {
            console.error("Unexpected error occured in <figure> isQueen")
        }
    }

    public static printFigure(figure: Figure | null | undefined): void {

        if(this.checkNull(figure)) {
            console.error("Error in <figure>");
            process.exit(1);
        } 
        else {
            const dFigure: debugFigure = null;
            dFigure.coordinates.x = figure.x;
            dFigure.coordinates.x = figure.y;
            dFigure.isQueen = figure.isQueen;
            dFigure.image = figure.image;


            this.isQueen(dFigure);

            console.log(`Koordinaten: [${dFigure.coordinates.x}, ${dFigure.coordinates.y}]`);
        }
    }

    /* 
     * Debug information about <tilePiece>
     *
     */

    public static printTilePiece(tilePiece: TilePiece | null | undefined): void {
        if(this.checkNull(tilePiece)) {
            console.error("Error in <tilePiece>");
            process.exit(1);
        }
        else {
            const dTilePiece: debugTilePiece = null;
            dTilePiece.coordinates.x = tilePiece.tileCoordinates[0];
            dTilePiece.coordinates.y = tilePiece.tileCoordinates[1];
            dTilePiece.probabilites.up = tilePiece.directionProbabilities[0];
            dTilePiece.probabilites.right = tilePiece.directionProbabilities[1];
            dTilePiece.probabilites.down = tilePiece.directionProbabilities[2];
            dTilePiece.probabilites.left = tilePiece.directionProbabilities[3];
            dTilePiece.tileType.wall = tilePiece.tileType[0];
            dTilePiece.tileType.action = tilePiece.tileType[1];
            dTilePiece.tileType.goal = tilePiece.tileType[2];
            dTilePiece.playersOnTop = tilePiece.playersOnTop;

            console.log(`Koordinaten:           [${dTilePiece.coordinates.x}, ${dTilePiece.coordinates.y}]`);
            console.log(`Wahrscheinlichkeiten:`); 
            console.log(`Norden|  Osten|  Süden| Westen`);
            console.log(`------+-------+-------+-------`);
            console.log(`     ${dTilePiece.probabilites.up}|  ${dTilePiece.probabilites.right}|  ${dTilePiece.probabilites.down}| ${dTilePiece.probabilites.left}`);
            console.log(`Wall:                  ${dTilePiece.tileType.wall}`);
            console.log(`Action:                ${dTilePiece.tileType.action}`);
            console.log(`Goal:                  ${dTilePiece.tileType.goal}`);
            console.log(`Objekte auf dem Feld:  ${dTilePiece.playersOnTop}`);
        }
    }
}
