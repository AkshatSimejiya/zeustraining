export class RowSelection {
    constructor(viewport) {
        this.viewport = viewport;
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;

        this.isDragging = false;
        this.startRow = null;
        this.lastRenderedRow = null;
    }

    hitTest(e) {
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < this.rowHeaderWidth && y > this.colHeaderHeight) {
            return true;
        }

        return false;
    }

    pointerDown(e) {
        const rect = this.viewport.gridContainer.getBoundingClientRect();
        const relativeX = e.clientX;
        const relativeY = e.clientY;

        const { row } = this.viewport.getGridPositionFromClick(relativeX, relativeY);
        if (row == null) return;

        this.isDragging = true;
        this.startRow = row;
        this.lastRenderedRow = row;

        // Start the row selection
        this.viewport.selection.startSelection(row, 0, 'row');
    }

    pointerMove(e) {
        if (!this.isDragging || this.startRow == null) return;

        const rect = this.viewport.gridContainer.getBoundingClientRect();
        const relativeX = e.clientX;
        const relativeY = e.clientY;

        const { row } = this.viewport.getGridPositionFromClick(relativeX, relativeY);
        if (row == null || row === this.lastRenderedRow) return;

        this.lastRenderedRow = row;

        const minRow = Math.min(this.startRow, row);
        const maxRow = Math.max(this.startRow, row);

        const activeSelection = this.viewport.selection.getActiveSelection();
        if (
            activeSelection &&
            activeSelection.startRow === minRow &&
            activeSelection.endRow === maxRow
        ) {
            return; // no change
        }

        this.viewport.selection.selectRange(
            this.startRow,
            0,
            row,
            this.viewport.selection.maxCols - 1,
            false,
            this.startRow,
            0,
            'row'
        );
    }

    pointerUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.startRow = null;
            this.lastRenderedRow = null;
            this.viewport.selection.endSelection();
        }
    }

    setCursor(e) {
        this.viewport.gridContainer.style.cursor = 'url(./icons/next.png) 10 10, pointer';
    }
}
