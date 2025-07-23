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
            const helper = this.resizeHelper(x);
            return helper.canResize
        }
        return false;
    }

    pointerDown(e) {
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        
        const x = e.clientX - rect.left;

        this.resizeIndex = this.resizeHelper(x).index; 
        this.resizeStartPos = e.clientX;
        this.resizeStartSize = this.viewport.cols.getColumnWidth(this.resizeIndex);
        this.originalSize = this.resizeStartSize;
        this.viewport.gridContainer.classList.add('resizing');
            
        e.preventDefault();
    }

    pointerUp(e, grid){
        
        const colIndex = this.resizeIndex;
        const oldWidth = this.originalSize;
        const newWidth = this.viewport.cols.getColumnWidth(colIndex);
        
        grid.eventmanager.onColumnResize(colIndex, oldWidth, newWidth);
        
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
        this.resizeIndex = -1;
        this.resizeStartPos = 0;
        this.resizeStartSize = 0;
        this.originalSize = 0;
        this.viewport.gridContainer.classList.remove('resizing');
    }

    setCursor(){
        this.viewport.gridContainer.style.cursor = 'ew-resize';
        
    }

    resizeHelper(x){
        const rowHeaderWidth = 30;
        const gridX = x - rowHeaderWidth;
        const absoluteGridX = gridX + this.viewport.absoluteScrollX;
        const resizeThreshold = 4;
        
        let currentX = 0;
        let colIndex = 0;
        
        while (currentX < absoluteGridX) {
            const colWidth = this.viewport.cols.getColumnWidth(colIndex);
            const nextX = currentX + colWidth;
            
            if (Math.abs(absoluteGridX - nextX) <= resizeThreshold) {
                return {
                    canResize : true,
                    index: colIndex,
                }
            }
            
            currentX = nextX;
            colIndex++;
        }

        return {
            canResize: false
        }
    }
}
