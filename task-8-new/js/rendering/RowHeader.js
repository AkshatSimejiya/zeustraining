import { MainEngine } from "./MainEngine.js";
//Row Header responsible for rendering the rows canvas

export class RowHeader extends MainEngine {
    constructor(gridContainer, default_row_height=25, default_col_width=100, colInstance, rowsInstance) {
        super(gridContainer, colInstance, rowsInstance);

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
        this.canvas.setAttribute("id","rowheaderCanvas");
        this.ctx = this.canvas.getContext("2d")
        this.ctx.translate(0.5,0.5)

        this.setViewportSize();

        this.gridContainer.appendChild(this.canvas);

        this.renderer();
    }

    renderer(scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
        const dpr = window.devicePixelRatio || 1;

        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = this.row_header_width * dpr;
        this.canvas.height = (this.gridContainer.clientHeight - this.default_row_height)  * dpr;
        this.canvas.style.width = this.row_header_width + "px";
        this.canvas.style.height = (this.gridContainer.clientHeight - this.default_row_height) + "px";
        this.canvas.style.top = this.default_row_height + "px";
        this.canvas.style.left = "0px";
        this.ctx.scale(dpr, dpr);

        this.renderCanvas(this.ctx, scrollX, scrollY, rowStart, colStart, selection);
    }

    renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
        this.setViewportSize();

        ctx.clearRect(0, 0, this.row_header_width, this.viewPortHeight);
        
        ctx.lineWidth = 1 / window.devicePixelRatio;
        ctx.font = "12px Arial"
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, 0, this.row_header_width, this.viewPortHeight);

        if (selection && selection.selections && selection.selections.length > 0) {
            this.renderSelectionHighlights(ctx, scrollY, rowStart, selection);
        }

        let currentY = -scrollY;
        let rowIndex = rowStart;

        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.moveTo(this.row_header_width-0.5, 0);
        ctx.lineTo(this.row_header_width-0.5, this.viewPortHeight);
        
        currentY = -scrollY;
        rowIndex = rowStart;
        
        while (currentY < this.viewPortHeight && rowIndex < rowStart + 1000) {
            const rowHeight = this.rows.getRowHeight(rowIndex);
            if (currentY + rowHeight >= 0) {
                const label = rowIndex + 1;
                
                ctx.strokeStyle = "#d0d0d0";
                ctx.moveTo(0, currentY + rowHeight + 0.5);
                ctx.lineTo(this.row_header_width, currentY + rowHeight + 0.5);
                
                const isSelected = selection ? this.isRowInSelection(rowIndex, selection) : false;
                ctx.fillStyle = isSelected ? "#107C41" : "#000";
                
                ctx.fillText(label, ((this.row_header_width-5)-ctx.measureText(label).width), currentY + rowHeight / 2 + 4);
            }
            
            currentY += rowHeight;
            rowIndex++;
        }
        
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Render selection highlights for row headers
     */
    renderSelectionHighlights(ctx, scrollY, rowStart, selection) {
        if (!selection.selections || selection.selections.length === 0) return;

        for (const sel of selection.selections) {
            // Check if this selection affects any rows in the current viewport
            const selectionStartRow = sel.startRow;
            const selectionEndRow = sel.endRow;
            
            // Calculate the Y position for the selection highlight
            let highlightY = this.getRowYPosition(selectionStartRow, rowStart, scrollY);
            let highlightHeight = 0;
            
            // Calculate total height of selected rows
            for (let row = selectionStartRow; row <= selectionEndRow; row++) {
                highlightHeight += this.rows.getRowHeight(row);
            }
            
            // Only render if the selection is visible in the current viewport
            if (highlightY + highlightHeight >= 0 && highlightY < this.viewPortHeight) {
                // Clip to viewport bounds
                const startY = Math.max(0, highlightY);
                const endY = Math.min(this.viewPortHeight, highlightY + highlightHeight);
                const clippedHeight = endY - startY;
                
                if (clippedHeight > 0) {
                    // Draw selection highlight
                    ctx.fillStyle = "#CAEAD8";
                    ctx.fillRect(0, startY, this.row_header_width, clippedHeight);
                    
                    // Draw selection border only on right side
                    ctx.strokeStyle = "#107C41";
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(this.row_header_width, startY - 1);
                    ctx.lineTo(this.row_header_width, startY + clippedHeight + 2);
                    ctx.stroke();
                    ctx.lineWidth = 1 / window.devicePixelRatio; // Reset line width
                }
            }
        }
    }

    /**
     * Get Y position for a specific row
     */
    getRowYPosition(targetRow, rowStart, scrollY) {
        if (targetRow < rowStart) {
            // Row is above the viewport, calculate negative position
            let height = 0;
            for (let row = targetRow; row < rowStart; row++) {
                height += this.rows.getRowHeight(row);
            }
            return -height - scrollY;
        } else {
            // Row is in or below viewport, calculate positive position
            let height = -scrollY;
            for (let row = rowStart; row < targetRow; row++) {
                height += this.rows.getRowHeight(row);
            }
            return height;
        }
    }

    /**
     * Check if a row is part of any selection
     */
    isRowInSelection(row, selection) {
        if (!selection.selections) return false;
        
        return selection.selections.some(sel => 
            row >= sel.startRow && row <= sel.endRow
        );
    }

    /**
     * Calculate which row starts at a given absolute Y position
     * @param {number} absoluteY - Absolute Y position in the grid
     * @returns {object} - {rowStart: number, scrollY: number}
     */
    calculateRowPosition(absoluteY) {
        let cumulativeHeight = 0;
        let row = 0;
        
        while (cumulativeHeight + this.rows.getRowHeight(row) <= absoluteY) {
            cumulativeHeight += this.rows.getRowHeight(row);
            row++;
        }
        
        return {
            rowStart: row,
            scrollY: absoluteY - cumulativeHeight
        };
    }
}