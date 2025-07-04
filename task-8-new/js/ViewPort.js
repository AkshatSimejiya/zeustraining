import { Canvas } from "./rendering/Canvas.js"
import {ColumnHeader} from "./rendering/ColumnHeader.js";
import {RowHeader} from "./rendering/RowHeader.js";
import { CornerCanvas } from "./rendering/CornerCanvas.js";
import { Selection } from "./rendering/Selection.js";


// export class ViewPort {
//     constructor(gridContainer, colInstance, rowsInstance){
//         this.gridContainer = gridContainer;
//         this.rows = rowsInstance;
//         this.cols = colInstance;

//         this.canvas = new Canvas(this.gridContainer, 25, 100,  this.cols, this.rows);
//         this.rowCanvas = new RowHeader(this.gridContainer, 25, 100, this.cols, this.rows);
//         this.colCanvas = new ColumnHeader(this.gridContainer,  25, 100, this.cols, this.rows);
//         this.cornerCanvas = new CornerCanvas(this.gridContainer,  25, 100, this.cols, this.rows);

//         this.absoluteScrollY = 0;
//         this.absoluteScrollX = 0;
        
//         this.scroll = {
//             scrollY: 0,
//             scrollX: 0
//         }
//         this.rowStart = 0;
//         this.colStart = 0;

//         this.default_row_height = 25;
//         this.default_col_width = 100;

//         this.selection = new Selection();
        
//         this.isDragging = false;
//         this.dragStartRow = -1;
//         this.dragStartCol = -1;
        
//         this.selection.setCallback('onSelectionChange', (selections) => {
//             this.onSelectionChange(selections);
//         });
//     }

//     updateRenderer(){
//         const selectionData = this.getSelectionForRendering();

//         this.canvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
//         this.rowCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
//         this.colCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
//         this.cornerCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
//     }

//     /**
//      * Calculate which column starts at a given absolute X position
//      */
//     calculateColPosition(absoluteX) {
//         if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
//             const result = this.cols.getColumnAtAbsolutePosition(absoluteX);
//             return {
//                 colStart: result.col,
//                 scrollX: result.offsetX
//             };
//         }
        
//         return {
//             colStart: Math.floor(absoluteX / this.default_col_width),
//             scrollX: absoluteX % this.default_col_width
//         };
//     }

//     updateScroll(e){
//         const delta = e.deltaY * 0.3;

//         if (e.shiftKey) {
//             this.absoluteScrollX += delta;
//             if (this.absoluteScrollX < 0) {
//                 this.absoluteScrollX = 0;
//             }

//             const colPosition = this.calculateColPosition(this.absoluteScrollX);
//             this.colStart = colPosition.colStart;
//             this.scroll.scrollX = colPosition.scrollX;

//         } else {
//             this.absoluteScrollY += delta * 0.3;
            
//             if (this.absoluteScrollY < 0) {
//                 this.absoluteScrollY = 0;
//             }

//             const rowPosition = this.rowCanvas.calculateRowPosition(this.absoluteScrollY);
//             this.rowStart = rowPosition.rowStart;
//             this.scroll.scrollY = rowPosition.scrollY;
//         }

//         // Update renderer with current selection
//         this.updateRenderer();
//     }

//     setSelection(){
//         this.isSelect = true;
//         this.canvas.setSelection();
//     }

//     removeSelection(){
//         this.canvas.removeSelection();
//     }

//     /**
//      * Calculate row and column from click coordinates - FIXED VERSION
//      */
//     getGridPositionFromClick(clientX, clientY) {
//         if(this.isSelect){
//             this.removeSelection();
//             this.isSelect = false;
//             return
//         }

//         const rect = this.gridContainer.getBoundingClientRect();
//         const containerX = clientX - rect.left;
//         const containerY = clientY - rect.top;
        
//         const row_header_width = 30; 
//         const col_header_height = 25;
        
//         const gridX = containerX - row_header_width;
//         const gridY = containerY - col_header_height;
        
//         if (gridX < 0 || gridY < 0) {
//             return {
//                 row: -1,
//                 col: -1,
//                 x: containerX,
//                 y: containerY,
//                 isHeader: true,
//                 isRowHeader: containerX < row_header_width,
//                 isColHeader: containerY < col_header_height
//             };
//         }
        
