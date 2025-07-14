import { MainEngine } from "./MainEngine.js";

export class RowHeader extends MainEngine {

    /**
     * Initializes the RowHeader instance which will be responsible for rendering the row headers in the grid.
     * @param {*} gridContainer the grid container holding the row headers
     * @param {*} default_row_height default height of rows
     * @param {*} default_col_width default width of columns
     * @param {*} colInstance the column instance for managing column-related data
     * @param {*} rowsInstance the rows instance for managing row-related data
     */
    constructor(gridContainer, default_row_height=25, default_col_width=100, rowsInstance) {
        super(gridContainer, null, rowsInstance);

        this.viewPortWidth = 0;
        this.viewPortHeight = 0;

        this.row_header_width = 30;
        this.default_row_height = default_row_height;
        this.default_col_width = default_col_width;

        this.init()
    }

    /**
     * Initializes the canvas and sets up the rendering context.
     */
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

    /**
     * Renders the row headers on the canvas.
     * @param {number} scrollX the scrollX position
     * @param {number} scrollY the scrollY position
     * @param {number} rowStart The Starting row index for rendering
     * @param {number} colStart The Starting column index for rendering
     * @param {Object} selection The selection object
     */
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

    /**
     * Renders the row headers on the canvas.
     * @param {*} ctx the canvas context
     * @param {*} scrollX the scrollX position
     * @param {*} scrollY the scrollY position
     * @param {*} rowStart The Starting row index for rendering
     * @param {*} colStart The Starting column index for rendering
     * @param {*} selection The selection object
     */
    renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
        this.setViewportSize();

        ctx.clearRect(0, 0, this.row_header_width, this.viewPortHeight);
        
