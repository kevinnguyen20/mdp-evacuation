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
    | Phaser.GameObjects.Image
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
    | Phaser.GameObjects.Image
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
        else if(object instanceof Phaser.GameObjects.Image)
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
            console.error("Unexpected error occured in <figure> isQueen");
            process.exit(1);
        }
    }

    public static printFigure(figure: Figure | null | undefined): void {

        if(this.checkNull(figure)) {
            console.error("Error in <figure>");
            process.exit(1);
        } 
        else {
            const dFigure: debugFigure = null;

            if(this.checkNumber(figure.x))
                dFigure.coordinates.x = figure.x;

            if(this.checkNumber(figure.y))
                dFigure.coordinates.y = figure.y;

            if(this.checkBoolean(figure.isQueen))
                dFigure.isQueen = figure.isQueen;

            if(this.checkNull(figure.image))
                dFigure.image = figure.image;

            console.log(`FIGURE--------------------------------------------`);
            console.log(`Koordinaten:           [${dFigure.coordinates.x}, ${dFigure.coordinates.y}]`);
            console.log(`Königin:               ${dFigure.isQueen}`);
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

            if(tilePiece.tileCoordinates.length === 2) {

                if(this.checkNumber(tilePiece.tileCoordinates[0]))
                    dTilePiece.coordinates.x = tilePiece.tileCoordinates[0];

                if(this.checkNumber(tilePiece.tileCoordinates[1]))
                    dTilePiece.coordinates.y = tilePiece.tileCoordinates[1];
            }
            else
                console.error("tilePiece.tileCoordinates has wrong size");

            if(tilePiece.directionProbabilities.length === 4) {
                if(this.checkNumber(tilePiece.directionProbabilities[0]))
                    dTilePiece.probabilites.up = tilePiece.directionProbabilities[0];

                if(this.checkNumber(tilePiece.directionProbabilities[1]))
                    dTilePiece.probabilites.right = tilePiece.directionProbabilities[1];

                if(this.checkNumber(tilePiece.directionProbabilities[2]))
                    dTilePiece.probabilites.down = tilePiece.directionProbabilities[2];

                if(this.checkNumber(tilePiece.directionProbabilities[3]))
                    dTilePiece.probabilites.left = tilePiece.directionProbabilities[3];
            }
            else
                console.error("tilePiece.directionProbabilities has wrong size");

            if(tilePiece.tileType.length === 3) {
                if(this.checkBoolean(tilePiece.tileType[0]))
                    dTilePiece.tileType.wall = tilePiece.tileType[0];

                if(this.checkBoolean(tilePiece.tileType[1]))
                    dTilePiece.tileType.action = tilePiece.tileType[1];

                if(this.checkBoolean(tilePiece.tileType[2]))
                    dTilePiece.tileType.goal = tilePiece.tileType[2];
            }
            else
                console.error("tilePiece.tileType has wrong size");

            if(this.checkNumber(tilePiece.playersOnTop))
                dTilePiece.playersOnTop = tilePiece.playersOnTop;

            console.log(`TILEPIECE-----------------------------------------`);
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
