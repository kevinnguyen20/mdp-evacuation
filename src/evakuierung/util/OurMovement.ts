import { TileParser } from "../util/tileParser";
import { Figure } from "../util/figure"
import { Figures, LevelFunctionsUpgraded, MapPosition, OurGame, OurMap, Tiles, Wrapper, Meta, TileSet } from "../util/LevelFunctionsUpgraded";

export class OurMovement {
    public static groupTileVisited = false;

    public static doMove(ourGame: OurGame, 
        figures: Figures, 
        tiles: Tiles, ourMap: OurMap, 
        scene: Phaser.Scene,
        direction: string,
        mapPosition: MapPosition,
        nextLevel: number, diff: number): void {

        const wrapper = {
            ourMap: ourMap,
            tiles: tiles,
            scene: scene,
            ourGame: ourGame,
            mapPosition: mapPosition,
            figures: figures.figureList
        };
        const figure = {
            coordinates: false,
            pos: 0
        }

        this.findOutDirection(direction, figure, wrapper.ourGame);
        this.tileVisited(figure, figures, wrapper, nextLevel, diff);
    }

    private static findOutDirection(direction: string, figure: Meta, ourGame: OurGame): void {
        let val = 0;
        if(direction === "up") {
            ourGame.queenPos[1] -= 1;
            val = 0;
        }
        else if(direction === "right") {
            ourGame.queenPos[0] += 1;
            val = 1;
        }
        else if(direction === "down") {
            ourGame.queenPos[1] += 1;
            val = 2;
        }
        else {
            ourGame.queenPos[0] -= 1;
            val = 3;
        }
        this.updateDirection(figure, val);
    }

    private static tileVisited(figure: Meta, figures: Figures, wrapper: Wrapper, nextLevel: number, diff: number): void {
        figures.figureList[0] = this.movePlayer(figure, wrapper, figures.figureList[0]);
            
        if(!OurMovement.groupTileVisited){
            this.moveInGeneratedDirection(figure, figures, wrapper);
            this.onSplitField(figure, wrapper);
        }
        else
            OurMovement.groupTileVisited = false;
        
        LevelFunctionsUpgraded.chainCharacters(figures, wrapper.tiles);                
        LevelFunctionsUpgraded.winConditionReachedCheck(wrapper.ourGame, wrapper.tiles, wrapper.scene, nextLevel, diff);
    }

    private static moveInGeneratedDirection(
        figure: Meta, 
        fig: Figures, 
        wrapper: Wrapper): void {
        fig.figureList.forEach( (element) =>{
            if(element.isQueen == false)
                element = this.movePlayer(figure, wrapper, element);
        });
    }

