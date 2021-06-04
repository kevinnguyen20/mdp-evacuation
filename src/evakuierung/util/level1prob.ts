export class level1prob {
    private probs: [number][number];

    getProbs(): [number][number] {
        // [Westen, Norden, Osten, Süden]

        // Erfolgspfad
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
