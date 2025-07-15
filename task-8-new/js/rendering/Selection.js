export class Selection {
    constructor(maxRows = 100, maxCols = 100) {
        this.selections = [];
        this.isSelecting = false;
        this.callbacks = {};
        this.maxRows = maxRows;
        this.maxCols = maxCols;
        this.lastRowSelection = null;
        this.lastColSelection = null; 
    }

    /**
     * Function to select the range of cells
     * @param {number} startRow The starting row of range
     * @param {number} startCol The starting column of the range
     * @param {number} endRow The ending row of the range
     * @param {number} endCol The ending column of the range
     * @param {boolean} preserveExisting 
     * @param {number} activeRow The row of active cell
     * @param {number} activeCol The col of active cell
     * @returns {object} The selected range
     */
    selectRange(startRow, startCol, endRow, endCol, preserveExisting = false, activeRow = null, activeCol = null, type = "cell") {
        if (!preserveExisting) {
            this.clearAllSelections();
        }

        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        const selection = {
            startRow: minRow,
            endRow: maxRow,
            startCol: minCol,
            endCol: maxCol,
            activeRow: activeRow || startRow,
            activeCol: activeCol || startCol,
            type: type
        };

        this.selections.push(selection);
        this.triggerCallback('onSelectionChange', this.selections);
        return selection;
    }

    /**
     * Select a particular row or range of rows
     * @param {number} row The row index 
     * @param {boolean} preserveExisting 
     * @param {boolean} multiple 
     * @param {boolean} shift Whether shift key is being held
     * @returns {object} selection object which contains the data about the selection
     */
    selectRow(row, preserveExisting = false,shift = false) {
        if (shift && this.lastRowSelection !== null) {
            const startRow = Math.min(this.lastRowSelection, row);
            const endRow = Math.max(this.lastRowSelection, row);
            
            let preserve = this.lastRowSelection;

            if (!preserveExisting) {
                this.clearAllSelections();
            }

            const selection = {
                startRow: startRow,
                endRow: endRow,
                startCol: 0,
                endCol: this.maxCols - 1,
                activeRow: preserve,
                activeCol: 0,
                type: 'row'
            };

            this.selections.push(selection);
            this.triggerCallback('onSelectionChange', this.selections);
            return selection;
        }

        if (!preserveExisting) {
            this.clearAllSelections();
        }

        const selection = {
            startRow: row,
            endRow: row,
            startCol: 0,
            endCol: this.maxCols - 1,
            activeRow: row,
            activeCol: 0,
            type: 'row'
        };

        this.selections.push(selection);
        this.lastRowSelection = row; // Remember this row for future shift-clicks
        this.triggerCallback('onSelectionChange', this.selections);
        return selection;
    }

    /**
     * Select a column or range of columns
     * @param {number} col The col index
     * @param {boolean} preserveExisting If we want to keep the existing selection or not
     * @param {boolean} shift Whether shift key is being held
     * @returns {object} Selection object which contains the data about the selections
     */
    selectColumn(col, preserveExisting = false, shift = false) {
        if (shift && this.lastColSelection !== null) {
            const startCol = Math.min(this.lastColSelection, col);
            const endCol = Math.max(this.lastColSelection, col);

            let preserve = this.lastColSelection;
            
            if (!preserveExisting) {
                this.clearAllSelections();
            }

            const selection = {
                startRow: 0,
                endRow: this.maxRows - 1,
                startCol: startCol,
                endCol: endCol,
                activeRow: 0,
                activeCol: preserve,
                type: 'column'
            };

            this.selections.push(selection);
            this.triggerCallback('onSelectionChange', this.selections);
            return selection;
        }

        if (!preserveExisting) {
            this.clearAllSelections();
        }

        const selection = {
            startRow: 0,
            endRow: this.maxRows - 1,
            startCol: col,
            endCol: col,
            activeRow: 0,
            activeCol: col,
            type: 'column'
        };

        this.selections.push(selection);
        this.lastColSelection = col;
        this.triggerCallback('onSelectionChange', this.selections);
        return selection;
    }

    /**
     * Get the selection bounds 
     * @returns minRow, maxRow, minCol, maxCol 
     */
    getSelectionBounds() {
        if (this.selections.length === 0) return null;

        let minRow = Infinity, maxRow = -Infinity;
        let minCol = Infinity, maxCol = -Infinity;

        for (const selection of this.selections) {
            minRow = Math.min(minRow, selection.startRow);
            maxRow = Math.max(maxRow, selection.endRow);
            minCol = Math.min(minCol, selection.startCol);
            maxCol = Math.max(maxCol, selection.endCol);
        }

        return { minRow, maxRow, minCol, maxCol };
    }

    /**
     * Select cell
     * @param {number} row The row index of the cell that needs to be selected 
     * @param {number} col The column index of the cell that needs to be selected
     * @returns the selection object that is created
     */
    selectCell(row, col) {
        this.clearAllSelections();
        const selection = {
            startRow: row,
            endRow: row,
            startCol: col,
            endCol: col,
            activeRow: row,
            activeCol: col,
            type: 'cell'
        };

        this.selections.push(selection);
        this.triggerCallback('onSelectionChange', this.selections);
        return selection;
    }

    /**
     * Function to check if the selection is range or not
     * @returns {boolean} True if the range is selected
     */
    isRangeSelection() {
        const active = this.getActiveSelection();
        if (!active) return false;

        const isSingleRow = active.startRow === active.endRow;
        const isSingleCol = active.startCol === active.endCol;

        return !(isSingleRow && isSingleCol);
    }

    /**
     * Start the selection for cell range
     * @param {number} row The row index from where the selection needs to start
     * @param {number} col The col index for the selection start
     * @param {*} type Cell selection
     * @param {boolean} preserveExisting If we need to preserve the existing selection or not
     * @returns {object} The selection object 
     */
    startSelection(row, col, type = 'cell', preserveExisting = false) {
        if (!preserveExisting) {
            this.clearAllSelections();
        }

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
        this.isSelecting = true;
        this.triggerCallback('onSelectionChange', this.selections);
        return selection;
    }

    /**
     * End the selection by setting the isSelecting flag to false
     */
    endSelection() {
        this.isSelecting = false;
    }

    /**
     * Add new cells to the selection
     * @param {number} row The row index of the cell
     * @param {number} col The col index of the cell
     * @param {*} type The type of selecrion
     * @returns {object} Selection object
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
     * Get the active selection
     * @returns {object} Returns the last active selection
     */
    getActiveSelection() {
        return this.selections.length > 0 ? this.selections[this.selections.length - 1] : null;
    }

    /**
     * Fetch all the selection
     * @returns {object} Get all the active selections
     */
    getAllSelections() {
        return this.selections;
    }

    /**
     * Clear all the selections
     */
    clearAllSelections() {
        this.selections = [];
        this.isSelecting = false;
        this.lastRowSelection = null; // Clear last row selection
        this.lastColSelection = null; // Clear last column selection
        this.triggerCallback('onSelectionChange', this.selections);
    }

    /**
     * Check if the cell is selected or not
     * @param {number} row The row index of the cell that needs to be checked
     * @param {number} col The col index of the cell that needs to be checked
     * @returns {boolean} Boolean value of the result
     */
    isCellSelected(row, col) {
        return this.selections.some(sel => 
            row >= sel.startRow && row <= sel.endRow &&
            col >= sel.startCol && col <= sel.endCol
        );
    }

    /**
     * Check if the row is selected or not
     * @param {number} row Row index 
     * @returns {boolean}
     */
    isRowSelected(row) {
        return this.selections.some(sel => 
            sel.type === 'row' && row >= sel.startRow && row <= sel.endRow
        );
    }

    /**
     * Check if the column is selected or not
     * @param {number} col Col Index
     * @returns {boolean} 
     */
    isColumnSelected(col) {
        return this.selections.some(sel => 
            sel.type === 'column' && col >= sel.startCol && col <= sel.endCol
        );
    }

    /**
     * Update the maximum bounds for rows and columns
     * @param {number} maxRows Maximum number of rows
     * @param {number} maxCols Maximum number of columns
     */
    updateMaxBounds(maxRows, maxCols) {
        this.maxRows = maxRows;
        this.maxCols = maxCols;
    }

    /**
     * Setting the callback event 
     * @param {*} eventName Event name
     * @param {*} callback 
     */
    setCallback(eventName, callback) {
        this.callbacks[eventName] = callback;
    }

    /**
     * Trigger the callback events
     * @param {*} eventName Event name
     * @param {*} data 
     */
    triggerCallback(eventName, data) {
        if (this.callbacks[eventName]) {
            this.callbacks[eventName](data);
        }
    }
}