import { Canvas } from './Canvas.js'

export class Grid {
    constructor(gridContainer){
        this.gridContainer = gridContainer;
        this.canvasRenderer  = new Canvas(gridContainer, 100, 25)

        this.canvasRenderer.renderer()

        window.addEventListener('resize', this.reRender.bind(this));
    }

    reRender(event){
        this.canvasRenderer.renderer()
    }
}