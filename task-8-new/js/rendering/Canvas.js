import { MainEngine } from "./MainEngine.js";

export class Canvas extends MainEngine {

    /**
     * Initialize the Canvas class to handle rendering of the grid
     * @param {HTMLElement} gridContainer the main element for the grid
     * @param {number} default_row_height the default height for each row
     * @param {number} default_col_width the default width for each column
     * @param {*} colInstance the column instance
     * @param {*} rowsInstance the rows instance
     */
    constructor(gridContainer, default_row_height=25, default_col_width=100, colInstance, rowsInstance) {
        super(gridContainer, colInstance, rowsInstance);

        this.viewPortWidth = 0;
        this.viewPortHeight = 0;

        this.row_header_width = 30;
        this.default_row_height = default_row_height;
        this.default_col_width = default_col_width;

        this.selectionPos = {};

        this.init()
    }

    /**
     * Initialize the canvas for rendering initially
     */
    init(){
        this.dpr = window.devicePixelRatio || 1;

        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "gridCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.translate(0.5,0.5)

        this.setViewportSize();

        this.gridContainer.appendChild(this.canvas);

        this.renderer();
    }

    /**
     * Set the data source instance for the grid
     * @param {*} datastore datastore instance to be used for fetching cell values
     */
    setDatastore(datastore) {
        this.datastore = datastore;
    }

    /**
     * Renderer function which will be called to render the grid
     * @param {number} scrollX The scrollX position of the grid
     * @param {number} scrollY The scrollY position of the grid
     * @param {number} rowStart The starting row index
     * @param {number} colStart The starting column index
     * @param {Object} selection The selection object
     */
    renderer(scrollX=0, scrollY=0, rowStart=0, colStart=0,  selection = null){
        const dpr = window.devicePixelRatio || 1;


        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.canvas.height = (this.gridContainer.clientHeight - this.default_row_height) * dpr;
        this.canvas.style.width = (this.gridContainer.clientWidth - this.row_header_width) + "px";
        this.canvas.style.height = (this.gridContainer.clientHeight - this.default_row_height) + "px";
        this.canvas.style.top = this.default_row_height + "px";
        this.canvas.style.left = this.row_header_width + "px";
        this.ctx.scale(dpr, dpr);

        this.renderCanvas(this.ctx, scrollX, scrollY, rowStart, colStart, selection);
    }

    /**
     * Render the grid on the canvas
     * @param {canvascontext} ctx context of the canvas to render
     * @param {number} scrollX The scrollX position of the grid
     * @param {number} scrollY The scrollY position of the grid
     * @param {number} rowStart The starting row index
     * @param {number} colStart The starting column index
     * @param {Object} selection The selection object
     */
    renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
        this.setViewportSize();
        ctx.clearRect(0, 0, this.viewPortWidth, this.viewPortHeight);

        
        let visibleRows = [];
        let visibleCols = [];
        let currentY = -scrollY;
        let currentX = -scrollX;
        let rowIndex = rowStart;
        let colIndex = colStart;
        
        while (currentY < this.viewPortHeight && rowIndex < rowStart + 100) {
            const rowHeight = this.rows.getRowHeight(rowIndex);
            if (currentY + rowHeight >= 0) {
                visibleRows.push({ index: rowIndex, y: currentY, height: rowHeight });
            }
            currentY += rowHeight;
            rowIndex++;
        }
        while (currentX < this.viewPortWidth && colIndex < colStart + 100) {
            const colWidth = this.cols.getColumnWidth(colIndex);
            if (currentX + colWidth >= 0) {
                visibleCols.push({ index: colIndex, x: currentX, width: colWidth });
            }
            currentX += colWidth;
            colIndex++;
        }

        ctx.lineWidth = 1 / window.devicePixelRatio;
        ctx.font = "12px Arial";
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#000";

        ctx.beginPath();
        
        for (let row of visibleRows) {
            ctx.moveTo(0, row.y + row.height + 0.5);
            ctx.lineTo(this.viewPortWidth, row.y + row.height + 0.5);
        }
        
        for (let col of visibleCols) {
            ctx.moveTo(col.x + col.width + 0.5, 0);
            ctx.lineTo(col.x + col.width + 0.5, this.viewPortHeight);
        }
        
