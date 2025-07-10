export class MainEngine {

    /**
     * Initializes the MainEngine instance for rendering classes such as Rows, Columns, and Canvas.
     * @param {*} gridContainer The grid container element which will hold all the canvases
     * @param {*} colInstance The column instance for managing column-related data
     * @param {*} rowsInstance The rows instance for managing row-related data
     */
    constructor(gridContainer, colInstance = null, rowsInstance = null){

        this.gridContainer = gridContainer;
        this.cols = colInstance;
        
        this.rows = rowsInstance;

        this.setViewportSize();
    }

    /**
     * Setting the viewport size based on the zoom level and the grid container dimensions.
     */
    setViewportSize(){
        const dpr = window.devicePixelRatio || 1;
        
        this.viewPortWidth = (this.gridContainer.clientWidth - this.row_header_width);
        this.viewPortHeight = (this.gridContainer.clientHeight - this.default_row_height) ;
    }

    /**
     * Helper function to get the canvas if needed somewhere. Not in any use right now
     * @returns {HTMLCanvasElement} The canvas element used for rendering
     */
    getCanvas(){
        return this.canvas;
    }
}