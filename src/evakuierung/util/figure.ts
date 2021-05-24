export class Figure{

    public static readonly STEP_SIZE = 32;

    public x: number;
    public y: number;
    public isQueen: boolean;
    public image:Phaser.GameObjects.Image;

    constructor(x: number, y: number, isQueen:boolean){
        this.x = x;
        this.y = y;
        this.isQueen = isQueen;
    }

    /**
     * Add the given values to the Position and update the image
     * @param x add value to the x-coordinate
     * @param y add value to the y-coordinate
     */
    public updateCoordinates(x:number, y: number): void {
        this.x += x;
        this.y += y;
        this.image.x += x;
        this.image.y += y;
    }
    
    /**
     * Decides if a player should follow the queen
     * @returns True if the player shold go with the queen or else false
     */
    public followQueen():boolean {
        const randomNum: number = Math.random();
        if (randomNum < 0.92){
            return true;
        }
        else return false;
    }

    public toString = (): string => {
        return `Player Position ( ${this.x} + ,  ${this.y}), isQueen: ${this.isQueen}`;
    }

}