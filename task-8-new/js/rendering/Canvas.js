import { MainEngine } from "./MainEngine.js";

export class Canvas extends MainEngine {
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

    // renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
    //     this.setViewportSize();
    //     ctx.clearRect(0, 0, this.viewPortWidth, this.viewPortHeight);

    //     console.log("Rendering Canvas with scrollX:", scrollX, "scrollY:", scrollY, "rowStart:", rowStart, "colStart:", colStart);
    //     let visibleRows = [];
    //     let visibleCols = [];
    //     let currentY = -scrollY;
    //     let currentX = -scrollX;
    //     let rowIndex = rowStart;
    //     let colIndex = colStart;
        
    //     while (currentY < this.viewPortHeight && rowIndex < rowStart + 100) {
    //         const rowHeight = this.rows.getRowHeight(rowIndex);
    //         if (currentY + rowHeight >= 0) {
    //             visibleRows.push({ index: rowIndex, y: currentY, height: rowHeight });
    //         }
    //         currentY += rowHeight;
    //         rowIndex++;
    //     }
    //     while (currentX < this.viewPortWidth && colIndex < colStart + 100) {
    //         const colWidth = this.cols.getColumnWidth(colIndex);
    //         if (currentX + colWidth >= 0) {
    //             visibleCols.push({ index: colIndex, x: currentX, width: colWidth });
    //         }
    //         currentX += colWidth;
    //         colIndex++;
    //     }

    //     ctx.lineWidth = 1 / window.devicePixelRatio;
    //     ctx.font = "12px Arial";
    //     ctx.strokeStyle = "#d0d0d0";
    //     ctx.fillStyle = "#000";

    //     ctx.beginPath();
        
    //     for (let row of visibleRows) {
    //         ctx.moveTo(0, row.y + row.height + 0.5);
    //         ctx.lineTo(this.viewPortWidth, row.y + row.height + 0.5);
    //     }
        
    //     for (let col of visibleCols) {
    //         ctx.moveTo(col.x + col.width + 0.5, 0);
    //         ctx.lineTo(col.x + col.width + 0.5, this.viewPortHeight);
    //     }
        
    //     ctx.stroke();
    //     ctx.closePath();

    //     if (selection) {
    //         for (let sel of selection.selections) {
    //             console.log("Rendering Selection: - -", sel);
    //             //Now what we need to do is to store the initial position of the selection and then change them as needed.
    //             const startRow = sel.startRow;
    //             const endRow = sel.endRow;
    //             const startCol = sel.startCol;
    //             const endCol = sel.endCol;
    //             const activeRow = sel.activeRow || startRow;
    //             const activeCol = sel.activeCol || startCol;
    //             const isSingleCell = (startRow === endRow && startCol === endCol);
    //             if (isSingleCell) {
    //                 const cellStartY = this.rows.getCumulativeHeightUntil(startRow);
    //                 const cellStartX = this.cols.getCumulativeWidthUntil(startCol);
    //                 console.log("Cell Start Value ",cellStartX)
    //                 console.log("Cell Start Value ",cellStartY)
    //                 const rowHeight = this.rows.getRowHeight(startRow);
    //                 const colWidth = this.cols.getColumnWidth(startCol);
    //                 console.log("Scroll Values ",scrollX, scrollY)
    //                 const rowY = cellStartY - scrollY;
    //                 const colX = cellStartX - scrollX;
    //                 if (colX + colWidth >= 0 && colX <= this.viewPortWidth && 
    //                     rowY + rowHeight >= 0 && rowY <= this.viewPortHeight) {
    //                     ctx.strokeStyle = "#147E43";
    //                     ctx.lineWidth = 2;
    //                     ctx.strokeRect(colX + 0.5, rowY + 0.5, colWidth, rowHeight);
    //                     ctx.fillStyle = "#147E43";
    //                     ctx.fillRect(colX + colWidth - 4, rowY + rowHeight - 4, 8, 8);
    //                     ctx.strokeStyle = "#ffffff";
    //                     ctx.lineWidth = 1;
    //                     ctx.strokeRect(colX + colWidth - 5, rowY + rowHeight - 5, 10, 10);
    //                 }
    //             } else {
    //                 const selectionStartY = this.rows.getCumulativeHeightUntil(startRow);
    //                 const selectionStartX = this.cols.getCumulativeWidthUntil(startCol);
    //                 const selectionEndY = this.rows.getCumulativeHeightUntil(endRow) + this.rows.getRowHeight(endRow);
    //                 const selectionEndX = this.cols.getCumulativeWidthUntil(endCol) + this.cols.getColumnWidth(endCol);
    //                 const viewportStartY = selectionStartY - scrollY;
    //                 const viewportStartX = selectionStartX - scrollX;
    //                 const viewportEndY = selectionEndY - scrollY;
    //                 const viewportEndX = selectionEndX - scrollX;

