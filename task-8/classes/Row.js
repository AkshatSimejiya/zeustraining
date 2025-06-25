/**
 * Represents a single row in the grid
 */
export class Row {
    /**
     * @param {number} index The index of the row (0-based)
     * @param {number} height Height of the row
     */
    constructor(index, height = 24) {
        /** @type {number} Index of the row */
        this.index = index;

        /** @type {number} Height of the row */
        this.height = height;
    }
}