//         const absoluteGridX = gridX + this.absoluteScrollX;
//         const absoluteGridY = gridY + this.absoluteScrollY;
        
//         let col;
//         if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
//             const colResult = this.cols.getColumnAtAbsolutePosition(absoluteGridX);
//             col = colResult.col;
//         } else {
//             col = Math.floor(absoluteGridX / this.default_col_width);
//         }
        
//         let row;
//         if (this.rows && typeof this.rows.getRowAtAbsolutePosition === 'function') {
//             const rowResult = this.rows.getRowAtAbsolutePosition(absoluteGridY);
//             row = rowResult.row;
//         } else {
//             let cumulativeHeight = 0;
//             row = 0;
//             while (cumulativeHeight + this.rows.getRowHeight(row) <= absoluteGridY) {
//                 cumulativeHeight += this.rows.getRowHeight(row);
//                 row++;
//             }
//         }
        
//         return {
//             row: row,
//             col: col,
//             x: containerX,
//             y: containerY,
//             gridX: gridX,
//             gridY: gridY,
//             isHeader: false,
//             absoluteGridX: absoluteGridX,
//             absoluteGridY: absoluteGridY
//         };
//     }

//     /**
//      * Handle mouse down for selection start
//      */
//     handleMouseDown(e) {
//         const position = this.getGridPositionFromClick(e.clientX, e.clientY);
        
//         console.log("Mouse down at:", position);
        
//         if (position.isHeader) {
//             if (position.isRowHeader) {
//                 this.selection.selectRow(position.row, e.ctrlKey, e.shiftKey);
//             } else if (position.isColHeader) {
//                 this.selection.selectColumn(position.col, e.ctrlKey, e.shiftKey);
//             }
//         } else {
//             if (e.shiftKey && this.selection.getActiveSelection()) {
//                 if(this.selection.isRangeSelection()) {
//                     return
//                 }
//                 const active = this.selection.getActiveSelection();
//                 this.selection.selectRange(
//                     active.activeRow || active.startRow, 
//                     active.activeCol || active.startCol,
//                     position.row, position.col,
//                     true,
//                     active.activeRow || active.startRow,
//                     active.activeCol || active.startCol
//                 );
//             } else {
//                 if (e.ctrlKey) {
//                     this.selection.addSelection(position.row, position.col, 'cell');
//                 } else {
//                     this.selection.clearAllSelections();
//                     this.selection.startSelection(
//                         position.row, position.col, 'cell',
//                         false, false
//                     );
//                 }
                
//                 this.isDragging = true;
//                 this.dragStartRow = position.row;
//                 this.dragStartCol = position.col;
//             }
//         }
//     }

//     /**
//      * Handle mouse move for selection drag
//      */
//     handleMouseMove(e) {
//         if (this.isDragging && this.dragStartRow >= 0 && this.dragStartCol >= 0) {
//             const position = this.getGridPositionFromClick(e.clientX, e.clientY);
            
//             if (!position.isHeader) {
//                 this.selection.clearAllSelections();
//                 this.selection.selectRange(
//                     this.dragStartRow, this.dragStartCol,
//                     position.row, position.col,
//                     false,
//                     this.dragStartRow,
//                     this.dragStartCol
//                 );
//             }
//         }
//     }

//     /**
//      * Handle mouse up for selection end
//      */
//     handleMouseUp(e) {
//         console.log("Selection is working at", this.selection);
//         if (this.isDragging) {
//             this.isDragging = false;
//             this.dragStartRow = -1;
//             this.dragStartCol = -1;
//         }
        
//         if (this.selection.isSelecting) {
//             this.selection.endSelection();
//         }
//     }

//     /**
//      * Handle keyboard shortcuts for selection
//      */
//     handleKeyDown(e) {
//         const active = this.selection.getActiveSelection();
//         if (!active) return;

//         const currentActiveRow = active.activeRow || active.startRow;
//         const currentActiveCol = active.activeCol || active.startCol;
//         let newRow = currentActiveRow;
//         let newCol = currentActiveCol;
        