    //                 const isVisible = !(
    //                     viewportEndX < 0 || 
    //                     viewportStartX > this.viewPortWidth ||
    //                     viewportEndY < 0 || 
    //                     viewportStartY > this.viewPortHeight
    //                 );

    //                 if (!isVisible) {
    //                     continue; 
    //                 }

    //                 for (let r = startRow; r <= endRow; r++) {
    //                     for (let c = startCol; c <= endCol; c++) {
    //                         const cellStartY = this.rows.getCumulativeHeightUntil(r);
    //                         const cellStartX = this.cols.getCumulativeWidthUntil(c);
    //                         const rowHeight = this.rows.getRowHeight(r);
    //                         const colWidth = this.cols.getColumnWidth(c);
                            
    //                         const rowY = cellStartY - scrollY;
    //                         const colX = cellStartX - scrollX;

    //                         if (colX + colWidth >= 0 && colX <= this.viewPortWidth && 
    //                             rowY + rowHeight >= 0 && rowY <= this.viewPortHeight) {
                                
    //                             if (r === activeRow && c === activeCol) {
    //                                 ctx.fillStyle = "#ffffff";
    //                                 ctx.fillRect(colX + 1, rowY + 1, colWidth - 1, rowHeight - 1);
    //                             } else {
    //                                 ctx.fillStyle = "rgba(20, 126, 67, 0.15)";
    //                                 ctx.fillRect(colX + 1, rowY + 1, colWidth - 1, rowHeight - 1);
    //                             }
    //                         }
    //                     }
    //                 }

    //                 const clippedStartY = Math.max(0, viewportStartY);
    //                 const clippedStartX = Math.max(0, viewportStartX);
    //                 const clippedEndY = Math.min(this.viewPortHeight, viewportEndY);
    //                 const clippedEndX = Math.min(this.viewPortWidth, viewportEndX);

    //                 if (clippedEndX > clippedStartX && clippedEndY > clippedStartY) {
    //                     ctx.strokeStyle = "#147E43";
    //                     ctx.lineWidth = 2;
    //                     ctx.strokeRect(
    //                         clippedStartX + 0.5, 
    //                         clippedStartY + 0.5, 
    //                         clippedEndX - clippedStartX, 
    //                         clippedEndY - clippedStartY
    //                     );

    //                     if (viewportEndX >= 4 && viewportEndX <= this.viewPortWidth + 4 && 
    //                         viewportEndY >= 4 && viewportEndY <= this.viewPortHeight + 4) {
    //                         ctx.fillStyle = "#147E43";
    //                         ctx.fillRect(viewportEndX - 4, viewportEndY - 4, 8, 8);
    //                         ctx.strokeStyle = "#ffffff";
    //                         ctx.lineWidth = 1;
    //                         ctx.strokeRect(viewportEndX - 5, viewportEndY - 5, 10, 10);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0, colStart=0, selection = null){
    this.setViewportSize();
    ctx.clearRect(0, 0, this.viewPortWidth, this.viewPortHeight);

    console.log("Rendering Canvas with scrollX:", scrollX, "scrollY:", scrollY, "rowStart:", rowStart, "colStart:", colStart);
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
            console.log("Rendering Selection: - -", sel);
            const startRow = sel.startRow;
            const endRow = sel.endRow;
            const startCol = sel.startCol;
            const endCol = sel.endCol;
            const activeRow = sel.activeRow || startRow;
            const activeCol = sel.activeCol || startCol;
            const isSingleCell = (startRow === endRow && startCol === endCol);
            
