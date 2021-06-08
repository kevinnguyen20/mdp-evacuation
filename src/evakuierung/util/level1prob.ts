export class level1prob {
    private probs: number[][][];

    constructor() {
        this.probs = new Array(20);

        for(let i=0; i<20; i++) {
            this.probs[i] = new Array(20);
            for(let k=0; k<20; k++) {
                this.probs[i][k] = new Array(4);
            }
        }
    }

    getProbs(): number[][][] {
        // [Westen, Norden, Osten, Süden]

        /* Erfolgspfad
        Der Erfolgspfad verläuft nicht mehr geradelinig, sondern eher schlangenlinienformig.
        Ich selbst habe es mehrere Stunden getestet (im Kopf, die Wahrscheinlichkeiten werden vom Level
        noch nicht gelesen) und habe festgestellt, dass dieser Pfad sehr herausfordernd ist. Zumal
        eine Bestrafung fehlt, wird dieses (eher kleines) Level sehr schnell komplex. Ein 
        verzweifelter Rush ist hiermit nicht mehr möglich. Die Zahl im Feld symbolisiert die 
        Anzahl von Aliens, die in die entsprechende Richtung aufgeteilt werden. Vermeintliche
        Abkürzungen werden mit sehr sehr hohen Splits bestraft.
        */

        this.probs[16][3] = [0,0,0,0];
        this.probs[17][3] = [0,0,0,0];
        this.probs[17][4] = [0,0,0,0];
        this.probs[17][5] = [0,0,0,0];
        this.probs[16][5] = [0,0,0,0];
        this.probs[15][5] = [0,0,0,0];
        this.probs[14][5] = [0,0,0,0];
        this.probs[14][6] = [0,0,0,0];
        this.probs[13][6] = [0,0,0,0];
        this.probs[12][6] = [0,0,0,0];
        this.probs[12][5] = [0,0,0,0];
        this.probs[12][4] = [0,0,0,0];
        this.probs[11][4] = [0,0,0,0];
        this.probs[11][3] = [0,0,0,0];
        this.probs[10][3] = [0,0,0,0];
        this.probs[9][3] = [0,0,0,0];
        this.probs[9][4] = [0,0,0,0];
        this.probs[9][5] = [0,0,0,0];
        this.probs[8][5] = [0,0,0,0];
        this.probs[8][6] = [0,0,0,0];
        this.probs[9][6] = [0,0,0,0];
        this.probs[10][6] = [0,0,0,0];
        this.probs[10][7] = [0,0,0,0];
        this.probs[10][8] = [0,0,0,0];
        this.probs[11][8] = [0,0,0,0];
        this.probs[12][8] = [0,0,0,0];
        this.probs[9][8] = [0,0,0,0];
        this.probs[8][8] = [0,0,0,0];
        this.probs[7][8] = [0,0,0,0];

        // Gelb = 1, Orange = 2, Rot = 4
        // (Summe der Feldelemente)
        this.probs[14][3] = [0,0,1,1]; // (hier z.B. Orange)
        this.probs[15][3] = [0,0,1,0]; // (hier z.B. Gelb)
        this.probs[14][4] = [1,1,1,1]; // (hier z.B. Rot)
        this.probs[15][4] = [1,1,1,1];
        this.probs[16][4] = [1,0,0,1];
        
        this.probs[16][6] = [0,1,0,1];
        this.probs[17][6] = [0,1,0,1];
        this.probs[16][7] = [0,1,0,1];
        this.probs[17][7] = [0,1,0,1];
        this.probs[16][8] = [0,2,0,2];
        this.probs[15][8] = [2,0,2,0];
        this.probs[14][8] = [2,0,2,0];
        this.probs[13][8] = [2,0,2,0];
        
        this.probs[13][5] = [1,1,1,1];
        this.probs[13][5] = [1,0,1,2];
        this.probs[12][3] = [0,0,0,2];
        this.probs[12][3] = [1,0,0,1];
        this.probs[10][4] = [0,0,0,2];
        this.probs[10][5] = [0,1,0,0];
        this.probs[10][5] = [0,1,0,0];
        this.probs[8][3] = [0,0,1,0];
        this.probs[8][4] = [0,1,0,0];
        this.probs[9][7] = [0,1,0,0];
        this.probs[8][7] = [0,2,2,0];
        this.probs[7][7] = [0,0,0,1];

        return this.probs;
    }
}

/*Clipboard
type Layers = {
    map: Phaser.Tilemaps.Tilemap;
    layerGround: Phaser.Tilemaps.TilemapLayer;
    layerProbability: Phaser.Tilemaps.TilemapLayer;
    layerAction: Phaser.Tilemaps.TilemapLayer;
    layerDesign: Phaser.Tilemaps.TilemapLayer;
    layerPerspective: Phaser.Tilemaps.TilemapLayer;
};

type Figures = {
    figureInitCount: number;
    figureList: Figure[];
};

type Tiles = {
    tilesList: TilePiece[];
    fieldColor: Phaser.GameObjects.Image;
    goalTile: TilePiece;
    animatedTiles: AnimatedTile[];
};

type MapPosition = {
    mapPosX: number;
    mapPosY: number;
};

type Game = {
    score: number;
    scoreText: Phaser.GameObjects.Text;
    queenPos: number[];
    gameFinished: boolean;
    preMovePos: number[];
    survivorScoreText: Phaser.GameObjects.Text;
    winCond: number;
} */