//         if(this.selection.isRangeSelection()) {
//             console.log("Range selection detected");
            
//             // Get the bounds of the current selection
//             const minRow = active.startRow;
//             const maxRow = active.endRow;
//             const minCol = active.startCol;
//             const maxCol = active.endCol;
            
//             switch (e.key) {
//                 case 'Tab':
//                     e.preventDefault();
//                     if (e.shiftKey) {
//                         // Shift+Tab: Move left, wrap to previous row's last column
//                         if (currentActiveCol > minCol) {
//                             newCol = currentActiveCol - 1;
//                         } else {
//                             // At first column, wrap to previous row's last column
//                             if (currentActiveRow > minRow) {
//                                 newRow = currentActiveRow - 1;
//                                 newCol = maxCol;
//                             } else {
//                                 // At first row and first column, wrap to last row's last column
//                                 newRow = maxRow;
//                                 newCol = maxCol;
//                             }
//                         }
//                     } else {
//                         // Tab: Move right, wrap to next row's first column
//                         if (currentActiveCol < maxCol) {
//                             newCol = currentActiveCol + 1;
//                         } else {
//                             // At last column, wrap to next row's first column
//                             if (currentActiveRow < maxRow) {
//                                 newRow = currentActiveRow + 1;
//                                 newCol = minCol;
//                             } else {
//                                 // At last row and last column, wrap to first row's first column
//                                 newRow = minRow;
//                                 newCol = minCol;
//                             }
//                         }
//                     }
//                     break;
                    
//                 case 'Enter':
//                     e.preventDefault();
//                     if (e.shiftKey) {
//                         // Shift+Enter: Move up, wrap to previous column's last row
//                         if (currentActiveRow > minRow) {
//                             newRow = currentActiveRow - 1;
//                         } else {
//                             // At first row, wrap to previous column's last row
//                             if (currentActiveCol > minCol) {
//                                 newCol = currentActiveCol - 1;
//                                 newRow = maxRow;
//                             } else {
//                                 // At first row and first column, wrap to last column's last row
//                                 newCol = maxCol;
//                                 newRow = maxRow;
//                             }
//                         }
//                     } else {
//                         // Enter: Move down, wrap to next column's first row
//                         if (currentActiveRow < maxRow) {
//                             newRow = currentActiveRow + 1;
//                         } else {
//                             // At last row, wrap to next column's first row
//                             if (currentActiveCol < maxCol) {
//                                 newCol = currentActiveCol + 1;
//                                 newRow = minRow;
//                             } else {
//                                 // At last row and last column, wrap to first column's first row
//                                 newCol = minCol;
//                                 newRow = minRow;
//                             }
//                         }
//                     }
//                     break;
                    
//                 case 'ArrowUp':
//                     if (e.shiftKey) {
//                         // Extend selection upward
//                         this.selection.selectRange(
//                             minRow, minCol, maxRow, maxCol,
//                             false,
//                             Math.max(minRow, currentActiveRow - 1),
//                             currentActiveCol
//                         );
//                     } else {
//                         newRow = Math.max(minRow, currentActiveRow - 1);
//                     }
//                     break;
                    
//                 case 'ArrowDown':
//                     if (e.shiftKey) {
//                         // Extend selection downward
//                         this.selection.selectRange(
//                             minRow, minCol, maxRow, maxCol,
//                             false,
//                             Math.min(maxRow, currentActiveRow + 1),
//                             currentActiveCol
//                         );
//                     } else {
//                         newRow = Math.min(maxRow, currentActiveRow + 1);
//                     }
//                     break;
                    
//                 case 'ArrowLeft':
//                     if (e.shiftKey) {
//                         // Extend selection leftward
//                         this.selection.selectRange(
//                             minRow, minCol, maxRow, maxCol,
//                             false,
//                             currentActiveRow,
//                             Math.max(minCol, currentActiveCol - 1)
//                         );
//                     } else {
//                         newCol = Math.max(minCol, currentActiveCol - 1);
//                     }
//                     break;
                    
