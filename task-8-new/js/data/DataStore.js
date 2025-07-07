export class DataStore {
    constructor() {
        this.data = new Map(); // Using Map for sparse storage
        this.callbacks = {};
    }

    /**
     * Get cell value
     */
    getCellValue(row, col) {
        const key = `${row},${col}`;
        return this.data.get(key) || '';
    }

    /**
     * Set cell value
     */
    setCellValue(row, col, value) {
        const key = `${row},${col}`;
        const oldValue = this.data.get(key) || '';
        
        if (value === '' || value === null || value === undefined) {
            this.data.delete(key);
        } else {
            this.data.set(key, value);
        }
        
        // Trigger callback if value changed
        if (oldValue !== value) {
            this.triggerCallback('onCellValueChanged', { row, col, oldValue, newValue: value });
        }
    }

    /**
     * Get all non-empty cells
     */
    getAllCells() {
        const cells = [];
        for (let [key, value] of this.data) {
            const [row, col] = key.split(',').map(Number);
            cells.push({ row, col, value });
        }
        return cells;
    }

    /**
     * Clear all data
     */
    clear() {
        this.data.clear();
        this.triggerCallback('onDataCleared');
    }

    /**
     * Get row data
     */
    getRowData(row) {
        const rowData = {};
        for (let [key, value] of this.data) {
            const [r, c] = key.split(',').map(Number);
            if (r === row) {
                rowData[c] = value;
            }
        }
        return rowData;
    }

    /**
     * Get column data
     */
    getColumnData(col) {
        const colData = {};
        for (let [key, value] of this.data) {
            const [r, c] = key.split(',').map(Number);
            if (c === col) {
                colData[r] = value;
            }
        }
        return colData;
    }

    /**
     * Import data from 2D array
     */
    importFromArray(array) {
        this.clear();
        for (let row = 0; row < array.length; row++) {
            for (let col = 0; col < array[row].length; col++) {
                if (array[row][col] !== null && array[row][col] !== undefined && array[row][col] !== '') {
                    this.setCellValue(row, col, array[row][col]);
                }
            }
        }
    }

    /**
     * Export data to 2D array
     */
    exportToArray(maxRow = -1, maxCol = -1) {
        // Find bounds if not provided
        if (maxRow === -1 || maxCol === -1) {
            let foundMaxRow = 0;
            let foundMaxCol = 0;
            
            for (let [key] of this.data) {
                const [r, c] = key.split(',').map(Number);
                foundMaxRow = Math.max(foundMaxRow, r);
                foundMaxCol = Math.max(foundMaxCol, c);
            }
            
            maxRow = maxRow === -1 ? foundMaxRow : maxRow;
            maxCol = maxCol === -1 ? foundMaxCol : maxCol;
        }
        
        const array = [];
        for (let row = 0; row <= maxRow; row++) {
            array[row] = [];
            for (let col = 0; col <= maxCol; col++) {
                array[row][col] = this.getCellValue(row, col);
            }
        }
        
        return array;
    }

    /**
     * Set callback for events
     */
    setCallback(eventName, callback) {
        if (!this.callbacks) {
            this.callbacks = {};
        }
        this.callbacks[eventName] = callback;
    }

    /**
     * Trigger callback
     */
    triggerCallback(eventName, data) {
        if (this.callbacks && this.callbacks[eventName]) {
            this.callbacks[eventName](data);
        }
    }

    /**
     * Get data statistics
     */
    getStats() {
        return {
            totalCells: this.data.size,
            nonEmptyCells: this.data.size,
            memoryUsage: JSON.stringify([...this.data]).length
        };
    }
}