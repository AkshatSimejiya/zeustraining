export class Selection {
    constructor() {
        this.selections = new Map(); // Store multiple selections
        this.activeSelection = null; // Current active selection
        this.selectionMode = 'cell'; // 'cell', 'row', 'column', 'range'
        this.isSelecting = false; // Track if currently selecting
        this.selectionStart = null; // Start point for range selection
        this.selectionEnd = null; // End point for range selection
        this.callbacks = {
            onSelectionChange: null,
            onSelectionStart: null,
            onSelectionEnd: null
        };
    }

    /**
     * Selection types enum
     */
    static SELECTION_TYPES = {
        CELL: 'cell',
        ROW: 'row',
        COLUMN: 'column',
        RANGE: 'range',
        MULTIPLE: 'multiple'
    };

    /**
     * Set callback functions for selection events
     * @param {string} event - Event name ('onSelectionChange', 'onSelectionStart', 'onSelectionEnd')
     * @param {function} callback - Callback function
     */
    setCallback(event, callback) {
        if (this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event] = callback;
        }
    }

    /**
     * Start a new selection
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {string} type - Selection type
     * @param {boolean} extend - Whether to extend existing selection
     * @param {boolean} toggle - Whether to toggle selection
     */
    startSelection(row, col, type = 'cell', extend = false, toggle = false) {
        this.isSelecting = true;
        this.selectionStart = { row, col };
        this.selectionEnd = { row, col };
        this.selectionMode = type;

        if (!extend && !toggle) {
            this.clearAllSelections();
        }

        const selectionId = this.generateSelectionId(row, col, type);
        
        if (toggle && this.selections.has(selectionId)) {
            this.removeSelection(selectionId);
        } else {
            this.activeSelection = this.createSelection(row, col, type);
            this.selections.set(selectionId, this.activeSelection);
        }

        if (this.callbacks.onSelectionStart) {
            this.callbacks.onSelectionStart(this.activeSelection);
        }

        this.notifySelectionChange();
    }

    /**
     * Update selection during drag/extend operations
     * @param {number} row - Current row
     * @param {number} col - Current column
     */
    updateSelection(row, col) {
        if (!this.isSelecting || !this.activeSelection) return;

        this.selectionEnd = { row, col };
        
        // Update the active selection based on type
        switch (this.selectionMode) {
            case 'cell':
                this.activeSelection = this.createRangeSelection(
                    this.selectionStart.row, this.selectionStart.col,
                    row, col
                );
                break;
            case 'row':
                this.activeSelection = this.createRowSelection(
                    Math.min(this.selectionStart.row, row),
                    Math.max(this.selectionStart.row, row)
                );
                break;
            case 'column':
                this.activeSelection = this.createColumnSelection(
                    Math.min(this.selectionStart.col, col),
                    Math.max(this.selectionStart.col, col)
                );
                break;
            case 'range':
                this.activeSelection = this.createRangeSelection(
                    this.selectionStart.row, this.selectionStart.col,
                    row, col
                );
                break;
        }

        // Update the selection in the map
        const selectionId = this.generateSelectionId(
            this.selectionStart.row, this.selectionStart.col, this.selectionMode
        );
        this.selections.set(selectionId, this.activeSelection);

        this.notifySelectionChange();
    }

    /**
     * End the current selection
     */
    endSelection() {
        this.isSelecting = false;
        
        if (this.callbacks.onSelectionEnd && this.activeSelection) {
            this.callbacks.onSelectionEnd(this.activeSelection);
        }
    }

    /**
     * Select a single cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {boolean} extend - Whether to extend existing selection
     * @param {boolean} toggle - Whether to toggle selection
     */
    selectCell(row, col, extend = false, toggle = false) {
        this.startSelection(row, col, 'cell', extend, toggle);
        this.endSelection();
    }

    /**
     * Select an entire row
     * @param {number} row - Row index
     * @param {boolean} extend - Whether to extend existing selection
     * @param {boolean} toggle - Whether to toggle selection
     */
    selectRow(row, extend = false, toggle = false) {
        this.startSelection(row, 0, 'row', extend, toggle);
        this.endSelection();
    }

    /**
     * Select an entire column
     * @param {number} col - Column index
     * @param {boolean} extend - Whether to extend existing selection
     * @param {boolean} toggle - Whether to toggle selection
     */
    selectColumn(col, extend = false, toggle = false) {
        this.startSelection(0, col, 'column', extend, toggle);
        this.endSelection();
    }

    /**
     * Select a range of cells
     * @param {number} startRow - Start row
     * @param {number} startCol - Start column
     * @param {number} endRow - End row
     * @param {number} endCol - End column
     * @param {boolean} extend - Whether to extend existing selection
     */
    selectRange(startRow, startCol, endRow, endCol, extend = false) {
        if (!extend) {
            this.clearAllSelections();
        }

        const selection = this.createRangeSelection(startRow, startCol, endRow, endCol);
        const selectionId = this.generateSelectionId(startRow, startCol, 'range');
        
        this.selections.set(selectionId, selection);
        this.activeSelection = selection;
        this.notifySelectionChange();
    }

    /**
     * Create a single cell selection object
     */
    createSelection(row, col, type) {
        switch (type) {
            case 'cell':
                return {
                    type: 'cell',
                    startRow: row,
                    startCol: col,
                    endRow: row,
                    endCol: col,
                    cells: [{ row, col }]
                };
            case 'row':
                return this.createRowSelection(row, row);
            case 'column':
                return this.createColumnSelection(col, col);
            default:
                return this.createSelection(row, col, 'cell');
        }
    }

    /**
     * Create a row selection object
     */
    createRowSelection(startRow, endRow) {
        return {
            type: 'row',
            startRow: Math.min(startRow, endRow),
            endRow: Math.max(startRow, endRow),
            startCol: 0,
            endCol: Infinity, // Represents entire row
            isFullRow: true
        };
    }

    /**
     * Create a column selection object
     */
    createColumnSelection(startCol, endCol) {
        return {
            type: 'column',
            startRow: 0,
            endRow: Infinity, // Represents entire column
            startCol: Math.min(startCol, endCol),
            endCol: Math.max(startCol, endCol),
            isFullColumn: true
        };
    }

    /**
     * Create a range selection object
     */
    createRangeSelection(startRow, startCol, endRow, endCol) {
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        const cells = [];
        for (let r = minRow; r <= maxRow; r++) {
            for (let c = minCol; c <= maxCol; c++) {
                cells.push({ row: r, col: c });
            }
        }

        return {
            type: 'range',
            startRow: minRow,
            endRow: maxRow,
            startCol: minCol,
            endCol: maxCol,
            cells: cells
        };
    }

    /**
     * Generate a unique ID for a selection
     */
    generateSelectionId(row, col, type) {
        return `${type}-${row}-${col}-${Date.now()}`;
    }

    /**
     * Check if a cell is selected
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {boolean} - True if cell is selected
     */
    isCellSelected(row, col) {
        for (const selection of this.selections.values()) {
            if (this.isInSelection(row, col, selection)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a row is selected
     * @param {number} row - Row index
     * @returns {boolean} - True if row is selected
     */
    isRowSelected(row) {
        for (const selection of this.selections.values()) {
            if (selection.isFullRow && row >= selection.startRow && row <= selection.endRow) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a column is selected
     * @param {number} col - Column index
     * @returns {boolean} - True if column is selected
     */
    isColumnSelected(col) {
        for (const selection of this.selections.values()) {
            if (selection.isFullColumn && col >= selection.startCol && col <= selection.endCol) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a cell is within a selection
     */
    isInSelection(row, col, selection) {
        return row >= selection.startRow && row <= selection.endRow &&
               col >= selection.startCol && col <= selection.endCol;
    }

    /**
     * Get all selected cells
     * @returns {Array} - Array of {row, col} objects
     */
    getSelectedCells() {
        const cells = [];
        for (const selection of this.selections.values()) {
            if (selection.cells) {
                cells.push(...selection.cells);
            } else {
                // Generate cells for row/column selections
                for (let r = selection.startRow; r <= selection.endRow; r++) {
                    for (let c = selection.startCol; c <= selection.endCol; c++) {
                        cells.push({ row: r, col: c });
                    }
                }
            }
        }
        return cells;
    }

    /**
     * Get all selections
     * @returns {Array} - Array of selection objects
     */
    getAllSelections() {
        return Array.from(this.selections.values());
    }

    /**
     * Get the active selection
     * @returns {Object|null} - Active selection object
     */
    getActiveSelection() {
        return this.activeSelection;
    }

    /**
     * Clear all selections
     */
    clearAllSelections() {
        this.selections.clear();
        this.activeSelection = null;
        this.notifySelectionChange();
    }

    /**
     * Remove a specific selection
     * @param {string} selectionId - Selection ID to remove
     */
    removeSelection(selectionId) {
        if (this.selections.has(selectionId)) {
            this.selections.delete(selectionId);
            if (this.activeSelection && this.activeSelection.id === selectionId) {
                this.activeSelection = null;
            }
            this.notifySelectionChange();
        }
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
     * Notify listeners of selection changes
     */
    notifySelectionChange() {
        if (this.callbacks.onSelectionChange) {
            this.callbacks.onSelectionChange(this.getAllSelections());
        }
    }

    /**
     * Serialize selections for saving/loading
     * @returns {Object} - Serialized selections
     */
    serialize() {
        return {
            selections: Array.from(this.selections.entries()),
            activeSelection: this.activeSelection,
            selectionMode: this.selectionMode
        };
    }

    /**
     * Deserialize selections from saved data
     * @param {Object} data - Serialized selection data
     */
    deserialize(data) {
        this.selections = new Map(data.selections);
        this.activeSelection = data.activeSelection;
        this.selectionMode = data.selectionMode;
        this.notifySelectionChange();
    }
}