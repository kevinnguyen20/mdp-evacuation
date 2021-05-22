export class Player{

    public x: number;
    public y: number;
    public isQueen: boolean;

    constructor(x: number, y: number, isQueen:boolean){
        this.x = x;
        this.y = y;
        this.isQueen = isQueen;
    }

    public updateCoordinates(x:number, y: number): void {
        this.x = x;
        this.y = y;
    } 

}