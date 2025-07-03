export class Columns {

    /**
     * initialize the Columns object
     * @param {number} defaultColumnWidth default column width 
     */
    constructor(defaultColumnWidth = 100){
        this.defaultColumnWidth = defaultColumnWidth;
        this.colsData = new Map();
    }

    /**
     * Get Column width
     * @param {number} colIndex Index of the column width needed 
     * @returns {number} Width of the column
     */
    getColumnWidth(colIndex){
        return this.colsData.get(colIndex) || this.defaultColumnWidth;
    }

    /**
     * Set column width on events such as resize 
     * @param {number} colIndex The index of column which needs to be changed
     * @param {number} width The new width of the column
     */
    setColumnWidth(colIndex, width){
        this.colsData.set(colIndex, width);
    }
 
    /**
     * To get the position of the column
     * @param {number} colIndex The index of the column
     * @returns {number} The position of the column which is calculated keeping the offset in mind
     */
    getColPosition(colStart, colIndex) {
        let pos = 0;
        for (let i = colStart; i < colIndex; i++) {
            pos += this.getColWidth(i);
        }
        return pos - this.scrollX;
    }

    /**
     * Get the column at specific position
     * @param {number} x the x position 
     * @returns {number} the index of the column
     */
    getColAtPosition(scrollX, colStart, x) {
        let currentX = -scrollX;
        let colIndex = colStart;
        
        while (currentX < x) {
            currentX += this.getColWidth(colIndex);
            if (currentX > x) break;
            colIndex++;
        }
        
        return colIndex;
    }
    getColumnAtAbsolutePosition(absoluteX) {
        let cumulativeWidth = 0;
        let col = 0;
        
        while (cumulativeWidth + this.getColumnWidth(col) <= absoluteX) {
            cumulativeWidth += this.getColumnWidth(col);
            col++;
        }
        
        return {
            col: col,
            offsetX: absoluteX - cumulativeWidth
        };
    }

    getAbsoluteColumnPosition(colIndex) {
        let cumulativeWidth = 0;
        
        for (let i = 0; i < colIndex; i++) {
            cumulativeWidth += this.getColumnWidth(i);
        }
        
        return cumulativeWidth;
    }
}