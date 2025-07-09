
// import { MainEngine } from "./MainEngine.js";

// export class ColumnHeader extends MainEngine {
//     constructor(gridContainer, default_row_height=25, default_col_width=100, colInstance) {
//         super(gridContainer,colInstance);

//         this.viewPortWidth = 0;
//         this.viewPortHeight = 0;

//         this.row_header_width = 30;
//         this.default_row_height = default_row_height;
//         this.default_col_width = default_col_width;

//         this.init()
//     }

//     init(){
//         this.dpr = window.devicePixelRatio || 1;

//         this.canvas = document.createElement("canvas");
//         this.canvas.setAttribute("id","columnheaderCanvas");
//         this.ctx = this.canvas.getContext("2d")
//         this.ctx.translate(0.5,0.5)

//         this.setViewportSize();

//         this.gridContainer.appendChild(this.canvas);

//         this.renderer();
//     }

//     renderer(scrollX=0, scrollY=0, rowStart=0, colStart=0){
//         const dpr = window.devicePixelRatio || 1;


//         this.ctxC = this.canvas.getContext("2d")
//         this.canvas.width = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
//         this.canvas.height = (this.default_row_height)  * dpr;
//         this.canvas.style.width = (this.gridContainer.clientWidth - this.row_header_width)+ "px";
//         this.canvas.style.height = this.default_row_height + "px";
//         this.canvas.style.top =  "0px";
//         this.canvas.style.left = this.row_header_width +"px";
//         this.ctx.scale(dpr, dpr);

//         this.renderCanvas(this.ctx, scrollX, scrollY, rowStart, colStart);

//     }

//     renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0,colStart=0){

//         this.setViewportSize();
//         ctx.clearRect(0, 0, this.row_header_width, this.viewPortHeight);
        
//         ctx.lineWidth = 1  / window.devicePixelRatio;
//         ctx.font = "12px Arial"
//         ctx.strokeStyle = "#d0d0d0";
//         ctx.fillStyle = "#F5F5F5";
//         ctx.textBaseline = "middle";
//         ctx.fillRect(0, 0, this.viewPortWidth, this.default_row_height);

//         let currentX = -scrollX;
//         let colIndex = colStart;
        
//         ctx.beginPath();
//         ctx.fillStyle = "#000";
//         ctx.moveTo(0, this.default_row_height-0.5);
//         ctx.lineTo(this.viewPortWidth, this.default_row_height-0.5);
//         while (currentX < this.viewPortWidth && colIndex < colStart + 1000) {
//             const colWidth = this.cols.getColumnWidth(colIndex);
            
//             if (currentX + colWidth >= 0) {
                
//                 const label = this.columnLabel(colIndex);
//                 ctx.fillText(label, currentX + colWidth / 2, this.default_row_height / 2);
                
//                 ctx.moveTo(currentX + colWidth + 0.5, 0);
//                 ctx.lineTo(currentX + colWidth + 0.5, this.default_row_height);
//             }
            
//             currentX += colWidth;
//             colIndex++;
//         }
        
//         ctx.stroke();
//         ctx.closePath();
//     }

//     columnLabel(index) {
//         let label = "";
//         while (index >= 0) {
//             label = String.fromCharCode((index % 26) + 65) + label;
//             index = Math.floor(index / 26) - 1;
//         }
//         return label;
//     }   
// }

import { MainEngine } from "./MainEngine.js";

export class ColumnHeader extends MainEngine {
    constructor(gridContainer, default_row_height=25, default_col_width=100, colInstance) {
        super(gridContainer,colInstance);

        this.viewPortWidth = 0;
        this.viewPortHeight = 0;

        this.row_header_width = 30;
        this.default_row_height = default_row_height;
        this.default_col_width = default_col_width;

        this.init()
    }

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

