
export class MainScene extends Phaser.Scene {

    private timeAccumulator = 0.0;

    private speedMultiplier: number;

    constructor() {
        super({
            key: "MainScene"
        });
    }

    gameRestart() {
        this.scene.restart();
    }

    gameSpeedUp() {
        this.speedMultiplier = 2.0;
    }

    gameSlowDown() {
        this.speedMultiplier = 0.5;
    }

    gameNormalSpeed() {
        this.speedMultiplier = 1.0;
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        );
    }

    init(): void {
        this.data.set('playerScore', 0);
        this.data.set('playerWinningScore', 10);
    }

    create(): void {
    }

    private setupWorld(): void {
    }

    private setupCollision(): void {
    }

    update(): void {
    }
}