        ctx.lineWidth = 1 / window.devicePixelRatio;
        ctx.font = "12px Arial"
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, 0, this.row_header_width , this.viewPortHeight);

        let currentY = -scrollY;
        let rowIndex = rowStart;

        ctx.beginPath();
        ctx.strokeStyle = "#d0d0d0";
        ctx.moveTo(this.row_header_width-0.5, 0);
        ctx.lineTo(this.row_header_width-0.5, this.viewPortHeight);
        ctx.stroke();
        ctx.closePath();

        currentY = -scrollY;
        rowIndex = rowStart;
        
        ctx.beginPath();
        ctx.strokeStyle = "#d0d0d0";
        
        while (currentY < this.viewPortHeight && rowIndex < rowStart + 1000) {
            const rowHeight = this.rows.getRowHeight(rowIndex);
            if (currentY + rowHeight >= 0) {
                ctx.moveTo(0, currentY + rowHeight + 0.5);
                ctx.lineTo(this.row_header_width, currentY + rowHeight + 0.5);
            }
            
            currentY += rowHeight;
            rowIndex++;
        }
        
        ctx.stroke();
        ctx.closePath();
        
        
        if (selection && selection.selections && selection.selections.length > 0) {
            this.renderSelectionHighlights(ctx, scrollY, rowStart, selection);
        }
        
        currentY = -scrollY;
        rowIndex = rowStart;
        const isColSelection = selection && selection.selections && selection.selections.length > 0 && selection.selections[0].type === 'column';
        const isRowSelection = selection && selection.selections && selection.selections.length > 0 && selection.selections[0].type === 'row';
        const isCellSelection = selection && selection.selections && selection.selections.length > 0 && selection.selections[0].type === 'cell';
        
        while (currentY < this.viewPortHeight && rowIndex < rowStart + 1000) {
            const rowHeight = this.rows.getRowHeight(rowIndex);
            if (currentY + rowHeight >= 0) {
                const label = rowIndex + 1;
                const isSelected = selection ? this.isRowInSelection(rowIndex, selection) : false;

                if (isRowSelection && isSelected) {
                    ctx.fillStyle = "#107C41";
                    ctx.fillRect(0, currentY, this.row_header_width - 2, rowHeight);
                    ctx.fillStyle = "#ffffff"; 
                } else if (isCellSelection && isSelected) {
                    ctx.strokeStyle = "#a3d8ba";
                    ctx.lineWidth = 2;
                    ctx.lineWidth = 1 / window.devicePixelRatio;
                    ctx.fillStyle = "#0E703C";
                } else if (isColSelection) {
                    ctx.fillStyle = "#0E703C";
                } else {
                    ctx.fillStyle = "#000";
                }

                ctx.fillText(label, ((this.row_header_width - 5) - ctx.measureText(label).width), currentY + rowHeight / 2 + 4);

                ctx.beginPath();
                ctx.strokeStyle = (isSelected) ? "#a3d8ba" : "#d0d0d0";
                ctx.moveTo(0, currentY + rowHeight + 0.5);

                ctx.lineTo(this.row_header_width - 2, currentY + rowHeight + 0.5);
                ctx.stroke();
                ctx.closePath();
            }
            currentY += rowHeight;
            rowIndex++;
        }
    }

    /**
     * Renders selection highlights in the row header.
     * @param {*} ctx the canvas context
     * @param {number} scrollY the scrollY position
     * @param {number} rowStart The Starting row index for rendering
     * @param {Object} selection The selection object
     * @returns 
     */
    renderSelectionHighlights(ctx, scrollY, rowStart, selection) {
        if (!selection.selections || selection.selections.length === 0) return;

        if (selection.selections[0].type === 'column') {
            let currentY = -scrollY;
            let rowIndex = rowStart;
            while (currentY < this.viewPortHeight && rowIndex < rowStart + 1000) {
                const rowHeight = this.rows.getRowHeight(rowIndex);
                if (currentY + rowHeight >= 0) {
                    ctx.fillStyle = "#CAEAD8";
                    ctx.fillRect(0, currentY, this.row_header_width, rowHeight);
                    ctx.strokeStyle = "#107C41";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(this.row_header_width - 1, currentY);
                    ctx.lineTo(this.row_header_width - 1, currentY + rowHeight);
                    ctx.stroke();
                    ctx.lineWidth = 1 / window.devicePixelRatio;
                }
                currentY += rowHeight;
                rowIndex++;
            }
            return;
        }

        for (const sel of selection.selections) {
            const selectionStartRow = sel.startRow;
            const selectionEndRow = sel.endRow;
            let highlightY = this.getRowYPosition(selectionStartRow, rowStart, scrollY) + 1;
            let highlightHeight = 0;
            for (let row = selectionStartRow; row <= selectionEndRow; row++) {
                highlightHeight += this.rows.getRowHeight(row);
            }
            if (highlightY + highlightHeight >= 0 && highlightY < this.viewPortHeight) {
                const startY = Math.max(0, highlightY);
                const endY = Math.min(this.viewPortHeight, highlightY + highlightHeight);
                const clippedHeight = endY - startY;
                if (clippedHeight > 0) {
                    ctx.fillStyle = "#CAEAD8";
                    ctx.fillRect(0, startY, this.row_header_width, clippedHeight);
                    
                    ctx.strokeStyle = "#107C41";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(this.row_header_width - 1, startY - 1);
                    ctx.lineTo(this.row_header_width - 1, startY + clippedHeight + 1);
                    ctx.stroke();
                    ctx.lineWidth = 1 / window.devicePixelRatio;
                }
            }
        }
    }

    /**
     * get the Y position of a specific row in the grid.
     * @param {number} targetRow The row index to find the Y position for
     * @param {number} rowStart The starting row index for the current viewport
     * @param {number} scrollY The scrollY position
     * @returns {number} - The Y position of the target row relative to the viewport
     */
    getRowYPosition(targetRow, rowStart, scrollY) {
        if (targetRow < rowStart) {
            let height = 0;
            for (let row = targetRow; row < rowStart; row++) {
                height += this.rows.getRowHeight(row);
            }
            return -height - scrollY;
        } else {
            let height = -scrollY;
            for (let row = rowStart; row < targetRow; row++) {
                height += this.rows.getRowHeight(row);
            }
            return height;
        }
    }

    /**
     * Check if a row is part of any selection
     * @param {number} row The row index to check
     * @param {Object} selection The selection object
     * @returns {boolean} True if the row is in the selection, false otherwise
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