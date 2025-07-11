export class ColumnResizer {
    constructor(viewport) {
        this.viewport = viewport;
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;
    }

    hitTest(e) {
        const x = e.clientX;
        const y = e.clientY;

        if (y < this.colHeaderHeight) {
            const resizeInfo = this.viewport.getResizeInfo(x, y);
            return resizeInfo.canResize && resizeInfo.type === 'col';
        }
        return false;
    }

    pointerDown(e) {
        console.log("Pointer down on row resizer");
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
        console.log("This should be pointer up on column resize")

        this.viewport.updateRenderer();
        
        this.cleanup();
        e.preventDefault();
    }

    pointerMove(e){
        console.log("Pointer move on column resizer");
        
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
        this.viewport.gridContainer.style.cursor = 'default';
        this.viewport.gridContainer.classList.remove('resizing');
    }

    setCursor(){
        this.viewport.gridContainer.style.cursor = 'ew-resize';
        console.log("Setting cursor to pointer for col selection");
    }
}
