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

    public updateCoordinates(x:number, y: number): void {
        this.x += x;
        this.y += y;
        this.image.x += x;
        this.image.y += y;
    }

    /* We will retrieve the probability from the tile.
    Instead, implement something like:
    public retrieveProbsFromTile(f: number, n: number, e: number, s: number, w: number) {
        tmp = math.random()
        if(tmp < f) follow queen
        else if(...) other direction
    }

    public followQueen():boolean {
        const randomNum: number = Math.random();
        if (randomNum < 0.92){
            return true;
        }
        else return false;
    }
    */


    public toString = (): string => {
        return "Queen's position (${this.x} + , ${this.y}), isQueen: ${this.isQueen}";
    }

}
