import { Canvas } from "./rendering/Canvas.js"
import {ColumnHeader} from "./rendering/ColumnHeader.js";
import {RowHeader} from "./rendering/RowHeader.js";
import { CornerCanvas } from "./rendering/CornerCanvas.js";
import { Selection } from "./rendering/Selection.js";

export class ViewPort {
    constructor(gridContainer, colInstance,  rowsInstance){
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
        
        this.selection.setCallback('onSelectionChange', (selections) => {
            this.onSelectionChange(selections);
        });
    }

    updateRenderer(){
        this.canvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart);
        this.rowCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart);
        this.colCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart);
        this.cornerCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart);
    }

    /**
     * Calculate which column starts at a given absolute X position
     * @param {number} absoluteX - Absolute X position in the grid
     * @returns {object} - {colStart: number, scrollX: number}
     */
    calculateColPosition(absoluteX) {
        // Check if cols class has getColumnAtAbsolutePosition method
        if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
            const result = this.cols.getColumnAtAbsolutePosition(absoluteX);
            return {
                colStart: result.col,
                scrollX: result.offsetX
            };
        }
        
        // Fallback to default width calculation
        return {
            colStart: Math.floor(absoluteX / this.default_col_width),
            scrollX: absoluteX % this.default_col_width
        };
    }

    updateScroll(e){
        const delta = e.deltaY * 0.3;

        if (e.shiftKey) {
            this.absoluteScrollX += delta;
            if (this.absoluteScrollX < 0) {
                this.absoluteScrollX = 0;
            }

            // Calculate column position accounting for variable column widths
            const colPosition = this.calculateColPosition(this.absoluteScrollX);
            this.colStart = colPosition.colStart;
            this.scroll.scrollX = colPosition.scrollX;

        } else {
            this.absoluteScrollY += delta * 0.3;
            
            if (this.absoluteScrollY < 0) {
                this.absoluteScrollY = 0;
            }

            // Calculate row position accounting for variable row heights
            const rowPosition = this.rowCanvas.calculateRowPosition(this.absoluteScrollY);
            this.rowStart = rowPosition.rowStart;
            this.scroll.scrollY = rowPosition.scrollY;
        }

        this.canvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart);
        this.rowCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart);
        this.colCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart);
    }

    setSelection(){
        this.isSelect = true;
        this.canvas.setSelection();
        // this.rowCanvas.setSelection();
        // this.colCanvas.setSelection();
    }

    removeSelection(){
        this.canvas.removeSelection();
    }

    /**
     * Calculate row and column from click coordinates
     * @param {number} clientX - Mouse X coordinate relative to viewport
     * @param {number} clientY - Mouse Y coordinate relative to viewport
     * @returns {object} - {row: number, col: number, x: number, y: number}
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
            return {
                row: -1,
                col: -1,
                x: containerX,
                y: containerY,
                isHeader: true,
                isRowHeader: containerX < row_header_width,
                isColHeader: containerY < col_header_height
            };
        }
        
        const absoluteGridX = gridX + this.absoluteScrollX;
        const absoluteGridY = gridY + this.absoluteScrollY;
        
        // Calculate column accounting for variable column widths
        let col, offsetX;
        if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
            const colResult = this.cols.getColumnAtAbsolutePosition(absoluteGridX);
            col = colResult.col;
            offsetX = colResult.offsetX;
        } else {
            // Fallback to default width calculation
            col = Math.floor(absoluteGridX / this.default_col_width);
            offsetX = absoluteGridX % this.default_col_width;
        }
        
        // Calculate row accounting for variable row heights
        let row, offsetY;
        if (this.rows && typeof this.rows.getRowAtAbsolutePosition === 'function') {
            const rowResult = this.rows.getRowAtAbsolutePosition(absoluteGridY);
            row = rowResult.row;
            offsetY = rowResult.offsetY;
        } else {
            // Fallback to manual calculation
            row = 0;
            let cumulativeHeight = 0;
            while (cumulativeHeight + this.rows.getRowHeight(row) <= absoluteGridY) {
                cumulativeHeight += this.rows.getRowHeight(row);
                row++;
            }
            offsetY = absoluteGridY - cumulativeHeight;
        }
        
        // Calculate cell position within the cell (0.0 to 1.0)
        const colWidth = this.cols ? this.cols.getColumnWidth(col) : this.default_col_width;
        const rowHeight = this.rows.getRowHeight(row);
        
        const cellX = offsetX / colWidth;
        const cellY = offsetY / rowHeight;
        
        // Calculate cell's top-left corner relative to the visible grid area
        const cellCanvasX = gridX - (colWidth * cellX);
        const cellCanvasY = gridY - (rowHeight * cellY);

        const res = {
            row: row,
            col: col,
            x: containerX,
            y: containerY,
            gridX: gridX,
            gridY: gridY,
            cellX: cellX,
            cellY: cellY,
            isHeader: false,
            absoluteGridX: absoluteGridX,
            absoluteGridY: absoluteGridY,
            cellCanvasX: cellCanvasX,
            cellCanvasY: cellCanvasY,
            offsetX: offsetX, // Added for debugging
            offsetY: offsetY, // Added for debugging
            colWidth: colWidth, // Added for debugging
            rowHeight: rowHeight // Added for debugging
        };
        this.canvas.setSelection(res)

        return res;
    }

    /**
     * Handle mouse down for selection start
     */
    handleMouseDown(e) {
        const position = this.getGridPositionFromClick(e.clientX, e.clientY);
        
        if (position.isHeader) {
            if (position.isRowHeader) {
                // Select entire row
                this.selection.selectRow(position.row, e.ctrlKey, e.shiftKey);
            } else if (position.isColHeader) {
                // Select entire column
                this.selection.selectColumn(position.col, e.ctrlKey, e.shiftKey);
            }
        } else {
            // Regular cell selection
            if (e.shiftKey && this.selection.getActiveSelection()) {
                // Range selection
                const active = this.selection.getActiveSelection();
                this.selection.selectRange(
                    active.startRow, active.startCol,
                    position.row, position.col,
                    true
                );
            } else {
                // Start new selection
                this.selection.startSelection(
                    position.row, position.col, 'cell',
                    e.ctrlKey, e.ctrlKey
                );
            }
        }
    }

    /**
     * Handle mouse move for selection drag
     */
    handleMouseMove(e) {
        if (this.selection.isSelecting) {
            const position = this.getGridPositionFromClick(e.clientX, e.clientY);
            if (!position.isHeader) {
                this.selection.updateSelection(position.row, position.col);
            }
        }
    }

    /**
     * Handle mouse up for selection end
     */
    handleMouseUp(e) {
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

        let newRow = active.startRow;
        let newCol = active.startCol;

        switch (e.key) {
            case 'ArrowUp':
                newRow = Math.max(0, active.startRow - 1);
                break;
            case 'ArrowDown':
                newRow = active.startRow + 1;
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, active.startCol - 1);
                break;
            case 'ArrowRight':
                newCol = active.startCol + 1;
                break;
            case 'Escape':
                this.selection.clearAllSelections();
                return;
            case 'a':
                if (e.ctrlKey) {
                    e.preventDefault();
                    return;
                }
                break;
            default:
                return;
        }

        if (newRow !== active.startRow || newCol !== active.startCol) {
            if (e.shiftKey) {
                this.selection.selectRange(
                    active.startRow, active.startCol,
                    newRow, newCol,
                    false
                );
            } else {
                this.selection.selectCell(newRow, newCol);
            }
            e.preventDefault();
        }
    }

    /**
     * Called when selection changes
     */
    onSelectionChange(selections) {
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
            isColumnSelected: (col) => this.selection.isColumnSelected(col)
        };
    }
}