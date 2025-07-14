import { MainEngine } from "./MainEngine.js";

export class ColumnHeader extends MainEngine {

    /**
     * Initializes the ColumnHeader instance
     * @param {*} gridContainer The main container holding the grid
     * @param {*} default_row_height Default height of each row
     * @param {*} default_col_width Default width of each column
     * @param {*} colInstance The column instance
     */
    constructor(gridContainer, default_row_height=25, default_col_width=100, colInstance) {
        super(gridContainer,colInstance, null);

        this.viewPortWidth = 0;
        this.viewPortHeight = 0;

        this.row_header_width = 30;
        this.default_row_height = default_row_height;
        this.default_col_width = default_col_width;

        this.init()
    }

    /**
     * Method to set the canvas and append it to the grid container
     */
    init(){
        this.dpr = window.devicePixelRatio || 1;

        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id","columnheaderCanvas");
        this.ctx = this.canvas.getContext("2d")
        this.ctx.translate(0.5,0.5)

        this.setViewportSize();

        this.gridContainer.appendChild(this.canvas);

        this.renderer();
    }

    /**
     * Renderer method to draw and update the column header
     * @param {number} scrollX The horizontal scroll position
     * @param {number} scrollY The vertical scroll position
     * @param {number} rowStart Starting row index for rendering
     * @param {number} colStart Starting column index for rendering
     * @param {object} selection The current selection object
     */
    renderer(scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
        const dpr = window.devicePixelRatio || 1;

        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.canvas.height = (this.default_row_height)  * dpr;
        this.canvas.style.width = (this.gridContainer.clientWidth - this.row_header_width)+ "px";
        this.canvas.style.height = this.default_row_height + "px";
        this.canvas.style.top =  "0px";
        this.canvas.style.left = this.row_header_width +"px";
        this.ctx.scale(dpr, dpr);

        this.renderCanvas(this.ctx, scrollX, scrollY, rowStart, colStart, selection);
    }

    /**
     * Method to render the components of column header on the canvas such as lines, text, and selection highlights.
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     * @param {number} scrollX The horizontal scroll position
     * @param {number} scrollY The vertical scroll position
     * @param {number} rowStart Starting row index for rendering
     * @param {number} colStart Starting column index for rendering
     * @param {object} selection The current selection object
     */
    renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
        this.setViewportSize();
        ctx.clearRect(0, 0, this.viewPortWidth, this.default_row_height);
        
        ctx.lineWidth = 1  / window.devicePixelRatio;
        ctx.font = "12px Arial"
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#F5F5F5";
        ctx.textBaseline = "middle";
        ctx.fillRect(0, 0, this.viewPortWidth, this.default_row_height);

        let currentX = -scrollX;
        let colIndex = colStart;
        
        // Draw bottom border
        ctx.beginPath();
        ctx.strokeStyle = "#d0d0d0";
        ctx.moveTo(0, this.default_row_height-0.5);
        ctx.lineTo(this.viewPortWidth, this.default_row_height-0.5);
        ctx.stroke();
        ctx.closePath();

        // Draw vertical lines
        currentX = -scrollX;
        colIndex = colStart;
        
        ctx.beginPath();
        ctx.strokeStyle = "#d0d0d0";
        
        while (currentX < this.viewPortWidth && colIndex < colStart + 1000) {
            const colWidth = this.cols.getColumnWidth(colIndex);
            
            if (currentX + colWidth >= 0) {
                ctx.moveTo(currentX + colWidth + 0.5, 0);
                ctx.lineTo(currentX + colWidth + 0.5, this.default_row_height);
            }
            
            currentX += colWidth;
            colIndex++;
        }
        
        ctx.stroke();
        ctx.closePath();

        // Render selection highlights
        if (selection && selection.selections && selection.selections.length > 0) {
            this.renderSelectionHighlights(ctx, scrollX, colStart, selection);
        }

        // Draw column labels
        currentX = -scrollX;
        colIndex = colStart;
        
        const isColSelection = selection && selection.selections && selection.selections.length > 0 && selection.selections[0].type === 'column';
        const isRowSelection = selection && selection.selections && selection.selections.length > 0 && selection.selections[0].type === 'row';
        const isCellSelection = selection && selection.selections && selection.selections.length > 0 && selection.selections[0].type === 'cell';
        
