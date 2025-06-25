/**
 * Represents a single cell in the grid
 */
export class Cell {
    /**
     * @param {number} row Row index
     * @param {number} col Column index
     * @param {any} value The value stored in the cell
     */
    constructor(row, col, value = '') {
        /** @type {number} Row index */
        this.row = row;

        /** @type {number} Column index */
        this.col = col;

        /** @type {any} Value of the cell */
        this.value = value;
    }
}
