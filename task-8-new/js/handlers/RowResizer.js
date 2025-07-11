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
        console.log("Pointer down on row resizer");
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
        console.log("Pointer up on row resizer");
            
        this.viewport.updateRenderer();
        
        this.cleanup();
        e.preventDefault();
    }

    pointerMove(e) {
        console.log("Pointer move on row resizer");
        
        const delta = e.clientY - this.resizeStartPos;
        const newSize = Math.max(20, this.resizeStartSize + delta);
        this.viewport.rows.setRowHeight(this.resizeIndex, newSize);
        
        this.viewport.updateRowHeader();
        
        e.preventDefault();
    }

    setCursor(){
        this.viewport.gridContainer.style.cursor = 'ns-resize';
        console.log("Setting cursor to pointer for row resize");
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
