import { Canvas } from './Canvas.js'

export class Grid {
    constructor(gridContainer){
        this.gridContainer = gridContainer;
        this.canvasRenderer  = new Canvas(gridContainer, 24, 100)
        
    }
}