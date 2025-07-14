export class CellSelection {
    constructor(viewport) {

        /**@type {number} The row header width*/
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;
        this.viewport = viewport;

        /**@type {boolean} Check if its Dragging*/
        this.isDragging = false;

        /**@type {number} The starting of the drag row*/
        this.dragStartRow = -1;

        /**@type {number} The starting of the drag column*/
        this.dragStartCol = -1;
    }

    hitTest(e) {

        const rect = this.viewport.gridContainer.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;


        if(x > this.rowHeaderWidth && y > this.colHeaderHeight){
            return true;
        }else {
            return false;
        }
    }

    pointerDown(e) {
        const position = this.viewport.getGridPositionFromClick(e.clientX, e.clientY);
        if (e.shiftKey) {
            const active = this.viewport.selection.getActiveSelection();
            this.viewport.selection.selectRange(
                active.activeRow || active.startRow, 
                active.activeCol || active.startCol,
                position.row, position.col,
                true,
                active.activeRow || active.startRow,
                active.activeCol || active.startCol
            );
        } else {
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

    pointerUp(e){
        this.isDragging = false;
        this.dragStartRow = -1;
        this.dragStartCol = -1;
            
        this.viewport.stopAutoScroll();
        
        this.viewport.selection.endSelection();
    }

    pointerMove(e){
        
        if(this.isDragging){
            const rect = this.viewport.gridContainer.getBoundingClientRect();
            const containerX = e.clientX - rect.left;
            const containerY = e.clientY - rect.top;
            
            this.viewport.handleAutoScroll(containerX, containerY);
            
            const position = this.viewport.getGridPositionFromClick(e.clientX, e.clientY);
            
            this.viewport.selection.clearAllSelections();
            this.viewport.selection.selectRange(
                this.dragStartRow, this.dragStartCol,
                position.row, position.col,
                false,
                this.dragStartRow,
                this.dragStartCol
            );
        }
    }

    setCursor(e){
        this.viewport.gridContainer.style.cursor = 'cell';
    }

    dblclick(e){
        const position = this.viewport.getGridPositionFromClick(e.clientX, e.clientY);
        
        this.viewport.selection.selectCell(position.row, position.col);
        this.viewport.createInputBox(position.row, position.col);
    }
}
