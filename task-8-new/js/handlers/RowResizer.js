export class RowResizer {
    constructor(viewport) {
        this.viewport = viewport;
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;
    }

    hitTest(e) {
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        

        if (x < this.rowHeaderWidth) {
            const helper = this.resizeHelper(y);
            return helper.canResize
        }

        return false;
    }

    pointerDown(e) {

        const rect = this.viewport.gridContainer.getBoundingClientRect();
        
        const y = e.clientY - rect.top;

        const resizeInfo = this.resizeHelper(y);

        this.resizeIndex = resizeInfo.index;
        this.resizeStartPos = e.clientY;
        this.resizeStartSize = this.viewport.rows.getRowHeight(resizeInfo.index);
        this.originalSize = this.resizeStartSize;

        this.viewport.gridContainer.classList.add('resizing');

        e.preventDefault();
    }

    pointerUp(e, grid) {
        const rowIndex = this.resizeIndex;
        const oldHeight = this.originalSize;
        const newHeight = this.viewport.rows.getRowHeight(rowIndex);

        grid.eventmanager.onRowResize(rowIndex, oldHeight, newHeight);

        this.viewport.updateRenderer();
        this.cleanup();
        e.preventDefault();
    }

    pointerMove(e) {
        const delta = e.clientY - this.resizeStartPos;
        const newSize = Math.max(20, this.resizeStartSize + delta);
        this.viewport.rows.setRowHeight(this.resizeIndex, newSize);
        
        this.viewport.updateRowHeader();
        
        e.preventDefault();
    }

    setCursor(){
        this.viewport.gridContainer.style.cursor = 'ns-resize';
    }

    cleanup() {
        this.resizeIndex = -1;
        this.resizeStartPos = 0;
        this.resizeStartSize = 0;
        this.originalSize = 0;
        this.viewport.gridContainer.style.cursor = 'default';
        this.viewport.gridContainer.classList.remove('resizing');
    }

    resizeHelper(y){
        const colHeaderHeight = 25;
        const gridY = y - colHeaderHeight;
        const absoluteGridY = gridY + this.viewport.absoluteScrollY;
        
        let currentY = 0;
        let rowIndex = 0;
        const resizeThreshold = 4;
        
        while (currentY < absoluteGridY) {
            const rowHeight = this.viewport.rows.getRowHeight(rowIndex);
            const nextY = currentY + rowHeight;
            
            if (Math.abs(absoluteGridY - nextY) <= resizeThreshold) {
                return {
                    canResize: true,
                    index: rowIndex
                };
            }
            currentY = nextY;
            rowIndex++;
        }

        return {
            canResize: false
        }
    }
}
