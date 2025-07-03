export class Rows{
    constructor(defaultHeight = 24) {
        this.defaultHeight = defaultHeight;
        this.rowHeights = new Map();
    }

    /**
     * Get the height of a specific row
     * @param {number} rowIndex 
     * @returns {number} The height of the row
     */
    getRowHeight(index) {
        return this.rowHeights.get(index) || this.defaultHeight;
    }

    /**
     * Set the height of a row
     * @param {number} rowIndex The index of the row 
     * @param {number} height The returned height of the row
     */
    setRowHeight(index, height) {
        this.rowHeights.set(index, Math.max(20, height));
    }

    getRowPosition(startRow, scrollY=0, targetIndex=0) {
        console.log(startRow, scrollY, targetIndex);
        let pos = 0;
        for (let i = startRow; i < targetIndex; i++) {
            pos += this.getRowHeight(i);
        }
        return pos - scrollY;
    }

    /**
     * Get the row at specific position
     * @param {number} y the y position 
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
}
