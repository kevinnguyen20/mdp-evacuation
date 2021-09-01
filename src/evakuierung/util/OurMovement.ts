import { TileParser } from "../util/tileParser";
import { Figure } from "../util/figure"
import { Figures, LevelFunctionsUpgraded, MapPosition, OurGame, OurMap, Tiles, Wrapper } from "../util/LevelFunctionsUpgraded";

export class OurMovement {
    public static groupTileVisited = false;

    public static doMove(ourGame: OurGame, 
        figures: Figures, 
        tiles: Tiles, ourMap: OurMap, 
        scene: Phaser.Scene,
        direction: string,
        mapPosition: MapPosition,
        nextLevel: number, diff: number): void {

        if(direction === 'left') {
            ourGame.queenPos[0] -= 1;
            const wrapper = {
                ourMap: ourMap,
                tiles: tiles,
                scene: scene,
                ourGame: ourGame,
                mapPosition: mapPosition,
                figures: figures.figureList
            }
            const figure = {
                coordinates: false,
                pos: -Figure.STEP_SIZE
            }
            figures.figureList[0] = this.movePlayer(figure, wrapper, figures.figureList[0]);
            if(!OurMovement.groupTileVisited){
                this.moveInGeneratedDirection(false, -Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
                this.onSplitField(wrapper);
            }
            else{
                OurMovement.groupTileVisited = false;
            }
  
            LevelFunctionsUpgraded.chainCharacters(figures, tiles);
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel, diff);
        }
        else if(direction === 'right') {
            ourGame.queenPos[0] += 1;
            const wrapper = {
                ourMap: ourMap,
                tiles: tiles,
                scene: scene,
                ourGame: ourGame,
                mapPosition: mapPosition,
                figures: figures.figureList
            }
            const figure = {
                coordinates: false,
                pos: Figure.STEP_SIZE
            }
            figures.figureList[0] = this.movePlayer(figure, wrapper, figures.figureList[0]);

            if(!OurMovement.groupTileVisited){
                this.moveInGeneratedDirection(false, Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
                this.onSplitField(wrapper);
            }
            else{
                OurMovement.groupTileVisited = false;
            }

            LevelFunctionsUpgraded.chainCharacters(figures, tiles);                
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel, diff);
        }
        else if(direction === 'down') {
            ourGame.queenPos[1] += 1;
            const wrapper = {
                ourMap: ourMap,
                tiles: tiles,
                scene: scene,
                ourGame: ourGame,
                mapPosition: mapPosition,
                figures: figures.figureList
            };
            const figure = {
                coordinates: true,
                pos: Figure.STEP_SIZE
            }
            figures.figureList[0] = this.movePlayer(figure, wrapper, figures.figureList[0]);

            if(!OurMovement.groupTileVisited){
                this.moveInGeneratedDirection(true, Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
                this.onSplitField(wrapper);
            }
            else{
                OurMovement.groupTileVisited = false;
            }

            LevelFunctionsUpgraded.chainCharacters(figures, tiles);                
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel, diff);
        }
        else if(direction === 'up') {
            ourGame.queenPos[1] -= 1;
            const wrapper = {
                ourMap: ourMap,
                tiles: tiles,
                scene: scene,
                ourGame: ourGame,
                mapPosition: mapPosition,
                figures: figures.figureList
            }
            const figure = {
                coordinates: true,
                pos: -Figure.STEP_SIZE
            }
            figures.figureList[0] = this.movePlayer(figure, wrapper, figures.figureList[0]);
            
            if(!OurMovement.groupTileVisited){
                this.moveInGeneratedDirection(true, -Figure.STEP_SIZE, figures, tiles, ourMap, scene, ourGame, mapPosition);
                this.onSplitField(wrapper);
            }
            else{
                OurMovement.groupTileVisited = false;
            } 
            
            LevelFunctionsUpgraded.chainCharacters(figures, tiles);                
            LevelFunctionsUpgraded.winConditionReachedCheck(ourGame, tiles, scene, nextLevel, diff);
        }
    }

    private static moveInGeneratedDirection(
        xory: boolean, 
        pos: number, 
        fig: Figures, 
        tiles: Tiles, 
        map: OurMap, 
        scene: Phaser.Scene, 
        ourGame: OurGame, 
        mapPosition: MapPosition): void {
        fig.figureList.forEach( (element) =>{
            if(element.isQueen == false){
                const wrapper = {
                    ourMap: map,
                    tiles: tiles,
                    scene: scene,
                    ourGame: ourGame,
                    mapPosition: mapPosition,
                    figures: fig.figureList
                };
                const figure = {
                    coordinates: xory,
                    pos: pos
                }
                element = this.movePlayer(figure, wrapper, element);
            }
        });
    }

