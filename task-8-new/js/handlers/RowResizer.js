export class RowResizer {
    constructor(viewport) {
        this.viewport = viewport;
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;
    }

    hitTest(e) {
        const x = e.clientX;
        const y = e.clientY;

        if (x < this.rowHeaderWidth) {
            const resizeInfo = this.viewport.getResizeInfo(x, y);
            return resizeInfo.canResize && resizeInfo.type === 'row';
        }

        return false;
    }

    pointerDown(e) {
        const resizeInfo = this.viewport.getResizeInfo(e.clientX, e.clientY);
        
        this.resizeType = resizeInfo.type;
        this.resizeIndex = resizeInfo.index;
        this.resizeStartPos = e.clientY;
        this.resizeStartSize = this.viewport.rows.getRowHeight(resizeInfo.index);
        this.originalSize = this.resizeStartSize;
            
        this.viewport.gridContainer.classList.add('resizing');
            
        e.preventDefault();
    
    }

    pointerUp(e) {
        const rowIndex = this.resizeIndex;
        const oldHeight = this.originalSize;
        const newHeight = this.viewport.rows.getRowHeight(rowIndex);

        this.viewport.grid.eventmanager.onRowResize(rowIndex, oldHeight, newHeight);

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
        this.resizeType = null;
        this.resizeIndex = -1;
        this.resizeStartPos = 0;
        this.resizeStartSize = 0;
        this.originalSize = 0;
        this.viewport.gridContainer.style.cursor = 'default';
        this.viewport.gridContainer.classList.remove('resizing');
    }
}
