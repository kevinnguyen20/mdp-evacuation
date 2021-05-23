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
    
    /**
     * Decides if a player should follow the queen
     * @returns True if the player shold go with the queen or else false
     */
    public followQueen():boolean {
        const randomNum: number = Math.random();
        if (randomNum < 0.98){
            return true;
        }
        else return false;
    }

}