export class ColumnSelection {
    constructor(viewport) {
        this.viewport = viewport
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;

        this.isDragging = false;
        this.startCol = null;
    }

    hitTest(e) {
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (y>0 && y < this.colHeaderHeight && x > 30) {
            const resizeInfo = this.viewport.getResizeInfo(x, y);
            return !(resizeInfo.canResize && resizeInfo.type === 'col');
        }

        return false;
    }

    pointerDown(e) {
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;

        const position = this.viewport.getGridPositionFromClick(relativeX, relativeY);

        this.viewport.selection.selectColumn(position.col, e.ctrlKey, e.shiftKey);
    }

    pointerUp(e){
        console.log("This should be pointer up for col")
    }

    pointerMove(e){
        console.log("This should be pointer move for col")
    }

    setCursor(){
        this.viewport.gridContainer.style.cursor = 'url(./icons/down-arrow.png) 10 10, pointer';
    }
}