    renderer(scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
        const dpr = window.devicePixelRatio || 1;

        this.ctxC = this.canvas.getContext("2d")
        this.canvas.width = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.canvas.height = (this.default_row_height)  * dpr;
        this.canvas.style.width = (this.gridContainer.clientWidth - this.row_header_width)+ "px";
        this.canvas.style.height = this.default_row_height + "px";
        this.canvas.style.top =  "0px";
        this.canvas.style.left = this.row_header_width +"px";
        this.ctx.scale(dpr, dpr);

        this.renderCanvas(this.ctx, scrollX, scrollY, rowStart, colStart, selection);
    }

    // renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
    //     this.setViewportSize();
    //     ctx.clearRect(0, 0, this.viewPortWidth, this.default_row_height);
        
    //     ctx.lineWidth = 1  / window.devicePixelRatio;
    //     ctx.font = "12px Arial"
    //     ctx.strokeStyle = "#d0d0d0";
    //     ctx.fillStyle = "#F5F5F5";
    //     ctx.textBaseline = "middle";
    //     ctx.fillRect(0, 0, this.viewPortWidth, this.default_row_height);

    //     // FIRST: Draw selection highlights BEFORE text
    //     if (selection && selection.selections && selection.selections.length > 0) {
    //         this.renderSelectionHighlights(ctx, scrollX, colStart, selection);
    //     }

    //     let currentX = -scrollX;
    //     let colIndex = colStart;
        
    //     // SECOND: Draw borders and text (this will render on top of highlights)
    //     ctx.beginPath();
    //     ctx.fillStyle = "#000";
    //     ctx.moveTo(0, this.default_row_height-0.5);
    //     ctx.lineTo(this.viewPortWidth, this.default_row_height-0.5);
        
    //     currentX = -scrollX;
    //     colIndex = colStart;
        
    //     while (currentX < this.viewPortWidth && colIndex < colStart + 1000) {
    //         const colWidth = this.cols.getColumnWidth(colIndex);
            
    //         if (currentX + colWidth >= 0) {
    //             const label = this.columnLabel(colIndex);
                
    //             // Check if this column is selected to adjust text color
    //             const isSelected = selection ? this.isColumnInSelection(colIndex, selection) : false;
    //             ctx.fillStyle = isSelected ? "#107C41" : "#000";
                
    //             ctx.fillText(label, currentX + colWidth / 2, this.default_row_height / 2);
                
    //             ctx.strokeStyle = "#d0d0d0";
    //             ctx.moveTo(currentX + colWidth + 0.5, 0);
    //             ctx.lineTo(currentX + colWidth + 0.5, this.default_row_height);
    //         }
            
    //         currentX += colWidth;
    //         colIndex++;
    //     }
        
    //     ctx.stroke();
    //     ctx.closePath();
    // }

    renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
        this.setViewportSize();
        ctx.clearRect(0, 0, this.viewPortWidth, this.default_row_height);
        
        ctx.lineWidth = 1  / window.devicePixelRatio;
        ctx.font = "12px Arial"
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#F5F5F5";
        ctx.textBaseline = "middle";
        ctx.fillRect(0, 0, this.viewPortWidth, this.default_row_height);

        // FIRST: Draw all lines (bottom layer)
        let currentX = -scrollX;
        let colIndex = colStart;
        
        ctx.beginPath();
        ctx.strokeStyle = "#d0d0d0";
        
        // Draw bottom horizontal line
        ctx.moveTo(0, this.default_row_height-0.5);
        ctx.lineTo(this.viewPortWidth, this.default_row_height-0.5);
        
        // Draw vertical lines
        currentX = -scrollX;
        colIndex = colStart;
        
        while (currentX < this.viewPortWidth && colIndex < colStart + 1000) {
            const colWidth = this.cols.getColumnWidth(colIndex);
            
            if (currentX + colWidth >= 0) {
                // Draw vertical line at right of column
                ctx.moveTo(currentX + colWidth + 0.5, 0);
                ctx.lineTo(currentX + colWidth + 0.5, this.default_row_height);
            }
            
            currentX += colWidth;
            colIndex++;
        }
        
