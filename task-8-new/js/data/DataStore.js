export class DataStore {

    /**
     * 
     */
    #data;

    /**
     * Initialize the DataStore object to handle cell data
     */
    constructor() {
        this.#data = new Map();
        this.callbacks = {};
    }

    /**
     * Get cell value
     */
    getCellValue(row, col) {
        const key = `${row},${col}`;
        return this.#data.get(key) || '';
    }

    /**
     * Set cell value
     */
    setCellValue(row, col, value) {
        const key = `${row},${col}`;
        const oldValue = this.#data.get(key) || '';
        
        if (value === '' || value === null || value === undefined) {
            this.#data.delete(key);
        } else {
            this.#data.set(key, value);
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
        for (let [key, value] of this.#data) {
            const [row, col] = key.split(',').map(Number);
            cells.push({ row, col, value });
        }
        return cells;
    }

    /**
     * Clear all data
     */
    clear() {
        this.#data.clear();
        this.triggerCallback('onDataCleared');
    }

    /**
     * Get row data
     */
    getRowData(row) {
        const rowData = {};
        for (let [key, value] of this.#data) {
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
        for (let [key, value] of this.#data) {
            const [r, c] = key.split(',').map(Number);
            if (c === col) {
                colData[r] = value;
            }
        }
        return colData;
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
}