/**
 * Represents a single column in the grid
 */
export class Column {
    /**
     * @param {number} index The index of the column (0-based)
     * @param {number} width Width of the column
     */
    constructor(index, width = 100) {
        /** @type {number} Index of the column */
        this.index = index;

        /** @type {number} Width of the column */
        this.width = width;
    }
}