//                 case 'ArrowRight':
//                     if (e.shiftKey) {
//                         // Extend selection rightward
//                         this.selection.selectRange(
//                             minRow, minCol, maxRow, maxCol,
//                             false,
//                             currentActiveRow,
//                             Math.min(maxCol, currentActiveCol + 1)
//                         );
//                     } else {
//                         newCol = Math.min(maxCol, currentActiveCol + 1);
//                     }
//                     break;
                    
//                 case 'Escape':
//                     this.selection.clearAllSelections();
//                     return;
                    
//                 default:
//                     return;
//             }
            
//             // Update the active cell position within the range (for Tab and Enter)
//             if ((e.key === 'Tab' || e.key === 'Enter') && (newRow !== currentActiveRow || newCol !== currentActiveCol)) {
//                 // Keep the same selection range but update the active cell
//                 this.selection.selectRange(
//                     minRow, minCol, maxRow, maxCol,
//                     false,
//                     newRow, newCol
//                 );
//             } else if (e.key.startsWith('Arrow') && !e.shiftKey && (newRow !== currentActiveRow || newCol !== currentActiveCol)) {
//                 // For arrow keys without shift, just move the active cell within the range
//                 this.selection.selectRange(
//                     minRow, minCol, maxRow, maxCol,
//                     false,
//                     newRow, newCol
//                 );
//             }
            
//         } else {
//             // Single cell selection - existing logic
//             switch (e.key) {
//                 case 'ArrowUp':
//                     newRow = Math.max(0, currentActiveRow - 1);
//                     break;
//                 case 'ArrowDown':
//                 case 'Enter':
//                     newRow = currentActiveRow + 1;
//                     break;
//                 case 'ArrowLeft':
//                     newCol = Math.max(0, currentActiveCol - 1);
//                     break;
//                 case 'ArrowRight':
//                 case 'Tab':
//                     if (e.shiftKey) {
//                         e.preventDefault();
//                         newCol = Math.max(0, currentActiveCol - 1);
//                     } else {
//                         newCol = currentActiveCol + 1;
//                     }
//                     break;
//                 case 'Escape':
//                     this.selection.clearAllSelections();
//                     return;
//                 case 'a':
//                     if (e.ctrlKey) {
//                         e.preventDefault();
//                         return;
//                     }
//                     break;
//                 default:
//                     return;
//             }
            
//             if (newRow !== currentActiveRow || newCol !== currentActiveCol) {
//                 if (e.shiftKey && e.key !== 'Tab') {
//                     this.selection.selectRange(
//                         currentActiveRow, currentActiveCol,
//                         newRow, newCol,
//                         false,
//                         currentActiveRow,
//                         currentActiveCol
//                     );
//                 } else {
//                     this.selection.clearAllSelections();
//                     this.selection.selectCell(newRow, newCol);
//                 }
//                 e.preventDefault();
//             }
//         }
//     }

//     /**
//      * Called when selection changes
//      */
//     onSelectionChange(selections) {
//         console.log('Selection changed:', selections);
//         this.updateRenderer();
//     }

//     /**
//      * Get current selection for rendering
//      */
//     getSelectionForRendering() {
//         return {
//             selections: this.selection.getAllSelections(),
//             bounds: this.selection.getSelectionBounds(),
//             isCellSelected: (row, col) => this.selection.isCellSelected(row, col),
//             isRowSelected: (row) => this.selection.isRowSelected(row),
//             isColumnSelected: (col) => this.selection.isColumnSelected(col)
//         };
//     }
// }

// import { Canvas } from "./rendering/Canvas.js"
// import {ColumnHeader} from "./rendering/ColumnHeader.js";
// import {RowHeader} from "./rendering/RowHeader.js";
// import { CornerCanvas } from "./rendering/CornerCanvas.js";
// import { Selection } from "./rendering/Selection.js";


