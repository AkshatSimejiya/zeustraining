export class Rows {

    /**
     * Initialize the Row class to handle row operations.
     */
    constructor(defaultRowHeight = 25){
        this.rowsData = new Map();
        this.defaultRowHeight = defaultRowHeight;
    }

    /**
     * Get the height of a specific row
     * @param {number} rowIndex 
     * @returns {number} The height of the row
     */
    getRowHeight(rowIndex) {
        return this.rowsData.get(rowIndex) || this.defaultRowHeight;
    }

    /**
     * Set the height of a specific row
     * @param {number} rowIndex 
     * @param {number} height 
     */
    setRowHeight(rowIndex, height) {
        this.rowsData.set(rowIndex, height);
    }

    /**
     * Get the position of the particular row
     * @param {*} startRow 
     * @param {*} scrollY 
     * @param {*} targetIndex  
     */
    getRowPosition(startRow, scrollY=0, targetIndex=0) {
        console.log(startRow, scrollY, targetIndex);
        let pos = 0;
        for (let i = startRow; i < targetIndex; i++) {
            pos += this.getRowHeight(i);
        }
        return pos - scrollY;
    }

    /**
     * Get the row at specific position (relative to viewport)
     * @param {number} rowStart - The first visible row
     * @param {number} scrollY - The scroll offset within the first visible row
     * @param {number} y - The y position relative to the viewport
     * @returns {number} the index of the row
     */
    getRowAtPosition(rowStart, scrollY, y) {
        let currentY = -scrollY;
        let rowIndex = rowStart;

        while (currentY < y) {
            currentY += this.getRowHeight(rowIndex);
            if (currentY > y) break;
            rowIndex++;
        }
        
        return rowIndex;
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