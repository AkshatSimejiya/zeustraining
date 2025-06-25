/**
 * Handles sparse data storage
 */
export class DataModel {
    constructor() {
        /** @type {Map<string, any>} Key format is "row,col" */
        this.cellData = new Map();
    }

    getCell(row, col) {
        return this.cellData.get(`${row},${col}`) || '';
    }

    setCell(row, col, value) {
        this.cellData.set(`${row},${col}`, value);
    }
}