            if (isSingleCell) {
                // Find the row and column in the visible arrays
                const visibleRow = visibleRows.find(r => r.index === startRow);
                const visibleCol = visibleCols.find(c => c.index === startCol);
                
                if (visibleRow && visibleCol) {
                    const rowY = visibleRow.y;
                    const colX = visibleCol.x;
                    const rowHeight = visibleRow.height;
                    const colWidth = visibleCol.width;
                    
                    ctx.strokeStyle = "#147E43";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(colX + 0.5, rowY + 0.5, colWidth, rowHeight);
                    ctx.fillStyle = "#147E43";
                    ctx.fillRect(colX + colWidth - 4, rowY + rowHeight - 4, 8, 8);
                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(colX + colWidth - 5, rowY + rowHeight - 5, 10, 10);
                }
            } else {
                // For multi-cell selections, we need to calculate the viewport bounds
                // Find the bounds of the selection in viewport coordinates
                let selectionStartY = null;
                let selectionStartX = null;
                let selectionEndY = null;
                let selectionEndX = null;
                
                // Find start row position
                const startRowVisible = visibleRows.find(r => r.index === startRow);
                if (startRowVisible) {
                    selectionStartY = startRowVisible.y;
                } else if (startRow < rowStart) {
                    // Selection starts before visible area
                    selectionStartY = visibleRows[0]?.y - this.rows.getCumulativeHeightBetween(startRow, rowStart);
                } else {
                    // Selection starts after visible area - calculate from last visible row
                    const lastVisibleRow = visibleRows[visibleRows.length - 1];
                    if (lastVisibleRow) {
                        selectionStartY = lastVisibleRow.y + lastVisibleRow.height + 
                                        this.rows.getCumulativeHeightBetween(lastVisibleRow.index + 1, startRow);
                    }
                }
                
                // Find end row position
                const endRowVisible = visibleRows.find(r => r.index === endRow);
                if (endRowVisible) {
                    selectionEndY = endRowVisible.y + endRowVisible.height;
                } else if (endRow < rowStart) {
                    // Selection ends before visible area
                    selectionEndY = visibleRows[0]?.y - this.rows.getCumulativeHeightBetween(endRow + 1, rowStart);
                } else {
                    // Selection ends after visible area
                    const lastVisibleRow = visibleRows[visibleRows.length - 1];
                    if (lastVisibleRow) {
                        selectionEndY = lastVisibleRow.y + lastVisibleRow.height + 
                                      this.rows.getCumulativeHeightBetween(lastVisibleRow.index + 1, endRow) +
                                      this.rows.getRowHeight(endRow);
                    }
                }
                
                // Find start col position
                const startColVisible = visibleCols.find(c => c.index === startCol);
                if (startColVisible) {
                    selectionStartX = startColVisible.x;
                } else if (startCol < colStart) {
                    // Selection starts before visible area
                    selectionStartX = visibleCols[0]?.x - this.cols.getCumulativeWidthBetween(startCol, colStart);
                } else {
                    // Selection starts after visible area
                    const lastVisibleCol = visibleCols[visibleCols.length - 1];
                    if (lastVisibleCol) {
                        selectionStartX = lastVisibleCol.x + lastVisibleCol.width + 
                                        this.cols.getCumulativeWidthBetween(lastVisibleCol.index + 1, startCol);
                    }
                }
                
                // Find end col position
                const endColVisible = visibleCols.find(c => c.index === endCol);
                if (endColVisible) {
                    selectionEndX = endColVisible.x + endColVisible.width;
                } else if (endCol < colStart) {
                    // Selection ends before visible area
                    selectionEndX = visibleCols[0]?.x - this.cols.getCumulativeWidthBetween(endCol + 1, colStart);
                } else {
                    // Selection ends after visible area
                    const lastVisibleCol = visibleCols[visibleCols.length - 1];
                    if (lastVisibleCol) {
                        selectionEndX = lastVisibleCol.x + lastVisibleCol.width + 
                                      this.cols.getCumulativeWidthBetween(lastVisibleCol.index + 1, endCol) +
                                      this.cols.getColumnWidth(endCol);
                    }
                }
                
                // Check if selection is visible
                const isVisible = selectionStartX !== null && selectionStartY !== null &&
                                selectionEndX !== null && selectionEndY !== null &&
                                !(selectionEndX < 0 || selectionStartX > this.viewPortWidth ||
                                  selectionEndY < 0 || selectionStartY > this.viewPortHeight);
                
                if (!isVisible) {
                    continue;
                }
                
                // Fill individual cells that are visible
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
                
                // Draw selection border
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
                    
                    // Draw resize handle
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
}
}