export class ViewPort {
    constructor(gridContainer, colInstance, rowsInstance){
        this.gridContainer = gridContainer;
        this.rows = rowsInstance;
        this.cols = colInstance;

        this.canvas = new Canvas(this.gridContainer, 25, 100,  this.cols, this.rows);
        this.rowCanvas = new RowHeader(this.gridContainer, 25, 100, this.cols, this.rows);
        this.colCanvas = new ColumnHeader(this.gridContainer,  25, 100, this.cols, this.rows);
        this.cornerCanvas = new CornerCanvas(this.gridContainer,  25, 100, this.cols, this.rows);

        this.absoluteScrollY = 0;
        this.absoluteScrollX = 0;
        
        this.scroll = {
            scrollY: 0,
            scrollX: 0
        }
        this.rowStart = 0;
        this.colStart = 0;

        this.default_row_height = 25;
        this.default_col_width = 100;

        this.selection = new Selection();
        
        this.isDragging = false;
        this.dragStartRow = -1;
        this.dragStartCol = -1;
        
        this.selection.setCallback('onSelectionChange', (selections) => {
            this.onSelectionChange(selections);
        });
    }

    updateRenderer(){
        const selectionData = this.getSelectionForRendering();

        this.canvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
        this.rowCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
        this.colCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
        this.cornerCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
    }

    /**
     * Calculate which column starts at a given absolute X position
     */
    calculateColPosition(absoluteX) {
        if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
            const result = this.cols.getColumnAtAbsolutePosition(absoluteX);
            return {
                colStart: result.col,
                scrollX: result.offsetX
            };
        }
        
