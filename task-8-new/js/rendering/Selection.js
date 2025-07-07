export class Selection {
    constructor() {
        this.selections = [];
        this.isSelecting = false;
        this.callbacks = {};
    }

    /**
     * Select a range of cells with active cell tracking
     */
    selectRange(startRow, startCol, endRow, endCol, preserveExisting = false, activeRow = null, activeCol = null) {
        if (!preserveExisting) {
            this.clearAllSelections();
        }

        // Ensure start is top-left and end is bottom-right
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        const selection = {
            startRow: minRow,
            endRow: maxRow,
            startCol: minCol,
            endCol: maxCol,
            activeRow: activeRow || startRow, // The cell where selection actually started
            activeCol: activeCol || startCol,
            type: 'cell'
        };

        this.selections.push(selection);
        this.triggerCallback('onSelectionChange', this.selections);
        return selection;
    }

    /**
     * Get selection bounds for rendering
     * @returns {Object} - {minRow, maxRow, minCol, maxCol}
     */
    getSelectionBounds() {
        if (this.selections.size === 0) return null;

        let minRow = Infinity, maxRow = -Infinity;
        let minCol = Infinity, maxCol = -Infinity;

        for (const selection of this.selections.values()) {
            minRow = Math.min(minRow, selection.startRow);
            maxRow = Math.max(maxRow, selection.endRow);
            minCol = Math.min(minCol, selection.startCol);
            maxCol = Math.max(maxCol, selection.endCol);
        }

        return { minRow, maxRow, minCol, maxCol };
    }

    /**
     * Select a single cell
     */
    selectCell(row, col) {
        this.clearAllSelections();
        const selection = {
            startRow: row,
            endRow: row,
            startCol: col,
            endCol: col,
            activeRow: row, // For single cell, active is the same as start
            activeCol: col,
            type: 'cell'
        };

        this.selections.push(selection);
        this.triggerCallback('onSelectionChange', this.selections);
        return selection;
    }

    /**
     * Check if the active selection is a range (more than one cell)
     * @returns {boolean}
     */
    isRangeSelection() {
        const active = this.getActiveSelection();
        if (!active) return false;

        const isSingleRow = active.startRow === active.endRow;
        const isSingleCol = active.startCol === active.endCol;

        return !(isSingleRow && isSingleCol); // true if it's a range
    }


    /**
     * Start a new selection (for mouse down)
     */
    startSelection(row, col, type = 'cell', preserveExisting = false, isMultiSelect = false) {
        if (!preserveExisting) {
            this.clearAllSelections();
        }

        const selection = {
            startRow: row,
            endRow: row,
            startCol: col,
            endCol: col,
            activeRow: row, // Track where the selection started
            activeCol: col,
            type: type
        };

        this.selections.push(selection);
        this.isSelecting = true;
        this.triggerCallback('onSelectionChange', this.selections);
        return selection;
    }

    /**
     * Update current selection (for mouse drag)
     */
    updateSelection(row, col) {
        if (this.selections.length === 0) return;

        const currentSelection = this.selections[this.selections.length - 1];
        
        // Keep the original active cell, but update the range
        const activeRow = currentSelection.activeRow;
        const activeCol = currentSelection.activeCol;
        
        // Update the range based on active cell and current position
        currentSelection.startRow = Math.min(activeRow, row);
        currentSelection.endRow = Math.max(activeRow, row);
        currentSelection.startCol = Math.min(activeCol, col);
        currentSelection.endCol = Math.max(activeCol, col);

        this.triggerCallback('onSelectionChange', this.selections);
    }

    /**
     * End selection (for mouse up)
     */
    endSelection() {
        this.isSelecting = false;
    }

    /**
     * Add a new selection to existing ones
     */
    addSelection(row, col, type = 'cell') {
        const selection = {
            startRow: row,
            endRow: row,
            startCol: col,
            endCol: col,
            activeRow: row,
            activeCol: col,
            type: type
        };

        this.selections.push(selection);
        this.triggerCallback('onSelectionChange', this.selections);
        return selection;
    }

    /**
     * Get the active selection (usually the last one)
     */
    getActiveSelection() {
        return this.selections.length > 0 ? this.selections[this.selections.length - 1] : null;
    }

    /**
     * Get all selections
     */
    getAllSelections() {
        return this.selections;
    }

    /**
     * Clear all selections
     */
    clearAllSelections() {
        this.selections = [];
        this.isSelecting = false;
        this.triggerCallback('onSelectionChange', this.selections);
    }

    /**
     * Check if a cell is selected
     */
    isCellSelected(row, col) {
        return this.selections.some(sel => 
            row >= sel.startRow && row <= sel.endRow &&
            col >= sel.startCol && col <= sel.endCol
        );
    }

    /**
     * Set callback for selection changes
     */
    setCallback(eventName, callback) {
        this.callbacks[eventName] = callback;
    }

    /**
     * Trigger callback
     */
    triggerCallback(eventName, data) {
        if (this.callbacks[eventName]) {
            this.callbacks[eventName](data);
        }
    }
}