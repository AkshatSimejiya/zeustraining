export class RowSelection {
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
            return !(resizeInfo.canResize && resizeInfo.type === 'row');
        }

        return false;
    }

    pointerDown(e) {
        console.log("Pointer down on row selection");
        const position = this.viewport.getGridPositionFromClick(e.clientX, e.clientY);
        this.viewport.selection.selectRow(position.row, e.ctrlKey, e.shiftKey);
    }

    pointerUp(e) {
        console.log("Pointer up on row selection");
    }

    pointerMove(e) {
        console.log("Pointer move on row selection");
    }

    setCursor(e) {
        this.viewport.gridContainer.style.cursor = 'url(./icons/next.png) 10 10, pointer';
    }
}
