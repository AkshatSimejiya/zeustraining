export class ColumnResizer {
    constructor(viewport) {
        this.viewport = viewport;
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;
    }

    hitTest(e) {
        
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (y>0 && y < this.colHeaderHeight) {
            const resizeInfo = this.viewport.getResizeInfo(x, y);
            return resizeInfo.canResize && resizeInfo.type === 'col';
        }
        return false;
    }

    pointerDown(e) {
        const resizeInfo = this.viewport.getResizeInfo(e.clientX, e.clientY);
        
        this.resizeType = resizeInfo.type;
        this.resizeIndex = resizeInfo.index;
        this.resizeStartPos = e.clientX;
        this.resizeStartSize = this.viewport.cols.getColumnWidth(resizeInfo.index);
        this.originalSize = this.resizeStartSize;
            
        this.viewport.gridContainer.classList.add('resizing');
            
        e.preventDefault();
    }

    pointerUp(e){
        const colIndex = this.resizeIndex;
        const oldWidth = this.originalSize;
        const newWidth = this.viewport.cols.getColumnWidth(colIndex);

        this.viewport.grid.eventmanager.onColumnResize(colIndex, oldWidth, newWidth);

        this.viewport.updateRenderer();
        this.cleanup();
        e.preventDefault();
    }

    pointerMove(e){
        const delta = e.clientX - this.resizeStartPos;
        const newSize = Math.max(20, this.resizeStartSize + delta);
        this.viewport.cols.setColumnWidth(this.resizeIndex, newSize);
        
        this.viewport.updateColumnHeader();
        
        e.preventDefault();
    }

    cleanup() {
        this.resizeType = null;
        this.resizeIndex = -1;
        this.resizeStartPos = 0;
        this.resizeStartSize = 0;
        this.originalSize = 0;
        this.viewport.gridContainer.classList.remove('resizing');
    }

    setCursor(){
        this.viewport.gridContainer.style.cursor = 'ew-resize';
        
    }
}
