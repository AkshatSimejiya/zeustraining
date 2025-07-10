export class CellSelection {
    constructor(grid, viewport) {
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;
        this.viewport = viewport
    }

    hitTest(e) {
        if(e.clientX > this.rowHeaderWidth && e.clientY > this.colHeaderHeight){
            return true;
        }else {
            return false;
        }
    }

    pointerDown(e) {
        console.log("This is the pointer down")
        
        const position = this.viewport.getGridPositionFromClick(e.clientX, e.clientY);
        
        if (position.isHeader) {
            if (position.isRowHeader && position.row >= 0) {
                this.selection.selectRow(position.row, e.ctrlKey, e.shiftKey);
            } else if (position.isColHeader && position.col >= 0) {
                this.selection.selectColumn(position.col, e.ctrlKey, e.shiftKey);
            }
        } else if (position.row >= 0 && position.col >= 0) {
            if (e.shiftKey && this.viewport.selection.getActiveSelection()) {
                // Range selection (existing logic is mostly correct)
                if(this.viewport.selection.isRangeSelection()) {
                    return;
                }
                const active = this.viewport.selection.getActiveSelection();
                this.viewport.selection.selectRange(
                    active.activeRow || active.startRow, 
                    active.activeCol || active.startCol,
                    position.row, position.col,
                    true, // preserveExisting = true
                    active.activeRow || active.startRow,
                    active.activeCol || active.startCol
                );
            } else if (e.ctrlKey) {
                // Multi-selection logic - THIS NEEDS TO BE FIXED
                if (this.viewport.selection.isSelectionAt(position.row, position.col)) {
                    // If cell is already selected, remove it
                    this.viewport.selection.removeSelectionAt(position.row, position.col);
                } else {
                    // Add to selection
                    this.viewport.selection.selectCell(position.row, position.col, true); // preserveExisting = true
                }
                // Don't set up dragging for Ctrl+click
                this.isDragging = false;
            } else {
                // Single selection (existing logic is correct)
                this.viewport.selection.clearAllSelections();
                this.viewport.selection.startSelection(
                    position.row, position.col, 'cell',
                    false, false
                );
                
                this.isDragging = true;
                this.dragStartRow = position.row;
                this.dragStartCol = position.col;
            }
        }
    }

    pointerUp(e){
        console.log("This should be pointer up")
    }

    pointerMove(e){
        console.log("This should be pointer move")
    }
}
