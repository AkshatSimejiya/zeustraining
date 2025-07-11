export class ColumnSelection {
    constructor(viewport) {
        this.viewport = viewport
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;
    }

    hitTest(e) {

        const x = e.clientX;
        const y = e.clientY;

        if (y < this.colHeaderHeight) {
            const resizeInfo = this.viewport.getResizeInfo(x, y);
            return !(resizeInfo.canResize && resizeInfo.type === 'col');
        }

        return false;
    }

    pointerDown(e) {
        console.log("This is the pointer down for col")

        const position = this.viewport.getGridPositionFromClick(e.clientX, e.clientY);

        this.viewport.selection.selectColumn(position.col, e.ctrlKey, e.shiftKey);
    }

    pointerUp(e){
        console.log("This should be pointer up for col")
    }

    pointerMove(e){
        console.log("This should be pointer move for col")
    }

    setCursor(){
        this.viewport.gridContainer.style.cursor = 'pointer';
        console.log("Setting cursor to pointer for col selection");
    }
}
