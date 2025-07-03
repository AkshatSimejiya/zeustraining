export class MainEngine {

    constructor(gridContainer, colInstance, rowsInstance){

        this.gridContainer = gridContainer;
        this.cols = colInstance;
        
        this.rows = rowsInstance;

        this.setViewportSize();
    }

    setViewportSize(){
        const dpr = window.devicePixelRatio || 1;
        
        this.viewPortWidth = (this.gridContainer.clientWidth - this.row_header_width);
        this.viewPortHeight = (this.gridContainer.clientHeight - this.default_row_height) ;
    }

    getCanvas(){
        return this.canvas;
    }
}