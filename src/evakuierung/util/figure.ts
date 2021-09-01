export class Figure{

    public static readonly STEP_SIZE = 32;

    public x: number;
    public y: number;
    public isQueen: boolean;
    public image: Phaser.GameObjects.Image;

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


    public toString = (): string => {
        return `Spawn position (${this.x} , ${this.y}), isQueen: ${this.isQueen}`;
    }

}
