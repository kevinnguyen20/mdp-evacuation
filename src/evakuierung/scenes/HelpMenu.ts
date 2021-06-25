export class HelpMenu extends Phaser.Scene{

    constructor() {
        super({
            key: "HelpMenu"
        });
    }

    preload(): void{
        
    }

    create(): void{
        console.log("YOU HAVE ENTERED HELP");
    }
}