        while (currentX < this.viewPortWidth && colIndex < colStart + 1000) {
            const colWidth = this.cols.getColumnWidth(colIndex);
            
            if (currentX + colWidth >= 0) {
                const label = this.columnLabel(colIndex);
                const isSelected = selection ? this.isColumnInSelection(colIndex, selection) : false;

                if (isColSelection && isSelected) {
                    ctx.fillStyle = "#107C41";
                    ctx.fillRect(currentX, 0, colWidth, this.default_row_height - 2);
                    ctx.fillStyle = "#ffffff"; 
                } else if (isCellSelection && isSelected) {
                    ctx.strokeStyle = "#a3d8ba";
                    ctx.lineWidth = 2;
                    ctx.lineWidth = 1 / window.devicePixelRatio;
                    ctx.fillStyle = "#0E703C";
                } else if (isRowSelection) {
                    ctx.fillStyle = "#0E703C";
                } else {
                    ctx.fillStyle = "#000";
                }
                
                ctx.fillText(label, currentX + colWidth / 2 - ctx.measureText(label).width / 2, this.default_row_height / 2);

                // Draw vertical line with selection color if selected
                ctx.beginPath();
                ctx.strokeStyle = (isRowSelection || isSelected) ? "#a3d8ba" : "#d0d0d0";
                ctx.moveTo(currentX + colWidth + 0.5, 0);
                ctx.lineTo(currentX + colWidth + 0.5, this.default_row_height - 2);
                ctx.stroke();
                ctx.closePath();
            }
            
            currentX += colWidth;
            colIndex++;
        }
    }


    /**
     * Function to render the selection highlights on the column header
     * @param {CanvasRenderingContext2D} ctx The canvas rendering context
     * @param {number} scrollX The horizontal scroll position
     * @param {number} colStart Starting column index for rendering
     * @param {object} selection The current selection object
     */
    renderSelectionHighlights(ctx, scrollX, colStart, selection) {
        if (!selection.selections || selection.selections.length === 0) return;

        if (selection.selections[0].type === 'row') {
            let currentX = -scrollX;
            let colIndex = colStart;
            while (currentX < this.viewPortWidth && colIndex < colStart + 1000) {
                const colWidth = this.cols.getColumnWidth(colIndex);
                if (currentX + colWidth >= 0) {
                    ctx.fillStyle = "#CAEAD8";
                    ctx.fillRect(currentX, 0, colWidth, this.default_row_height);
                    ctx.strokeStyle = "#107C41";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(currentX, this.default_row_height - 1);
                    ctx.lineTo(currentX + colWidth, this.default_row_height - 1);
                    ctx.stroke();
                    ctx.lineWidth = 1 / window.devicePixelRatio;
                }
                currentX += colWidth;
                colIndex++;
            }
            return;
        }

        for (const sel of selection.selections) {
            const selectionStartCol = sel.startCol;
            const selectionEndCol = sel.endCol;
            
            let highlightX = this.getColumnXPosition(selectionStartCol, colStart, scrollX);
            let highlightWidth = 0;
            
            for (let col = selectionStartCol; col <= selectionEndCol; col++) {
                highlightWidth += this.cols.getColumnWidth(col);
            }
            
            if (highlightX + highlightWidth >= 0 && highlightX < this.viewPortWidth) {
                const startX = Math.max(0, highlightX);
                const endX = Math.min(this.viewPortWidth, highlightX + highlightWidth);
                const clippedWidth = endX - startX;
                
                if (clippedWidth > 0) {
                    ctx.fillStyle = "#CAEAD8";
                    ctx.fillRect(startX, 0, clippedWidth, this.default_row_height);
                    
                    ctx.strokeStyle = "#107C41";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(startX - 1, this.default_row_height - 1);
                    ctx.lineTo(startX + clippedWidth + 1, this.default_row_height - 1);
                    ctx.stroke();
                    ctx.lineWidth = 1 / window.devicePixelRatio;
                }
            }
        }
    }

    /**
     * Get X position for a specific column
     * @param {number} targetCol the target column index
     * @param {number} colStart the starting column index for the viewport
     * @param {number} scrollX the current horizontal scroll position
     * @returns {number} - The X position of the column
     */
    getColumnXPosition(targetCol, colStart, scrollX) {
        if (targetCol < colStart) {
            let width = 0;
            for (let col = targetCol; col < colStart; col++) {
                width += this.cols.getColumnWidth(col);
            }
            return -width - scrollX;
        } else {
            let width = -scrollX;
            for (let col = colStart; col < targetCol; col++) {
                width += this.cols.getColumnWidth(col);
            }
            return width;
        }
    }

    /**
     * Check if the given column is in selection or not
     * @param {number} col The column index to check
     * @param {object} selection The selection object
     * @returns {boolean} - True if the column is in selection, false otherwise
     */
    isColumnInSelection(col, selection) {
        if (!selection.selections) return false;
        
        return selection.selections.some(sel => 
            col >= sel.startCol && col <= sel.endCol
        );
    }

    /**
     * Calculate which column starts at a given absolute X position
     * @param {number} absoluteX - Absolute X position in the grid
     * @returns {object} - {colStart: number, scrollX: number}
     */
    calculateColumnPosition(absoluteX) {
        let cumulativeWidth = 0;
        let col = 0;
        
        while (cumulativeWidth + this.cols.getColumnWidth(col) <= absoluteX) {
            cumulativeWidth += this.cols.getColumnWidth(col);
            col++;
        }
        
        return {
            colStart: col,
            scrollX: absoluteX - cumulativeWidth
        };
    }

    /**
     * Get the label for a specific column index
     * @param {number} index 
     * @returns {string} - The column label (e.g., "A", "B", "C", ...)
     */
    columnLabel(index) {
        let label = "";
        while (index >= 0) {
            label = String.fromCharCode((index % 26) + 65) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    }   
}