    private static movePlayer(
        figure: {coordinates: boolean, pos: number}, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wrapper: any,
        element: Figure): Figure {

        const xory = figure.coordinates;
        const pos = figure.pos;

        const ourMap = wrapper.ourMap;
        const tiles = wrapper.tiles;
        const scene = wrapper.scene;
        const ourGame = wrapper.ourGame;
        const mapPosition = wrapper.mapPosition;
        const figuresList = wrapper.figures;
        
        let tile:Phaser.Tilemaps.Tile = null;
        let tileAction:Phaser.Tilemaps.Tile = null;
        let tilePr:Phaser.Tilemaps.Tile = null;
        let tileFr:Phaser.Tilemaps.Tile = null;
            

        // Determine if which axis we're moving on
        if (xory === false){
            tile = ourMap.layers.layerGround.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tileAction = ourMap.layers.layerAction.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tilePr = ourMap.layers.layerSplit.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
            tileFr = ourMap.layers.layerFragezeichen.getTileAtWorldXY(element.image.x+pos, element.image.y, true);
        } else {
            tile = ourMap.layers.layerGround.getTileAtWorldXY(element.image.x, element.image.y+pos, true); 
            tileAction = ourMap.layers.layerAction.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
            tilePr = ourMap.layers.layerSplit.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
            tileFr = ourMap.layers.layerFragezeichen.getTileAtWorldXY(element.image.x, element.image.y+pos, true);
        }
        // eslint-disable-next-line no-empty
        if (TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) === TileParser.WALL_ID) {} //blocked, can't move, do nothing
        else {   
            tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playersOnTopCounter--;
            const index: number = tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playerOnTopList.indexOf(element);
            tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playerOnTopList.splice(index, 1);

            if(element.isQueen && tiles.queenFieldIndicator != null){
                tiles.queenFieldIndicator.destroy();
            }
            
            if(xory === false){                 
                element.updateCoordinates(pos, 0);   
            } 
            else {
                element.updateCoordinates(0, pos);
            }

            tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playersOnTopCounter++;
            tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].playerOnTopList.push(element);


            const depth = 1;
            if(element.isQueen){
                tiles.queenFieldIndicator = scene.add.image(mapPosition.mapPosX + element.x + Figure.STEP_SIZE / 2, mapPosition.mapPosY + element.y + Figure.STEP_SIZE / 2,'red').setDepth(depth);
                if(tileAction.index == 178 && tileAction.visible){
                    tileAction.setVisible(false);
                    OurMovement.collectAllAliens(element, tiles, ourMap, figuresList);
                    OurMovement.groupTileVisited = true;
                }
                if (tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].fragezeichen){
                    tileFr.setVisible(false);
                }
                if(tiles.tilesList[(element.x + element.y * ourMap.layers.layerGround.layer.width)/32].splitField){
                    ourGame.splitFieldsToVisit--;
                    if(ourGame.splitFieldsToVisit >= 0){
                        ourGame.survivorScoreText.setText('Win condition: ' + ourGame.winCond + ' aliens and ' + ourGame.splitFieldsToVisit + ' split fields');
                    }
                }
            }

            if(!ourGame.gameFinished
                && TileParser.tileIDToAPIID_scifiLVL_Ground(tile.index) == TileParser.STOP_ID
                && element.isQueen) {

                ourGame.scoreText.setText('Your final score: ' + ourGame.score + "!");
                ourGame.gameFinished = true;
            }
            
            if(TileParser.tileIDToAPIID_scifiLVL_Action(tileAction.index) == TileParser.ACTIONFIELD_ID) {
                ourMap.layers.layerAction.removeTileAt(tileAction.x, tileAction.y, false, false);
                ourGame.score += 1;
                ourGame.scoreText.setText('Coins: ' + ourGame.score + '/3');
            }
        }
        return element;
    }

    private static onSplitField(
        wrapper: Wrapper) : void{
        const tiles: Tiles = wrapper.tiles;

        tiles.tilesList.forEach(tile => {
            if(tile.splitField){
                const perc = tile.splitPercentage;
                const num = tile.playersOnTopCounter;
                const playersToMove = Math.floor(perc * num);

                for (let i = 0; i < playersToMove; i++) {
                    const element: Figure = tile.playerOnTopList[tile.playerOnTopList.length - 1];
                    const figure = {
                        coordinates: false,
                        pos: 0
                    };
                    const dir = tile.splitDirection;

                    this.direction(figure, dir);
                    this.movePlayer(figure, wrapper, element);
                }
            }
        });
        
    }

    private static direction(figure: {
        coordinates: boolean, 
        pos: number}, 
    direction: number): void {
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


    private static collectAllAliens(element: Figure, tiles : Tiles, ourMap: OurMap, figures: Figure[]) : void {
        figures.forEach((fig) => {
            if(!fig.isQueen){
                this.removeFigureFromPreviousTile(ourMap, fig, tiles);
                this.updateFigureCoordinates(fig, element);
                this.addFiguretoNewTile(element, ourMap, tiles, fig);
            }
        });
    }

    private static removeFigureFromPreviousTile(ourMap: OurMap, fig: Figure, tiles: Tiles): void {
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

    private static addFiguretoNewTile(element: Figure, ourMap: OurMap, tiles: Tiles, fig: Figure): void {
        const width: number = ourMap.layers.layerGround.layer.width;
        const index = (element.x + element.y * width)/32;
        const targetTile = tiles.tilesList[index];

        targetTile.playersOnTopCounter++;
        targetTile.playerOnTopList.push(fig);

    }
}