    private static movePlayer(figure: Meta, wrapper: Wrapper, element: Figure): Figure {

        const xory = figure.coordinates;
        const pos = figure.pos;

        const ourMap = wrapper.ourMap;
        const tiles = wrapper.tiles;
        const scene = wrapper.scene;
        const mapPosition = wrapper.mapPosition;

        const tileSet = this.whichAxis(figure, wrapper, element);
        const tile = tileSet.tile;
        const tileAction = tileSet.tileAction;

        if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) !== TileParser.WALL_ID) {
            const width = ourMap.layers.layerGround.layer.width;
            let x = element.x;
            let y = element.y;
            let index = (x + y*width) / 32;
            this.removePlayersOnTop(wrapper, index, element);

            if(element.isQueen && tiles.queenFieldIndicator != null)
                tiles.queenFieldIndicator.destroy();
            
            xory === false ?             
                element.updateCoordinates(pos, 0):
                element.updateCoordinates(0, pos);

            x = element.x;
            y = element.y;
            index = (x + y*width) / 32;
            this.updatePlayersOnTop(wrapper, index, element);

            if(element.isQueen){
                const posx = mapPosition.mapPosX + element.x + Figure.STEP_SIZE / 2;
                const posy = mapPosition.mapPosY + element.y + Figure.STEP_SIZE / 2;
                tiles.queenFieldIndicator = scene.add.image(posx, posy,'red').setDepth(1);
                this.alienGathering(tileSet, element, wrapper);
                this.isQuestionMark(tileSet, element, wrapper);
                this.isSplitField(tileSet, element, wrapper);
            }
            this.isGameFinished(wrapper, element, tile);
            this.isCoin(wrapper, tileAction);
        }
        return element;
    }

    private static isSplitField(tileSet: TileSet, element: Figure, wrapper: Wrapper): void {
        const tiles = wrapper.tiles;
        const ourMap = wrapper.ourMap;
        const ourGame = wrapper.ourGame;
        const x = element.x;
        const y = element.y;
        const width = ourMap.layers.layerGround.layer.width;
        const index = (x + y*width) / 32
        if(tiles.tilesList[index].splitField){
            ourGame.splitFieldsToVisit--;
            this.printWinCondition(wrapper);
        }
    }

    private static printWinCondition(wrapper: Wrapper): void {
        const ourGame = wrapper.ourGame;
        const winCond = ourGame.winCond;
        const fields = ourGame.splitFieldsToVisit;
        if(ourGame.splitFieldsToVisit >= 0){
            ourGame.survivorScoreText.setText('Win condition: '+winCond+' aliens and '+fields+' split fields');
        }
    }

    private static isQuestionMark(tileSet: TileSet, element: Figure, wrapper: Wrapper): void {
        const ourMap = wrapper.ourMap;
        const width = ourMap.layers.layerGround.layer.width;
        const tiles = wrapper.tiles;
        const tileFr = tileSet.tileFr;
        const x = element.x;
        const y = element.y;
        const index = (x + y*width) / 32;
        if (tiles.tilesList[index].fragezeichen)
            tileFr.setVisible(false);
    }

    private static alienGathering(tileSet: TileSet, element: Figure, wrapper: Wrapper): void {
        const tileAction = tileSet.tileAction;
        if(tileAction.index == 178 && tileAction.visible){
            tileAction.setVisible(false);
            OurMovement.collectAllAliens(element, wrapper);
            OurMovement.groupTileVisited = true;
        }
    }

    private static removePlayersOnTop(wrapper: Wrapper, index: number, element: Figure): void {
        const tiles = wrapper.tiles;
        tiles.tilesList[index].playersOnTopCounter--;
        const val = tiles.tilesList[index].playerOnTopList.indexOf(element);
        tiles.tilesList[index].playerOnTopList.splice(val, 1);
    }

    private static updatePlayersOnTop(wrapper: Wrapper, index: number, element: Figure): void {
        const tiles = wrapper.tiles;
        tiles.tilesList[index].playersOnTopCounter++;
        tiles.tilesList[index].playerOnTopList.push(element);
    }

    private static whichAxis(figure: Meta, wrapper: Wrapper, element: Figure): TileSet {
        const xory = figure.coordinates;
        const pos = figure.pos;
        const retval = xory === false ?
            this.updateTile(wrapper, pos, 0, element):
            this.updateTile(wrapper, 0, pos, element);
        return retval;
    }

    private static updateTile(wrapper: Wrapper, pos1: number, pos2: number, element: Figure): TileSet {
        const ourMap = wrapper.ourMap;
        const x = element.image.x;
        const y = element.image.y;

        const tile = ourMap.layers.layerGround.getTileAtWorldXY(x+pos1, y+pos2, true);
        const tileAction = ourMap.layers.layerAction.getTileAtWorldXY(x+pos1, y+pos2, true);
        const tilePr = ourMap.layers.layerSplit.getTileAtWorldXY(x+pos1, y+pos2, true);
        const tileFr = ourMap.layers.layerFragezeichen.getTileAtWorldXY(x+pos1, y+pos2, true);

        const tileSet = {
            tile: tile,
            tileAction: tileAction,
            tilePr: tilePr,
            tileFr: tileFr
        }
        return tileSet;
    }

    private static isGameFinished(wrapper: Wrapper, element: Figure, tile: Phaser.Tilemaps.Tile): void {
        const ourGame = wrapper.ourGame;
        if(!ourGame.gameFinished
            && TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) == TileParser.STOP_ID
            && element.isQueen) {
            this.updateFinishedGame(wrapper);
        }
    }

    private static updateFinishedGame(wrapper: Wrapper): void {
        const ourGame = wrapper.ourGame;
        ourGame.scoreText.setText('Your final score: ' + ourGame.score + "!");
        ourGame.gameFinished = true;
    }

    private static isCoin(wrapper: Wrapper, tileAction: Phaser.Tilemaps.Tile): void {
        const ourMap = wrapper.ourMap;
        if(TileParser.tileIDToAPIID_scifiLVL_Action(tileAction.index) == TileParser.ACTIONFIELD_ID) {
            ourMap.layers.layerAction.removeTileAt(tileAction.x, tileAction.y, false, false);
            this.updateScore(wrapper);
        }
    }

    private static updateScore(wrapper: Wrapper): void {
        const ourGame = wrapper.ourGame;
        ourGame.score += 1;
        ourGame.scoreText.setText('Coins: ' + ourGame.score + '/3');
    }

    private static onSplitField(figure: Meta, wrapper: Wrapper) : void{
        const tiles = wrapper.tiles;

        tiles.tilesList.forEach(tile => {
            if(tile.splitField){
                const perc = tile.splitPercentage;
                const num = tile.playersOnTopCounter;
                const playersToMove = Math.floor(perc * num);

                for (let i=0; i<playersToMove; i++) {
                    const index = tile.playerOnTopList.length;
                    const element = tile.playerOnTopList[index-1];
                    const dir = tile.splitDirection;

                    this.updateDirection(figure, dir);
                    this.movePlayer(figure, wrapper, element);
                }
            }
        });
        
    }

    private static updateDirection(figure: Meta, direction: number): void {
        switch (direction) {
            case 0: //up
                figure.coordinates = true;
                figure.pos = -Figure.STEP_SIZE
                break;
            case 1: //right
                figure.coordinates = false;
                figure.pos = Figure.STEP_SIZE;
                break;
            case 2: //down
                figure.coordinates = true;
                figure.pos = Figure.STEP_SIZE;
                break;
            default: //left
                figure.coordinates = false;
                figure.pos = -Figure.STEP_SIZE;
                break;
        }
    }


    private static collectAllAliens(element: Figure, wrapper: Wrapper) : void {
        const figures = wrapper.figures;
        figures.forEach((fig) => {
            if(!fig.isQueen){
                this.removeFigureFromPreviousTile(wrapper, fig);
                this.updateFigureCoordinates(fig, element);
                this.addFiguretoNewTile(element, wrapper, fig);
            }
        });
    }

    private static removeFigureFromPreviousTile(wrapper: Wrapper, fig: Figure): void {
        const ourMap = wrapper.ourMap;
        const tiles = wrapper.tiles;
        const width: number = ourMap.layers.layerGround.layer.width;
        const index: number = (fig.x + fig.y * width)/32;
        
        tiles.tilesList[index].playersOnTopCounter--;
        const indexUpdated: number = tiles.tilesList[index].playerOnTopList.indexOf(fig);
        tiles.tilesList[index].playerOnTopList.splice(indexUpdated, 1);
    }

    private static updateFigureCoordinates(fig: Figure, element: Figure): void {
        fig.x = element.x;
        fig.y = element.y;
        fig.image.x = element.image.x;
        fig.image.y = element.image.y;
    }

    private static addFiguretoNewTile(element: Figure, wrapper: Wrapper, fig: Figure): void {
        const ourMap = wrapper.ourMap;
        const tiles = wrapper.tiles;
        const width: number = ourMap.layers.layerGround.layer.width;
        const index = (element.x + element.y * width)/32;
        const targetTile = tiles.tilesList[index];

        targetTile.playersOnTopCounter++;
        targetTile.playerOnTopList.push(fig);

    }
}