        return {
            colStart: Math.floor(absoluteX / this.default_col_width),
            scrollX: absoluteX % this.default_col_width
        };
    }

    updateScroll(e){
        console.log("Scroll event:", e);
        const delta = e.deltaY * 0.3;

        if (e.shiftKey) {
            this.absoluteScrollX += delta;
            if (this.absoluteScrollX < 0) {
                this.absoluteScrollX = 0;
            }

            const colPosition = this.calculateColPosition(this.absoluteScrollX);
            this.colStart = colPosition.colStart;
            this.scroll.scrollX = colPosition.scrollX;

        } else {
            this.absoluteScrollY += delta * 0.3;
            
            if (this.absoluteScrollY < 0) {
                this.absoluteScrollY = 0;
            }

            const rowPosition = this.rowCanvas.calculateRowPosition(this.absoluteScrollY);
            this.rowStart = rowPosition.rowStart;
            this.scroll.scrollY = rowPosition.scrollY;
        }

        // Update renderer with current selection
        console.log("Updating renderer with scroll:", this.absoluteScrollX, this.absoluteScrollY);
        this.updateRenderer();
    }

    setSelection(){
        this.isSelect = true;
        this.canvas.setSelection();
    }

    removeSelection(){
        this.canvas.removeSelection();
    }

    /**
     * Calculate row and column from click coordinates - FIXED VERSION
     */
    getGridPositionFromClick(clientX, clientY) {
        if(this.isSelect){
            this.removeSelection();
            this.isSelect = false;
            return
        }

        const rect = this.gridContainer.getBoundingClientRect();
        const containerX = clientX - rect.left;
        const containerY = clientY - rect.top;
        
        const row_header_width = 30; 
        const col_header_height = 25;
        
        const gridX = containerX - row_header_width;
        const gridY = containerY - col_header_height;
        
        if (gridX < 0 || gridY < 0) {
            // Handle header clicks differently
            let headerRow = -1;
            let headerCol = -1;
            
            // Calculate row for row header clicks
            if (containerX < row_header_width && containerY >= col_header_height) {
                const absoluteGridY = gridY + this.absoluteScrollY;
                if (this.rows && typeof this.rows.getRowAtAbsolutePosition === 'function') {
                    const rowResult = this.rows.getRowAtAbsolutePosition(absoluteGridY);
                    headerRow = rowResult.row;
                } else {
                    let cumulativeHeight = 0;
                    headerRow = 0;
                    while (cumulativeHeight + this.rows.getRowHeight(headerRow) <= absoluteGridY && headerRow < this.rows.getRowCount()) {
                        cumulativeHeight += this.rows.getRowHeight(headerRow);
                        headerRow++;
                    }
                }
            }
            
            // Calculate column for column header clicks
            if (containerY < col_header_height && containerX >= row_header_width) {
                const absoluteGridX = gridX + this.absoluteScrollX;
                if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
                    const colResult = this.cols.getColumnAtAbsolutePosition(absoluteGridX);
                    headerCol = colResult.col;
                } else {
                    headerCol = Math.floor(absoluteGridX / this.default_col_width);
                }
            }
            
            return {
                row: headerRow,
                col: headerCol,
                x: containerX,
                y: containerY,
                isHeader: true,
                isRowHeader: containerX < row_header_width,
                isColHeader: containerY < col_header_height
            };
        }
        
        // Fixed: Use current scroll position for absolute calculation
        const absoluteGridX = gridX + this.absoluteScrollX;
        const absoluteGridY = gridY + this.absoluteScrollY;
        
        let col;
        if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
            const colResult = this.cols.getColumnAtAbsolutePosition(absoluteGridX);
            col = colResult.col;
        } else {
            col = Math.floor(absoluteGridX / this.default_col_width);
        }
        
        let row;
        if (this.rows && typeof this.rows.getRowAtAbsolutePosition === 'function') {
            const rowResult = this.rows.getRowAtAbsolutePosition(absoluteGridY);
            row = rowResult.row;
        } else {
            let cumulativeHeight = 0;
            row = 0;
            while (cumulativeHeight + this.rows.getRowHeight(row) <= absoluteGridY && row < this.rows.getRowCount()) {
                cumulativeHeight += this.rows.getRowHeight(row);
                row++;
            }
        }
        
        return {
            row: row,
            col: col,
            x: containerX,
            y: containerY,
            gridX: gridX,
            gridY: gridY,
            isHeader: false,
            absoluteGridX: absoluteGridX,
            absoluteGridY: absoluteGridY
        };
    }

    /**
     * Handle mouse down for selection start
     */
    handleMouseDown(e) {
        const position = this.getGridPositionFromClick(e.clientX, e.clientY);
        
        console.log("Mouse down at:", position);
        
        if (position.isHeader) {
            if (position.isRowHeader && position.row >= 0) {
                this.selection.selectRow(position.row, e.ctrlKey, e.shiftKey);
            } else if (position.isColHeader && position.col >= 0) {
                this.selection.selectColumn(position.col, e.ctrlKey, e.shiftKey);
            }
        } else if (position.row >= 0 && position.col >= 0) {
            if (e.shiftKey && this.selection.getActiveSelection()) {
                if(this.selection.isRangeSelection()) {
                    return
                }
                const active = this.selection.getActiveSelection();
                this.selection.selectRange(
                    active.activeRow || active.startRow, 
                    active.activeCol || active.startCol,
                    position.row, position.col,
                    true,
                    active.activeRow || active.startRow,
                    active.activeCol || active.startCol
                );
            } else {
                if (e.ctrlKey) {
                    this.selection.addSelection(position.row, position.col, 'cell');
                } else {
                    this.selection.clearAllSelections();
                    this.selection.startSelection(
                        position.row, position.col, 'cell',
                        false, false
                    );
                }
                
                this.isDragging = true;
                this.dragStartRow = position.row;
                this.dragStartCol = position.col;
            }
        }
    }

    /**
     * Handle mouse move for selection drag
     */
    handleMouseMove(e) {
        if (this.isDragging && this.dragStartRow >= 0 && this.dragStartCol >= 0) {
            const position = this.getGridPositionFromClick(e.clientX, e.clientY);
            
            if (!position.isHeader && position.row >= 0 && position.col >= 0) {
                this.selection.clearAllSelections();
                this.selection.selectRange(
                    this.dragStartRow, this.dragStartCol,
                    position.row, position.col,
                    false,
                    this.dragStartRow,
                    this.dragStartCol
                );
            }
        }
    }

    /**
     * Handle mouse up for selection end
     */
    handleMouseUp(e) {
        console.log("Selection is working at", this.selection);
        if (this.isDragging) {
            this.isDragging = false;
            this.dragStartRow = -1;
            this.dragStartCol = -1;
        }
        
        if (this.selection.isSelecting) {
            this.selection.endSelection();
        }
    }

    /**
     * Handle keyboard shortcuts for selection
     */
    handleKeyDown(e) {
        const active = this.selection.getActiveSelection();
        if (!active) return;

        const currentActiveRow = active.activeRow || active.startRow;
        const currentActiveCol = active.activeCol || active.startCol;
        let newRow = currentActiveRow;
        let newCol = currentActiveCol;
        
        if(this.selection.isRangeSelection()) {
            console.log("Range selection detected");
            
            // Get the bounds of the current selection
            const minRow = active.startRow;
            const maxRow = active.endRow;
            const minCol = active.startCol;
            const maxCol = active.endCol;
            
            switch (e.key) {
                case 'Tab':
                    e.preventDefault();
                    if (e.shiftKey) {
                        // Shift+Tab: Move left, wrap to previous row's last column
                        if (currentActiveCol > minCol) {
                            newCol = currentActiveCol - 1;
                        } else {
                            // At first column, wrap to previous row's last column
                            if (currentActiveRow > minRow) {
                                newRow = currentActiveRow - 1;
                                newCol = maxCol;
                            } else {
                                // At first row and first column, wrap to last row's last column
                                newRow = maxRow;
                                newCol = maxCol;
                            }
                        }
                    } else {
                        // Tab: Move right, wrap to next row's first column
                        if (currentActiveCol < maxCol) {
                            newCol = currentActiveCol + 1;
                        } else {
                            // At last column, wrap to next row's first column
                            if (currentActiveRow < maxRow) {
                                newRow = currentActiveRow + 1;
                                newCol = minCol;
                            } else {
                                // At last row and last column, wrap to first row's first column
                                newRow = minRow;
                                newCol = minCol;
                            }
                        }
                    }
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (e.shiftKey) {
                        // Shift+Enter: Move up, wrap to previous column's last row
                        if (currentActiveRow > minRow) {
                            newRow = currentActiveRow - 1;
                        } else {
                            // At first row, wrap to previous column's last row
                            if (currentActiveCol > minCol) {
                                newCol = currentActiveCol - 1;
                                newRow = maxRow;
                            } else {
                                // At first row and first column, wrap to last column's last row
                                newCol = maxCol;
                                newRow = maxRow;
                            }
                        }
                    } else {
                        // Enter: Move down, wrap to next column's first row
                        if (currentActiveRow < maxRow) {
                            newRow = currentActiveRow + 1;
                        } else {
                            // At last row, wrap to next column's first row
                            if (currentActiveCol < maxCol) {
                                newCol = currentActiveCol + 1;
                                newRow = minRow;
                            } else {
                                // At last row and last column, wrap to first column's first row
                                newCol = minCol;
                                newRow = minRow;
                            }
                        }
                    }
                    break;
                    
                case 'Escape':
                    this.selection.clearAllSelections();
                    return;
                    
                default:
                    return;
            }
            
            // Update the active cell position within the range (for Tab and Enter)
            if ((e.key === 'Tab' || e.key === 'Enter') && (newRow !== currentActiveRow || newCol !== currentActiveCol)) {
                // Keep the same selection range but update the active cell
                this.selection.selectRange(
                    minRow, minCol, maxRow, maxCol,
                    false,
                    newRow, newCol
                );
                
                // Auto-scroll to keep active cell visible
                this.scrollToCell(newRow, newCol);
            } else if (e.key.startsWith('Arrow') && !e.shiftKey && (newRow !== currentActiveRow || newCol !== currentActiveCol)) {
                // For arrow keys without shift, just move the active cell within the range
                this.selection.selectRange(
                    minRow, minCol, maxRow, maxCol,
                    false,
                    newRow, newCol
                );
                
                // Auto-scroll to keep active cell visible
                this.scrollToCell(newRow, newCol);
            }
            
        } else {
            // Single cell selection - existing logic
            switch (e.key) {
                case 'ArrowUp':
                    newRow = Math.max(0, currentActiveRow - 1);
                    break;
                case 'ArrowDown':
                case 'Enter':
                    newRow = currentActiveRow + 1;
                    break;
                case 'ArrowLeft':
                    newCol = Math.max(0, currentActiveCol - 1);
                    break;
                case 'ArrowRight':
                case 'Tab':
                    if (e.shiftKey) {
                        e.preventDefault();
                        newCol = Math.max(0, currentActiveCol - 1);
                    } else {
                        newCol = currentActiveCol + 1;
                    }
                    break;
                case 'a':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        return;
                    }
                    break;
                default:
                    return;
            }
            
            if (newRow !== currentActiveRow || newCol !== currentActiveCol) {
                if (e.shiftKey && e.key !== 'Tab') {
                    this.selection.selectRange(
                        currentActiveRow, currentActiveCol,
                        newRow, newCol,
                        false,
                        currentActiveRow,
                        currentActiveCol
                    );
                } else {
                    this.selection.clearAllSelections();
                    this.selection.selectCell(newRow, newCol);
                }
                
                // Auto-scroll to keep active cell visible
                this.scrollToCell(newRow, newCol);
                e.preventDefault();
            }
        }
    }

    /**
     * Scroll to ensure a cell is visible
     */
    scrollToCell(row, col) {
        // Calculate the absolute position of the target cell
        let targetAbsoluteY = 0;
        for (let i = 0; i < row; i++) {
            targetAbsoluteY += this.rows.getRowHeight(i);
        }
        
        let targetAbsoluteX = 0;
        if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
            // If we have a column manager, use it to get the position
            for (let i = 0; i < col; i++) {
                targetAbsoluteX += this.cols.getColumnWidth(i);
            }
        } else {
            targetAbsoluteX = col * this.default_col_width;
        }
        
        // Get viewport dimensions
        const viewportHeight = this.gridContainer.clientHeight - 25; // minus header height
        const viewportWidth = this.gridContainer.clientWidth - 30; // minus row header width
        
        // Check if we need to scroll vertically
        const currentViewportTop = this.absoluteScrollY;
        const currentViewportBottom = this.absoluteScrollY + viewportHeight;
        const cellHeight = this.rows.getRowHeight(row);
        
        if (targetAbsoluteY < currentViewportTop) {
            // Cell is above viewport, scroll up
            this.absoluteScrollY = targetAbsoluteY;
        } else if (targetAbsoluteY + cellHeight > currentViewportBottom) {
            // Cell is below viewport, scroll down
            this.absoluteScrollY = targetAbsoluteY + cellHeight - viewportHeight;
        }
        
        // Check if we need to scroll horizontally
        const currentViewportLeft = this.absoluteScrollX;
        const currentViewportRight = this.absoluteScrollX + viewportWidth;
        const cellWidth = this.cols ? this.cols.getColumnWidth(col) : this.default_col_width;
        
        if (targetAbsoluteX < currentViewportLeft) {
            // Cell is left of viewport, scroll left
            this.absoluteScrollX = targetAbsoluteX;
        } else if (targetAbsoluteX + cellWidth > currentViewportRight) {
            // Cell is right of viewport, scroll right
            this.absoluteScrollX = targetAbsoluteX + cellWidth - viewportWidth;
        }
        
        // Ensure scroll positions are not negative
        this.absoluteScrollY = Math.max(0, this.absoluteScrollY);
        this.absoluteScrollX = Math.max(0, this.absoluteScrollX);
        
        // Update scroll positions and row/col starts
        const rowPosition = this.rowCanvas.calculateRowPosition(this.absoluteScrollY);
        this.rowStart = rowPosition.rowStart;
        this.scroll.scrollY = rowPosition.scrollY;
        
        const colPosition = this.calculateColPosition(this.absoluteScrollX);
        this.colStart = colPosition.colStart;
        this.scroll.scrollX = colPosition.scrollX;
        
        // Update the renderer
        this.updateRenderer();
    }

    /**
     * Called when selection changes
     */
    onSelectionChange(selections) {
        console.log('Selection changed:', selections);
        this.updateRenderer();
    }

    /**
     * Get current selection for rendering
     */
    getSelectionForRendering() {
        return {
            selections: this.selection.getAllSelections(),
            bounds: this.selection.getSelectionBounds(),
            isCellSelected: (row, col) => this.selection.isCellSelected(row, col),
            isRowSelected: (row) => this.selection.isRowSelected(row),
            isColumnSelected: (col) => this.selection.isColumnSelected(col),
            // Add scroll offset information for rendering
            scrollOffsetX: this.scroll.scrollX,
            scrollOffsetY: this.scroll.scrollY,
            absoluteScrollX: this.absoluteScrollX,
            absoluteScrollY: this.absoluteScrollY,
            rowStart: this.rowStart,
            colStart: this.colStart
        };
    }
}