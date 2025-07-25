export class Rows {

    /**@type {Map} Store the row widths*/
    #rowsData;

    /**
     * Initialize the Row class to handle row operations.
     */
    constructor(defaultRowHeight = 25){
        this.#rowsData = new Map();
        this.defaultRowHeight = defaultRowHeight;
    }

    /**
     * Get the height of a specific row
     * @param {number} rowIndex 
     * @returns {number} The height of the row
     */
    getRowHeight(rowIndex) {
        return this.#rowsData.get(rowIndex) || this.defaultRowHeight;
    }

    /**
     * Get the cumulative height of rows until a specific index
     * @param {number} rowIndex The row index 
     * @returns {number} The cumulative height of rows until the specified index
     */
    getCumulativeHeightUntil(rowIndex) {
        let height = 0;
        for (let i = 0; i < rowIndex; i++) {
            height += this.getRowHeight(i);
        }
        return height;
    }

    /**
     * Get the cumulative height of rows between two indices
     * @param {number} startRow the starting row index
     * @param {number} endRow the ending row index
     * @returns {number} The cumulative height of rows between the specified indices
     */
    getCumulativeHeightBetween(startRow, endRow) {
        let height = 0;
        for (let i = startRow; i < endRow; i++) {
            height += this.getRowHeight(i);
        }
        return height;
    }


    /**
     * Set the height of a specific row
     * @param {number} rowIndex 
     * @param {number} height 
     */
    setRowHeight(rowIndex, height) {
        this.#rowsData.set(rowIndex, height);
    }

    /**
     * Get the row at absolute position (from top of the grid)
     * @param {number} absoluteY - The absolute Y position from the top of the grid
     * @returns {object} - {row: number, offsetY: number} where offsetY is the position within the row
     */
    getRowAtAbsolutePosition(absoluteY) {
        let cumulativeHeight = 0;
        let row = 0;
        
        while (cumulativeHeight + this.getRowHeight(row) <= absoluteY) {
            cumulativeHeight += this.getRowHeight(row);
            row++;
        }
        
        return {
            row: row,
            offsetY: absoluteY - cumulativeHeight
        };
    }

    /**
     * Get the absolute Y position of a specific row
     * @param {number} rowIndex - The row index
     * @returns {number} - The absolute Y position where the row starts
     */
    getAbsoluteRowPosition(rowIndex) {
        let cumulativeHeight = 0;
        
        for (let i = 0; i < rowIndex; i++) {
            cumulativeHeight += this.getRowHeight(i);
        }
        
        return cumulativeHeight;
    }
}