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

        /**@type {number} The current X position of the mouse*/
        this.currentMouseX = 0;

        /**@type {number} The current Y position of the mouse*/
        this.currentMouseY = 0;
    }

    /**
     * Hit test to check if the handler should handle the event or not
     * @param {Event} e The event object of the pointer move
     * @returns {boolean} True if the conditions are met for hit test
     */
    hitTest(e) {
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if(x > this.rowHeaderWidth && y > this.colHeaderHeight && y < rect.height){
            return true;
        }else {
            return false;
        }
    }

    /**
     * Event Handler for pointer down on cell
     * @param {*} e Event object
     */
    pointerDown(e) {
        const position = this.viewport.getGridPositionFromClick(e.clientX, e.clientY);
        
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        this.currentMouseX = e.clientX - rect.left;
        this.currentMouseY = e.clientY - rect.top;
        
        if (e.shiftKey) {
            const active = this.viewport.selection.getActiveSelection();
            this.viewport.selection.selectRange(
                active.activeRow || active.startRow || position.row , 
                active.activeCol || active.startCol || position.col,
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

    /**
     * Pointer up event handler function
     * @param {*} e Event object
     */
    pointerUp(e){
        this.isDragging = false;
        this.dragStartRow = -1;
        this.dragStartCol = -1;
            
        this.viewport.stopAutoScroll();
        
        this.viewport.selection.endSelection();

        this.viewport.calculateStats();
    }

    /**
     * Handler function for pointer move
     * @param {*} e Event object of pointer move
     */
    pointerMove(e){
        if(this.isDragging){
            const rect = this.viewport.gridContainer.getBoundingClientRect();
            const containerX = e.clientX - rect.left;
            const containerY = e.clientY - rect.top;
            
            this.currentMouseX = containerX;
            this.currentMouseY = containerY;
            
            this.viewport.handleAutoScroll(
                containerX, 
                containerY, 
                'cell', 
                {
                    startRow: this.dragStartRow,
                    startCol: this.dragStartCol
                }
            );
            
            if (!this.viewport.autoScrollState || !this.viewport.autoScrollState.isActive) {
                const position = this.viewport.getGridPositionFromClick(e.clientX, e.clientY);
                
                if (position && !position.isHeader) {
                    this.viewport.selection.selectRange(
                        this.dragStartRow, this.dragStartCol,
                        position.row, position.col,
                        false,
                        this.dragStartRow,
                        this.dragStartCol
                    );
                }
            }
        }
    }

    /**
     * Set the cursor when hovered over to 
     * @param {*} e Event object
     */
    setCursor(e){
        this.viewport.gridContainer.style.cursor = 'cell';
    }

    /**
     * Handle dblclick
     * @param {*} e Event object
     */
    dblclick(e){
        const position = this.viewport.getGridPositionFromClick(e.clientX, e.clientY);
        
        this.viewport.selection.selectCell(position.row, position.col);
        this.viewport.createInputBox(position.row, position.col);
    }
}