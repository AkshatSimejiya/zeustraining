// export class ColumnSelection {
//     constructor(viewport) {
//         this.viewport = viewport
//         this.rowHeaderWidth = 30;
//         this.colHeaderHeight = 25;

//         this.isDragging = false;
//         this.startCol = null;
//     }

//     hitTest(e) {
//         const rect = this.viewport.gridContainer.getBoundingClientRect();
        
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
        
//         if (y>0 && y < this.colHeaderHeight && x > 30) {
//             const resizeInfo = this.viewport.getResizeInfo(x, y);
//             return !(resizeInfo.canResize && resizeInfo.type === 'col');
//         }

//         return false;
//     }

//     pointerDown(e) {
//         const rect = this.viewport.gridContainer.getBoundingClientRect();
//         const relativeX = e.clientX - rect.left;
//         const relativeY = e.clientY - rect.top;

//         const position = this.viewport.getGridPositionFromClick(relativeX, relativeY);

//         this.viewport.selection.selectColumn(position.col, e.ctrlKey, e.shiftKey);
//     }

//     pointerUp(e){
//         console.log("This should be pointer up for col")
//     }

//     pointerMove(e){
//         console.log("This should be pointer move for col")
//     }

//     setCursor(){
//         this.viewport.gridContainer.style.cursor = 'url(./icons/down-arrow.png) 10 10, pointer';
//     }
// }

export class ColumnSelection {
    constructor(viewport) {
        this.viewport = viewport;
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;

        this.isDragging = false;
        this.startCol = null;
        this.lastRenderedCol = null;
    }

    hitTest(e) {
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (y > 0 && y < this.colHeaderHeight && x > this.rowHeaderWidth) {
            const resizeInfo = this.viewport.getResizeInfo(x, y);
            return !(resizeInfo.canResize && resizeInfo.type === 'col');
        }

        return false;
    }

    pointerDown(e) {
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;

        const { col } = this.viewport.getGridPositionFromClick(relativeX, relativeY);
        if (col == null) return;

        this.isDragging = true;
        this.startCol = col;
        this.lastRenderedCol = col;

        this.viewport.selection.startSelection(0, col, 'column');
    }

    pointerMove(e) {
        if (!this.isDragging || this.startCol == null) return;

        const rect = this.viewport.gridContainer.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;

        const { col } = this.viewport.getGridPositionFromClick(relativeX, 0);
        if (col == null || col === this.lastRenderedCol) return;

        this.lastRenderedCol = col;

        // Only update if bounds actually changed
        const minCol = Math.min(this.startCol, col);
        const maxCol = Math.max(this.startCol, col);

        const activeSelection = this.viewport.selection.getActiveSelection();
        if (
            activeSelection &&
            activeSelection.startCol === minCol &&
            activeSelection.endCol === maxCol
        ) {
            return; // No change, skip
        }

        this.viewport.selection.selectRange(
            0,
            this.startCol,
            this.viewport.selection.maxRows - 1,
            col,
            false,
            0,
            this.startCol,
            'column'
        );
    }

    pointerUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.startCol = null;
            this.lastRenderedCol = null;
            this.viewport.selection.endSelection();
        }
    }

    setCursor() {
        this.viewport.gridContainer.style.cursor = 'url(./icons/down-arrow.png) 10 10, pointer';
    }
}
