export class Columns {

    constructor(defaultWidth = 100) {
        this.defaultWidth = defaultWidth;
        this.colWidths = new Map();
    }

    /**
     * Get the width of a specific column
     * @param {number} colIndex 
     * @returns {number} The width of the column
     */
    getColWidth(colIndex) {
        return this.colWidths.get(colIndex) || this.default_col_width;
    }


    /**
     * Set width of the column
     * @param {number} colIndex The index of the column 
     * @param {*} width The width of the column
     */
    setColWidth(colIndex, width) {
        this.colWidths.set(colIndex, Math.max(50, width));
    }

    /**
     * To get the position of the column
     * @param {number} colIndex The index of the column
     * @returns {number} The position of the column which is calculated keeping the offset in mind
     */
    getColPosition(colIndex) {
        let pos = 0;
        for (let i = this.colStart; i < colIndex; i++) {
            pos += this.getColWidth(i);
        }
        return pos - this.scrollX;
    }

    /**
     * Get the column at specific position
     * @param {number} x the x position 
     * @returns {number} the index of the column
     */
    getColAtPosition(colStart,scrollX, x) {
        let currentX = -scrollX;
        let colIndex = colStart;
        
        while (currentX < x) {
            currentX += this.getColWidth(colIndex);
            if (currentX > x) break;
            colIndex++;
        }
        
        return colIndex;
    }
}