        ctx.stroke();
        ctx.closePath();

        
        if (selection) {
            for (let sel of selection.selections) {
                const type = sel.type || "cell";
                let startRow = sel.startRow;
                let endRow = sel.endRow;
                let startCol = sel.startCol;
                let endCol = sel.endCol;

                if (type === "row") {
                    startCol = 0;
                    endCol = visibleCols[visibleCols.length - 1]?.index ?? startCol;
                } else if (type === "column") {
                    startRow = 0;
                    endRow = visibleRows[visibleRows.length - 1]?.index ?? startRow;
                }

                const activeRow = sel.activeRow || startRow;
                const activeCol = sel.activeCol || startCol;
                const isSingleCell = (startRow === endRow && startCol === endCol);
                
                if (isSingleCell) {
                    const visibleRow = visibleRows.find(r => r.index === startRow);
                    const visibleCol = visibleCols.find(c => c.index === startCol);
                    
                    if (visibleRow && visibleCol) {
                        const rowY = visibleRow.y;
                        const colX = visibleCol.x;
                        const rowHeight = visibleRow.height;
                        const colWidth = visibleCol.width;
                        
                        ctx.strokeStyle = "#147E43";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(colX, rowY, colWidth, rowHeight);
                        
                        
                        if (!selection.isEditing) {
                            ctx.fillStyle = "#147E43";
                            ctx.fillRect(colX + colWidth - 4, rowY + rowHeight - 4, 8, 8);
                            ctx.strokeStyle = "#ffffff";
                            ctx.lineWidth = 1;
                            ctx.strokeRect(colX + colWidth - 5, rowY + rowHeight - 5, 10, 10);
                        }
                    }
                } else {
                    
                    let selectionStartY = null;
                    let selectionStartX = null;
                    let selectionEndY = null;
                    let selectionEndX = null;
                    
                    
                    const startRowVisible = visibleRows.find(r => r.index === startRow);
                    if (startRowVisible) {
                        selectionStartY = startRowVisible.y;
                    } else if (startRow < rowStart) {
                        
                        selectionStartY = visibleRows[0]?.y - this.rows.getCumulativeHeightBetween(startRow, rowStart);
                    } else {
                        
                        const lastVisibleRow = visibleRows[visibleRows.length - 1];
                        if (lastVisibleRow) {
                            selectionStartY = lastVisibleRow.y + lastVisibleRow.height + 
                                            this.rows.getCumulativeHeightBetween(lastVisibleRow.index + 1, startRow);
                        }
                    }
                    
                    
                    const endRowVisible = visibleRows.find(r => r.index === endRow);
                    if (endRowVisible) {
                        selectionEndY = endRowVisible.y + endRowVisible.height;
                    } else if (endRow < rowStart) {
                        
                        selectionEndY = visibleRows[0]?.y - this.rows.getCumulativeHeightBetween(endRow + 1, rowStart);
                    } else {
                        
                        const lastVisibleRow = visibleRows[visibleRows.length - 1];
                        if (lastVisibleRow) {
                            selectionEndY = lastVisibleRow.y + lastVisibleRow.height + 
                                        this.rows.getCumulativeHeightBetween(lastVisibleRow.index + 1, endRow) +
                                        this.rows.getRowHeight(endRow);
                        }
                    }
                    
                    
                    const startColVisible = visibleCols.find(c => c.index === startCol);
                    if (startColVisible) {
                        selectionStartX = startColVisible.x;
                    } else if (startCol < colStart) {
                        
                        selectionStartX = visibleCols[0]?.x - this.cols.getCumulativeWidthBetween(startCol, colStart);
                    } else {
                        
                        const lastVisibleCol = visibleCols[visibleCols.length - 1];
                        if (lastVisibleCol) {
                            selectionStartX = lastVisibleCol.x + lastVisibleCol.width + 
                                            this.cols.getCumulativeWidthBetween(lastVisibleCol.index + 1, startCol);
                        }
                    }
                    
                    
                    const endColVisible = visibleCols.find(c => c.index === endCol);
                    if (endColVisible) {
                        selectionEndX = endColVisible.x + endColVisible.width;
                    } else if (endCol < colStart) {
                        selectionEndX = visibleCols[0]?.x - this.cols.getCumulativeWidthBetween(endCol + 1, colStart);
                    } else {
                        const lastVisibleCol = visibleCols[visibleCols.length - 1];
                        if (lastVisibleCol) {
                            selectionEndX = lastVisibleCol.x + lastVisibleCol.width + 
                                        this.cols.getCumulativeWidthBetween(lastVisibleCol.index + 1, endCol) +
                                        this.cols.getColumnWidth(endCol);
                        }
                    }
                    
                    
                    const isVisible = selectionStartX !== null && selectionStartY !== null &&
                                    selectionEndX !== null && selectionEndY !== null &&
                                    !(selectionEndX < 0 || selectionStartX > this.viewPortWidth ||
                                    selectionEndY < 0 || selectionStartY > this.viewPortHeight);
                    
                    if (!isVisible) {
                        continue;
                    }
                    
                    
                    for (let r = startRow; r <= endRow; r++) {
                        for (let c = startCol; c <= endCol; c++) {
                            const visibleRow = visibleRows.find(vr => vr.index === r);
                            const visibleCol = visibleCols.find(vc => vc.index === c);
                            
                            if (visibleRow && visibleCol) {
                                const rowY = visibleRow.y;
                                const colX = visibleCol.x;
                                const rowHeight = visibleRow.height;
                                const colWidth = visibleCol.width;
                                
                                if (r === activeRow && c === activeCol) {
                                    ctx.fillStyle = "#ffffff";
                                    ctx.fillRect(colX + 1, rowY + 1, colWidth - 1, rowHeight - 1);
                                } else {
                                    ctx.fillStyle = "rgba(20, 126, 67, 0.15)";
                                    ctx.fillRect(colX + 1, rowY + 1, colWidth - 1, rowHeight - 1);
                                }
                            }
                        }
                    }
                    
                    const clippedStartY = Math.max(0, selectionStartY);
                    const clippedStartX = Math.max(0, selectionStartX);
                    const clippedEndY = Math.min(this.viewPortHeight, selectionEndY);
                    const clippedEndX = Math.min(this.viewPortWidth, selectionEndX);
                    
                    if (clippedEndX > clippedStartX && clippedEndY > clippedStartY) {
                        ctx.strokeStyle = "#147E43";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(
                            clippedStartX + 0.5, 
                            clippedStartY + 0.5, 
                            clippedEndX - clippedStartX, 
                            clippedEndY - clippedStartY
                        );
                        
                        
                        if (selectionEndX >= 4 && selectionEndX <= this.viewPortWidth + 4 && 
                            selectionEndY >= 4 && selectionEndY <= this.viewPortHeight + 4) {
                            ctx.fillStyle = "#147E43";
                            ctx.fillRect(selectionEndX - 4, selectionEndY - 4, 8, 8);
                            ctx.strokeStyle = "#ffffff";
                            ctx.lineWidth = 1;
                            ctx.strokeRect(selectionEndX - 5, selectionEndY - 5, 10, 10);
                        }
                    }
                }
            }
        }

        ctx.fillStyle = "#000";
        

        for (let row of visibleRows) {
            for (let col of visibleCols) {
                const cellValue = this.getCellValue(row.index, col.index);
                if (cellValue && cellValue.toString().trim() !== '') {
                    const cellValueStr = cellValue.toString();
                    const isNumber = !isNaN(cellValue);
                    
                    let textX;
                    if (isNumber) {
                        textX = col.x + col.width - 4;
                        ctx.textAlign = 'right';
                    } else {
                        textX = col.x + 4;
                        ctx.textAlign = 'left';
                    }
                    
                    const textY = row.y + row.height - 4;
                    
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(col.x + 1, row.y + 1, col.width - 2, row.height - 2);
                    ctx.clip();
                    
                    ctx.fillText(cellValueStr, textX, textY);
                    ctx.restore();
                }
            }
        }
    }

    /**
     * Get the cell value for a specific row and column
     * @param {number} row the row index
     * @param {number} col the column index
     */
    getCellValue(row, col) {
        if (this.datastore) {
            return this.datastore.getCellValue(row, col);
        }
        return '';
    }
}