        ctx.stroke();
        ctx.closePath();

        // SECOND: Draw selection highlights (middle layer)
        if (selection && selection.selections && selection.selections.length > 0) {
            this.renderSelectionHighlights(ctx, scrollX, colStart, selection);
        }

        // THIRD: Draw text (top layer)
        currentX = -scrollX;
        colIndex = colStart;
        
        while (currentX < this.viewPortWidth && colIndex < colStart + 1000) {
            const colWidth = this.cols.getColumnWidth(colIndex);
            
            if (currentX + colWidth >= 0) {
                const label = this.columnLabel(colIndex);
                
                // Check if this column is selected to adjust text color
                const isSelected = selection ? this.isColumnInSelection(colIndex, selection) : false;
                ctx.fillStyle = isSelected ? "#107C41" : "#000";
                
                ctx.fillText(label, currentX + colWidth / 2, this.default_row_height / 2);
            }
            
            currentX += colWidth;
            colIndex++;
        }
    }


    /**
     * Render selection highlights for column headers
     */
    renderSelectionHighlights(ctx, scrollX, colStart, selection) {
        if (!selection.selections || selection.selections.length === 0) return;

        for (const sel of selection.selections) {
            // Check if this selection affects any columns in the current viewport
            const selectionStartCol = sel.startCol;
            const selectionEndCol = sel.endCol;
            
            // Calculate the X position for the selection highlight
            let highlightX = this.getColumnXPosition(selectionStartCol, colStart, scrollX);
            let highlightWidth = 0;
            
            // Calculate total width of selected columns
            for (let col = selectionStartCol; col <= selectionEndCol; col++) {
                highlightWidth += this.cols.getColumnWidth(col);
            }
            
            // Only render if the selection is visible in the current viewport
            if (highlightX + highlightWidth >= 0 && highlightX < this.viewPortWidth) {
                // Clip to viewport bounds
                const startX = Math.max(0, highlightX);
                const endX = Math.min(this.viewPortWidth, highlightX + highlightWidth);
                const clippedWidth = endX - startX;
                
                if (clippedWidth > 0) {
                    // Draw selection highlight
                    ctx.fillStyle = this.getSelectionColor(sel);
                    ctx.fillRect(startX, 0, clippedWidth, this.default_row_height);
                    
                    // Draw selection border only on bottom side
                    ctx.strokeStyle = "#107C41";
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(startX - 1, this.default_row_height);
                    ctx.lineTo(startX + clippedWidth + 2, this.default_row_height);
                    ctx.stroke();
                    ctx.lineWidth = 1 / window.devicePixelRatio; // Reset line width
                }
            }
        }
    }

    /**
     * Get X position for a specific column
     */
    getColumnXPosition(targetCol, colStart, scrollX) {
        if (targetCol < colStart) {
            // Column is to the left of the viewport, calculate negative position
            let width = 0;
            for (let col = targetCol; col < colStart; col++) {
                width += this.cols.getColumnWidth(col);
            }
            return -width - scrollX;
        } else {
            // Column is in or to the right of viewport, calculate positive position
            let width = -scrollX;
            for (let col = colStart; col < targetCol; col++) {
                width += this.cols.getColumnWidth(col);
            }
            return width;
        }
    }

    /**
     * Check if a column is part of any selection
     */
    isColumnInSelection(col, selection) {
        if (!selection.selections) return false;
        
        return selection.selections.some(sel => 
            col >= sel.startCol && col <= sel.endCol
        );
    }

    /**
     * Get selection color based on selection type
     */
    getSelectionColor(selection) {
        if (selection.type === 'column') {
            return "#CAEAD8"; // Blue for column selection
        } else if (selection.type === 'cell') {
            return "#CAEAD8"; // Lighter blue for cell selection
        }
        return "#CAEAD8"; // Default
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

    columnLabel(index) {
        let label = "";
        while (index >= 0) {
            label = String.fromCharCode((index % 26) + 65) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    }   
}