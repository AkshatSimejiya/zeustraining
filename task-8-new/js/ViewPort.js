import { Canvas } from "./rendering/Canvas.js"
import {ColumnHeader} from "./rendering/ColumnHeader.js";
import {RowHeader} from "./rendering/RowHeader.js";
import { CornerCanvas } from "./rendering/CornerCanvas.js";
import { Selection } from "./rendering/Selection.js";

export class ViewPort {

    /**
     * Initialize the viewport for the grid
     * @param {*} gridContainer the grid container
     * @param {*} colInstance column instance
     * @param {*} rowsInstance  rows instance
     */
    constructor(gridContainer, colInstance, rowsInstance){

        /**@type {HTMLElement} The Grid Container*/
        this.gridContainer = gridContainer;

        /**@type {Object} The instance of row*/
        this.rows = rowsInstance;

        /**@type {Object} The instance of cols*/
        this.cols = colInstance;
        
        /**@type {Selection} The selection instance*/
        this.selection = new Selection();

        /**@type {Canvas} The main canvas instance*/
        this.canvas = new Canvas(this.gridContainer, 25, 25,  this.cols, this.rows);
        
        /**@type {RowHeader} The row header canvas instance*/
        this.rowCanvas = new RowHeader(this.gridContainer, 25, 25, this.rows);

        /**@type {ColumnHeader} The column header canavs*/
        this.colCanvas = new ColumnHeader(this.gridContainer,  25, 25, this.cols);

        /**@type {CornerCanvas} The corner canvas rendering class*/
        this.cornerCanvas = new CornerCanvas(this.gridContainer,  25, 25);

        /**@type {number} Absolute Scroll Y position*/
        this.absoluteScrollY = 0;
        
        /**@type {number} Absolute Scroll X position*/
        this.absoluteScrollX = 0;
        
        this.cellAddressInput = document.querySelector("#active-cell")

        /**@type {object} The scroll object to handle the scroll Y and scroll X position*/
        this.scroll = {
            scrollY: 0,
            scrollX: 0
        }

        /**@type {number} Row start for the scroll*/
        this.rowStart = 0;

        /**@type {number} Column Start for the scroll*/
        this.colStart = 0;

        /**@type {number} The default column width*/
        this.default_col_width = 100;

        /**@type {boolean} The boolean of the input box to check wether the box is added or not*/
        this.inputBox = null;

        /**@type {boolean} Check if its editing right now or not*/
        this.isEditing = false;

        /**@type {object} Row and col of the current editing cell*/
        this.editingCell = { row: -1, col: -1 };
        
        /**@type {number} Timer to set the auto scroll*/
        this.autoScrollTimer = null;

        /**@type {number} The speed for auto scroll*/
        this.autoScrollSpeed = 30;

        /**@type {number} The threshold where the auto scroll should start*/
        this.autoScrollThreshold = 20;

        this.selection.setCallback('onSelectionChange', (selections) => {
            this.onSelectionChange(selections);
        });
        
    }

    /**
     * Update the canvas on changes
     */
    updateRenderer(){
        const selectionData = this.getSelectionForRendering();

        this.canvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
        this.rowCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
        this.colCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
        this.cornerCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
        
    }

    /**
     * Update Headers only while the user is resizing the rows or columns
     */
    updateHeadersOnly(){
        const selectionData = this.getSelectionForRendering();

        this.rowCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
        this.colCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
        this.cornerCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
        
    }

    updateColumnHeader(){
        const selectionData = this.getSelectionForRendering();
        this.colCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
    }

    updateRowHeader(){
        const selectionData = this.getSelectionForRendering();
        this.rowCanvas.renderer(this.scroll.scrollX, this.scroll.scrollY, this.rowStart, this.colStart, selectionData);
    }

    /**
     * Calculate which column starts at a given absolute X position
     * @param {*} absoluteX the absolute X position
     * @returns {Object} an object containing colStart and scrollX
     */
    calculateColPosition(absoluteX) {
        if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
            const result = this.cols.getColumnAtAbsolutePosition(absoluteX);
            return {
                colStart: result.col,
                scrollX: result.offsetX
            };
        }
        
        return {
            colStart: Math.floor(absoluteX / this.default_col_width),
            scrollX: absoluteX % this.default_col_width
        };
    }

    /**
     * Create an input box for editing cell values
     * @param {*} row the row index of active cell
     * @param {*} col the column index of active cell
     * @param {*} initialValue the initial value for the input box
     * @returns 
     */
    createInputBox(row, col, initialValue = '') {
        this.removeInputBox();
        
        const cellPosition = this.getCellScreenPosition(row, col);
        if (!cellPosition) {
            console.warn('Could not get cell position for:', row, col);
            return;
        }
        
        if (initialValue === '') {
            initialValue = this.getCellValue(row, col);
        }
        
        this.inputBox = document.createElement('input');
        this.inputBox.type = 'text';
        this.inputBox.value = initialValue;
        this.inputBox.className = 'grid-cell-input';
        
        this.inputBox.style.position = 'absolute';
        this.inputBox.style.left = `${cellPosition.x}px`;
        this.inputBox.style.top = `${cellPosition.y}px`;
        this.inputBox.style.width = `${cellPosition.width}px`;
        this.inputBox.style.height = `${cellPosition.height}px`;
        this.inputBox.style.border = '1px solid #147E43';
        this.inputBox.style.outline = 'none';
        this.inputBox.style.fontSize = '12px';
        this.inputBox.style.padding = '2px 4px';
        this.inputBox.style.zIndex = '1000';
        this.inputBox.style.backgroundColor = 'white';
        this.inputBox.style.boxSizing = 'border-box';
        
        this.inputBox.addEventListener('keydown', (e) => this.handleInputKeyDown(e));
        this.inputBox.addEventListener('blur', () => this.handleInputBlur());
        
        this.gridContainer.appendChild(this.inputBox);
        
        this.inputBox.focus();
        
        if (initialValue.length === 1) {
            this.inputBox.setSelectionRange(1, 1);
        } else {
            this.inputBox.select();
        }
        
        this.isEditing = true;
        this.editingCell = { row, col };
        
        this.updateRenderer();
    }


    /**
     * Remove input box
     */
    removeInputBox() {
        if (this.inputBox) {
            this.inputBox.remove();
            this.inputBox = null;
            this.isEditing = false;
            this.editingCell = { row: -1, col: -1 };
            
            this.updateRenderer();
        }
    }

    /**
     * Get the screen position of a cell
     * @param {number} row  The row index of the cell
     * @param {number} col The column index of the cell
     * @returns The screen position of the cell
     */
    getCellScreenPosition(row, col) {
        const rect = this.gridContainer.getBoundingClientRect();
        const rowHeaderWidth = 30;
        const colHeaderHeight = 25;
        
        let cellAbsoluteX = 0;
        if (this.cols) {
            for (let i = 0; i < col; i++) {
                cellAbsoluteX += this.cols.getColumnWidth(i);
            }
        } else {
            cellAbsoluteX = col * this.default_col_width;
        }
        
        let cellAbsoluteY = 0;
        for (let i = 0; i < row; i++) {
            cellAbsoluteY += this.rows.getRowHeight(i);
        }
        
        const screenX = cellAbsoluteX - this.absoluteScrollX + rowHeaderWidth;
        const screenY = cellAbsoluteY - this.absoluteScrollY + colHeaderHeight;
        
        const cellWidth = this.cols ? this.cols.getColumnWidth(col) : this.default_col_width;
        const cellHeight = this.rows.getRowHeight(row);
        
        const containerWidth = this.gridContainer.clientWidth;
        const containerHeight = this.gridContainer.clientHeight;
        
        if (screenX < rowHeaderWidth || screenX >= containerWidth || 
            screenY < colHeaderHeight || screenY >= containerHeight) {
            return null;
        }
        
        return {
            x: screenX,
            y: screenY,
            width: Math.min(cellWidth, containerWidth - screenX),
            height: Math.min(cellHeight, containerHeight - screenY)
        };
    }

    /**
     * Function to move to next cell on events like tab or right arrow
     * @param {boolean} reverse if shift is presses, then it should be in reverse direction 
     */
    moveToNextCellHorizontal(reverse = false) {
        const { row, col } = this.editingCell;
        let newRow = row;
        let newCol = col;

        if(!this.selection.isRangeSelection()) {
            if (reverse) {
                if (col > 0) {
                    newCol = col;
                } else {
                    if (row > 0) {
                        newRow = row - 1;
                    newCol = Math.max(0, col);
                }
            }
            }
            this.selection.selectCell(newRow, newCol);
        }
        
        this.scrollToCell(newRow, newCol);
    }

    /**
     * Handle input key down events 
     * @param {event} e event object about the keydown on input
     */
    handleInputKeyDown(e) {
        if(this.selection.isRangeSelection()){
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    const { row, col } = this.editingCell;
                    this.commitCellEdit();
                    const newRow = row;
                    this.scrollToCell(newRow, col);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.cancelCellEdit();
                    break;
                case 'Tab':
                    e.preventDefault();
                    this.moveToNextCellHorizontal(e.shiftKey);
                    this.commitCellEdit();
                    break;
            }
        }else {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    const { row, col } = this.editingCell;
                    this.commitCellEdit();
                    const newRow = row;
                    this.selection.selectCell(newRow, col);
                    this.scrollToCell(newRow, col);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.cancelCellEdit();
                    break;
                case 'Tab':
                    e.preventDefault();
                    this.moveToNextCellHorizontal(e.shiftKey);
                    this.commitCellEdit();
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    if (this.shouldHandleArrowKey(e)) {
                        e.preventDefault();
                        this.handleArrowNavigation(e.key);
                    }
                    break;
            }
        }
    }

    /**
     * Check if arrow key should be handled for navigation or not
     * @param {*} e 
     * @returns 
     */
    shouldHandleArrowKey(e) {
        const input = this.inputBox;
        const cursorPos = input.selectionStart;
        const textLength = input.value.length;
        
        switch (e.key) {
            case 'ArrowLeft':
                return cursorPos === 0;
            case 'ArrowRight':
                return cursorPos === textLength;
            case 'ArrowUp':
            case 'ArrowDown':
                return true;
            default:
                return false;
        }
    }

    /**
     * Handle arrow key navigation
     * @param {string} key The arrow key that was pressed
     */
    handleArrowNavigation(key) {
        const { row, col } = this.editingCell;
        let newRow = row;
        let newCol = col;
        
        
        
        this.commitCellEdit();

        switch (key) {
            case 'ArrowUp':
                newRow = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                newRow = row + 1;
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                newCol = col + 1;
                break;
        }
        
        if (newRow !== row || newCol !== col) {
            this.selection.selectCell(newRow, newCol);
            this.scrollToCell(newRow, newCol);
            this.createInputBox(newRow, newCol);
        }
    }

    /**
     * Move to next cell after editing
     * @param {boolean} reverse check if the shift key is pressed
     */
    moveToNextCell(reverse = false) {
        const { row, col } = this.editingCell;
        let newRow = row;
        let newCol = col;
        
        if (reverse) {
            newRow = Math.max(0, row - 1);
        } else {
            newRow = row + 1;
        }
        
        this.selection.selectCell(newRow, newCol);
        this.scrollToCell(newRow, newCol);
    }

    /**
     * Commit the cell edit and trigger the callback
     */
    commitCellEdit() {
        
        if (this.inputBox && this.isEditing) {
            const value = this.inputBox.value;
            const { row, col } = this.editingCell;
            
            
            this.triggerCallback('onCellValueChange', { row, col, value });
            
            this.removeInputBox();
        }
    }

    /**
     * Cancel cell edit
     */
    cancelCellEdit() {
        this.removeInputBox();
    }

    /**
     * Handle input box blur
     */
    handleInputBlur() {
        setTimeout(() => {
            if (this.isEditing) {
                this.commitCellEdit();
            }
        }, 100);
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

    /**
     * handle key down for navigation
     * @param {*} e 
     */
    handleKeyDown(e) {
        if (this.isEditing) {
            return;
        }
        
        const active = this.selection.getActiveSelection();
        if (!active) return;
        
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const activeRow = active.activeRow || active.startRow;
            const activeCol = active.activeCol || active.startCol;
            
            this.createInputBox(activeRow, activeCol, e.key);
            e.preventDefault();
            return;
        }
        
        if (e.key === 'F2') {
            const activeRow = active.activeRow || active.startRow;
            const activeCol = active.activeCol || active.startCol;
            const currentValue = this.getCellValue(activeRow, activeCol);
            this.createInputBox(activeRow, activeCol, currentValue);
            e.preventDefault();
            return;
        }
        
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const activeRow = active.activeRow || active.startRow;
            const activeCol = active.activeCol || active.startCol;
            this.triggerCallback('onCellValueChange', { row: activeRow, col: activeCol, value: '' });
            this.updateRenderer();
            e.preventDefault();
            return;
        }
        
        const currentActiveRow = active.activeRow || active.startRow;
        const currentActiveCol = active.activeCol || active.startCol;
        let newRow = currentActiveRow;
        let newCol = currentActiveCol;
        
        if(this.selection.isRangeSelection()) {
            const minRow = active.startRow;
            const maxRow = active.endRow;
            const minCol = active.startCol;
            const maxCol = active.endCol;
            
            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                let newRow = currentActiveRow;
                let newCol = currentActiveCol;
                
                switch (e.key) {
                    case 'ArrowUp':
                        newRow = Math.max(0, currentActiveRow - 1);
                        break;
                    case 'ArrowDown':
                        newRow = currentActiveRow + 1;
                        break;
                    case 'ArrowLeft':
                        newCol = Math.max(0, currentActiveCol - 1);
                        break;
                    case 'ArrowRight':
                        newCol = currentActiveCol + 1;
                        break;
                }
                
                this.selection.clearAllSelections();
                this.selection.selectCell(newRow, newCol);
                
                this.scrollToCell(newRow, newCol);
                return;
            }

            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    if (e.shiftKey) {
                        if (currentActiveRow > minRow) {
                            newRow = currentActiveRow - 1;
                        } else {
                            if (currentActiveCol > minCol) {
                                newCol = currentActiveCol - 1;
                                newRow = maxRow;
                            } else {
                                newCol = maxCol;
                                newRow = maxRow;
                            }
                        }
                    } else {
                        if (currentActiveRow < maxRow) {
                            newRow = currentActiveRow + 1;
                        } else {
                            if (currentActiveCol < maxCol) {
                                newCol = currentActiveCol + 1;
                                newRow = minRow;
                            } else {
                                newCol = minCol;
                                newRow = minRow;
                            }
                        }
                    }
                    break;
                case 'Tab':
                    e.preventDefault();
                    if (e.shiftKey) {
                        if (currentActiveCol > minCol) {
                            newCol = currentActiveCol - 1;
                        } else {
                            if (currentActiveRow > minRow) {
                                newRow = currentActiveRow - 1;
                                newCol = maxCol;
                            } else {
                                newRow = maxRow;
                                newCol = maxCol;
                            }
                        }
                    } else {
                        if (currentActiveCol < maxCol) {
                            newCol = currentActiveCol + 1;
                        } else {
                            if (currentActiveRow < maxRow) {
                                newRow = currentActiveRow + 1;
                                newCol = minCol;
                            } else {
                                newRow = minRow;
                                newCol = minCol;
                            }
                        }
                    }
                    break;
                default:
                    return;
            }
            
            if (newRow !== currentActiveRow || newCol !== currentActiveCol) {
                this.selection.selectRange(
                    minRow, minCol, maxRow, maxCol,
                    false,
                    newRow, newCol
                );
                
                this.scrollToCell(newRow, newCol);
            }
            
        } else {
            switch (e.key) {
                case 'ArrowUp':
                    newRow = Math.max(0, currentActiveRow - 1);
                    break;
                case 'ArrowDown':
                    newRow = currentActiveRow + 1;
                    break;
                case 'Enter':
                    if (e.shiftKey) {
                        newRow = Math.max(0, currentActiveRow - 1);
                    } else {
                        newRow = currentActiveRow + 1;
                    }
                    break;
                case 'ArrowLeft':
                    newCol = Math.max(0, currentActiveCol - 1);
                    break;
                case 'ArrowRight':
                    newCol = currentActiveCol + 1;
                    break;
                case 'Tab':
                    e.preventDefault();
                    if (e.shiftKey) {
                        newCol = Math.max(0, currentActiveCol - 1);
                    } else {
                        newCol = currentActiveCol + 1;
                    }
                    break;
                case 'a':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        return;
                    }
                    break;
                default:
                    return;
            }
            
            if (newRow !== currentActiveRow || newCol !== currentActiveCol) {
                if (e.shiftKey && e.key !== 'Tab') {
                    this.selection.selectRange(
                        currentActiveRow, currentActiveCol,
                        newRow, newCol,
                        false,
                        currentActiveRow,
                        currentActiveCol
                    );
                } else {
                    this.selection.clearAllSelections();
                    this.selection.selectCell(newRow, newCol);
                }
                
                this.scrollToCell(newRow, newCol);
                e.preventDefault();
            }
        }
    }

    /**
     * Get the cell value
     * @param {*} row rowindex of the cell needed
     * @param {*} col colindex of the cell needed
     * @returns 
     */
    getCellValue(row, col) {
        if (this.datastore) {
            return this.datastore.getCellValue(row, col) || '';
        }
        return '';
    }

    getMax(arr) {
        let len = arr.length;
        let max = -Infinity;

        while (len--) {
            max = arr[len] > max ? arr[len] : max;
        }
        return max;
    }

    getMin(arr) {
        let len = arr.length;
        let min = Infinity;

        while (len--) {
            min = arr[len] < min ? arr[len] : min;
        }
        return min;
    }

    /**
     * Calculate the count, min, max, sum and average inside of a range
     * @param {*} selections 
     * @returns 
     */
    calculateStats(selections) {
        const values = [];
        let total_Count = 0;

        for (const sel of selections) {
            if (sel.type === "column") {
                for(let col = sel.startCol; col <= sel.endCol; col++){
                    const colData = this.datastore.getColumnData(col);
                    for (let row in colData) {
                        const val = colData[row];
                        if (val) {
                            total_Count++;
                            const num = parseFloat(val);
                            if (!isNaN(num)) {
                                values.push(num);
                            }
                        }
                    }
                }
                
            } else if (sel.type === "row") {
                for(let row = sel.startRow; row <= sel.endRow; row++){
                    const rowData = this.datastore.getRowData(row);
                    for (let col in rowData) {
                        const val = rowData[col];
                        if (val) {
                            total_Count++;
                            const num = parseFloat(val);
                            if (!isNaN(num)) {
                                values.push(num);
                            }
                        }
                    }
                }
            } else {
                for (let row = sel.startRow; row <= sel.endRow; row++) {
                    for (let col = sel.startCol; col <= sel.endCol; col++) {
                        const val = this.getCellValue(row, col);
                        if (val) {
                            total_Count++;
                            const num = parseFloat(val);
                            if (!isNaN(num)) {
                                values.push(num);
                            }
                        }
                    }
                }
            }
        }

        console.log(`Count: ${total_Count}`);

        if(total_Count > 1)
            document.querySelector(".count").innerHTML = `Count: ${total_Count}`;
        else
            document.querySelector(".count").innerHTML = ``;

        if (values.length <= 1) {
            document.querySelector(".sum").innerHTML = ``;
            document.querySelector(".min").innerHTML = ``;
            document.querySelector(".max").innerHTML = ``;
            document.querySelector(".average").innerHTML = ``;
            return;
        }

        const sum = values.reduce((a, b) => a + b, 0);
        const min = values.reduce((a,b)=> Math.min(a,b), Infinity);
        const max = values.reduce((a,b)=>Math.max(a,b), -Infinity);
        const avg = sum / values.length;

        console.log("Selection Stats:");
        document.querySelector(".sum").innerHTML = `Sum: ${sum}`;
        document.querySelector(".min").innerHTML = `Min: ${min}`;
        document.querySelector(".max").innerHTML = `Max: ${max}`;
        document.querySelector(".average").innerHTML = `Average: ${avg.toFixed(2)}`;
        console.log(`Sum: ${sum}`);
        console.log(`Min: ${min}`);
        console.log(`Max: ${max}`);
        console.log(`Average: ${avg}`);
    }



    /**
     * Set the datastore instance for canvas
     * @param {DataStore} datastore object to set 
     */
    setDatastore(datastore) {
        this.datastore = datastore;

        
        this.canvas.setDatastore(this.datastore)
    }


    /**
     * Function to handle the scroll
     * @param {*} e event object passed on wheel event
     */
    updateScroll(e){
        if(this.inputBox){
            this.removeInputBox();
        }

        const delta = e.deltaY * 1.1;

        if (e.shiftKey) {
            this.absoluteScrollX += delta;
            if (this.absoluteScrollX < 0) {
                this.absoluteScrollX = 0;
            }

            const colPosition = this.calculateColPosition(this.absoluteScrollX);
            this.colStart = colPosition.colStart;
            this.scroll.scrollX = colPosition.scrollX;

        } else {
            this.absoluteScrollY += delta;
            
            if (this.absoluteScrollY < 0) {
                this.absoluteScrollY = 0;
            }

            const rowPosition = this.rowCanvas.calculateRowPosition(this.absoluteScrollY);
            this.rowStart = rowPosition.rowStart;
            this.scroll.scrollY = rowPosition.scrollY;
        }

        this.updateRenderer();
    }

    /**
     * Remove the selection
     */
    removeSelection(){
        this.canvas.removeSelection();
    }

    /**
     * Get the position and details about the cell where the user had clicked
     * @param {*} clientX 
     * @param {*} clientY 
     * @returns {object} Object with details of the cell 
     */
    getGridPositionFromClick(clientX, clientY) {
        if(this.isSelect){
            this.removeSelection();
            this.isSelect = false;
            return
        }

        const rect = this.gridContainer.getBoundingClientRect();
        const containerX = clientX - rect.left;
        const containerY = clientY - rect.top;
        
        const row_header_width = 30; 
        const col_header_height = 25;
        
        const gridX = containerX - row_header_width;
        const gridY = containerY - col_header_height;
        
        if (gridX < 0 || gridY < 0) {
            let headerRow = -1;
            let headerCol = -1;
            
            if (containerX < row_header_width && containerY >= col_header_height) {
                const absoluteGridY = gridY + this.absoluteScrollY;
                if (this.rows && typeof this.rows.getRowAtAbsolutePosition === 'function') {
                    const rowResult = this.rows.getRowAtAbsolutePosition(absoluteGridY);
                    headerRow = rowResult.row;
                } else {
                    let cumulativeHeight = 0;
                    headerRow = 0;
                    while (cumulativeHeight + this.rows.getRowHeight(headerRow) <= absoluteGridY && headerRow < this.rows.getRowCount()) {
                        cumulativeHeight += this.rows.getRowHeight(headerRow);
                        headerRow++;
                    }
                }
            }
            
            if (containerY < col_header_height && containerX >= row_header_width) {
                const absoluteGridX = gridX + this.absoluteScrollX;
                if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
                    const colResult = this.cols.getColumnAtAbsolutePosition(absoluteGridX);
                    headerCol = colResult.col;
                } else {
                    headerCol = Math.floor(absoluteGridX / this.default_col_width);
                }
            }
            
            return {
                row: headerRow,
                col: headerCol,
                x: containerX,
                y: containerY,
                isHeader: true,
                isRowHeader: containerX < row_header_width,
                isColHeader: containerY < col_header_height
            };
        }
        
        const absoluteGridX = gridX + this.absoluteScrollX;
        const absoluteGridY = gridY + this.absoluteScrollY;
        
        let col;
        if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
            const colResult = this.cols.getColumnAtAbsolutePosition(absoluteGridX);
            col = colResult.col;
        } else {
            col = Math.floor(absoluteGridX / this.default_col_width);
        }
        
        let row;
        if (this.rows && typeof this.rows.getRowAtAbsolutePosition === 'function') {
            const rowResult = this.rows.getRowAtAbsolutePosition(absoluteGridY);
            row = rowResult.row;
        } else {
            let cumulativeHeight = 0;
            row = 0;
            while (cumulativeHeight + this.rows.getRowHeight(row) <= absoluteGridY && row < this.rows.getRowCount()) {
                cumulativeHeight += this.rows.getRowHeight(row);
                row++;
            }
        }
        
        return {
            row: row,
            col: col,
            x: containerX,
            y: containerY,
            gridX: gridX,
            gridY: gridY,
            isHeader: false,
            absoluteGridX: absoluteGridX,
            absoluteGridY: absoluteGridY
        };
    }

    /**
     * Auto scroll on selection
     * @param {number} containerX X coordinate for the grid container or the main grid
     * @param {number} containerY Y coordinate of the grid container
     */
    handleAutoScroll(containerX, containerY) {
        const containerWidth = this.gridContainer.clientWidth;
        const containerHeight = this.gridContainer.clientHeight;
        const rowHeaderWidth = 30;
        const colHeaderHeight = 25;
        
        let scrollDirectionX = 0;
        let scrollDirectionY = 0;
        
        if (containerX < rowHeaderWidth + this.autoScrollThreshold) {
            scrollDirectionX = -1;
        } else if (containerX > containerWidth - this.autoScrollThreshold) {
            scrollDirectionX = 1;
        }
        
        if (containerY < colHeaderHeight + this.autoScrollThreshold) {
            scrollDirectionY = -1;
        } else if (containerY > containerHeight - this.autoScrollThreshold) {
            scrollDirectionY = 1;
        }
        
        if (scrollDirectionX !== 0 || scrollDirectionY !== 0) {
            this.startAutoScroll(scrollDirectionX, scrollDirectionY);
        } else {
            this.stopAutoScroll();
        }
    }

    /**
     * Start auto scroll animation 
     * @param {number} directionX The X direction while scrolling
     * @param {number} directionY The Y direction while scrolling
     */
    startAutoScroll(directionX, directionY) {
        this.stopAutoScroll();
        
        const scroll = () => {
            let scrolled = false;
            
            if (directionX !== 0) {
                const newScrollX = this.absoluteScrollX + (directionX * this.autoScrollSpeed);
                if (newScrollX >= 0) {
                    this.absoluteScrollX = newScrollX;
                    
                    const colPosition = this.calculateColPosition(this.absoluteScrollX);
                    this.colStart = colPosition.colStart;
                    this.scroll.scrollX = colPosition.scrollX;
                    scrolled = true;
                }
            }
            
            if (directionY !== 0) {
                const newScrollY = this.absoluteScrollY + (directionY * this.autoScrollSpeed);
                if (newScrollY >= 0) {
                    this.absoluteScrollY = newScrollY;
                    
                    const rowPosition = this.rowCanvas.calculateRowPosition(this.absoluteScrollY);
                    this.rowStart = rowPosition.rowStart;
                    this.scroll.scrollY = rowPosition.scrollY;
                    scrolled = true;
                }
            }
            
            if (scrolled) {
                this.updateRenderer();
                
                if (this.isDragging) {
                    this.autoScrollTimer = requestAnimationFrame(scroll);
                }
            }
        };
        
        this.autoScrollTimer = requestAnimationFrame(scroll);
    }

    /**
     * Get the resize info for resizing operaction
     * @param {*} clientX 
     * @param {*} clientY  
     */
    getResizeInfo(clientX, clientY) {
        const rect = this.gridContainer.getBoundingClientRect();
        const containerX = clientX - rect.left;
        const containerY = clientY - rect.top;
        
        const rowHeaderWidth = 30;
        const colHeaderHeight = 25;
        const resizeThreshold = 3;
        
        if (containerY <= colHeaderHeight && containerX >= rowHeaderWidth) {
            const gridX = containerX - rowHeaderWidth;
            const absoluteGridX = gridX + this.absoluteScrollX;
            
            let currentX = 0;
            let colIndex = 0;
            
            while (currentX < absoluteGridX) {
                const colWidth = this.cols.getColumnWidth(colIndex);
                const nextX = currentX + colWidth;
                
                if (Math.abs(absoluteGridX - nextX) <= resizeThreshold) {
                    return {
                        canResize: true,
                        type: 'col',
                        index: colIndex,
                        borderPosition: nextX
                    };
                }
                
                currentX = nextX;
                colIndex++;
                
                if (colIndex > 1000) break;
            }
        }
        
        if (containerX <= rowHeaderWidth && containerY >= colHeaderHeight) {
            const gridY = containerY - colHeaderHeight;
            const absoluteGridY = gridY + this.absoluteScrollY;
            
            let currentY = 0;
            let rowIndex = 0;
            
            while (currentY < absoluteGridY) {
                const rowHeight = this.rows.getRowHeight(rowIndex);
                const nextY = currentY + rowHeight;
                
                if (Math.abs(absoluteGridY - nextY) <= resizeThreshold) {
                    return {
                        canResize: true,
                        type: 'row',
                        index: rowIndex,
                        borderPosition: nextY
                    };
                }
                
                currentY = nextY;
                rowIndex++;
                
                if (rowIndex > 1000) break;
            }
        }
        
        return {
            canResize: false,
            type: null,
            index: -1
        };
    }

    /**
     * Check if the resize opertaion can be performed or now
     * @param {number} clientX The x co-ordinate on container 
     * @param {number} clientY The y co-ordinate on container
     * @returns {boolean} Boolean to indicate if resizing is possible or not
     */
    isNearResizeBorder(clientX, clientY) {
        const resizeInfo = this.getResizeInfo(clientX, clientY);
        return resizeInfo.canResize;
    }

    /**
     * Stop auto scrolling
     */
    stopAutoScroll() {
        if (this.autoScrollTimer) {
            cancelAnimationFrame(this.autoScrollTimer);
            this.autoScrollTimer = null;
        }
    }

        /**
     * Get last visible row index in viewport
     */
    getLastVisibleRow() {
        let visibleHeight = this.gridContainer.clientHeight - 25; // minus col header
        let y = 0;
        let rowIdx = this.rowStart;
        while (y < visibleHeight && rowIdx < this.rows.getRowCount()) {
            y += this.rows.getRowHeight(rowIdx);
            if (y > visibleHeight) break;
            rowIdx++;
        }
        return Math.max(this.rowStart, rowIdx - 1);
    }

    /**
     * Get last visible column index in viewport
     */
    getLastVisibleCol() {
        let visibleWidth = this.gridContainer.clientWidth - 30; // minus row header
        let x = 0;
        let colIdx = this.colStart;
        while (x < visibleWidth && colIdx < this.cols.getColumnCount()) {
            x += this.cols.getColumnWidth(colIdx);
            if (x > visibleWidth) break;
            colIdx++;
        }
        return Math.max(this.colStart, colIdx - 1);
    }

    /**
     * Get the cell value
     * @param {*} row rowindex of the cell needed
     * @param {*} col colindex of the cell needed
     * @returns 
     */
    getCellValue(row, col) {
        if (this.datastore) {
            return this.datastore.getCellValue(row, col) || '';
        }
        return '';
    }

    /**
     * Set the datastore instance for canvas
     * @param {DataStore} datastore object to set 
     */
    setDatastore(datastore) {
        this.datastore = datastore;

        
        this.canvas.setDatastore(this.datastore)
    }

    /**
     * Remove the selection
     */
    removeSelection(){
        this.canvas.removeSelection();
    }

    /**
     * Get the position and details about the cell where the user had clicked
     * @param {*} clientX 
     * @param {*} clientY 
     * @returns {object} Object with details of the cell 
     */
    getGridPositionFromClick(clientX, clientY) {
        if(this.isSelect){
            this.removeSelection();
            this.isSelect = false;
            return
        }

        const rect = this.gridContainer.getBoundingClientRect();
        const containerX = clientX - rect.left;
        const containerY = clientY - rect.top;
        
        const row_header_width = 30; 
        const col_header_height = 25;
        
        const gridX = containerX - row_header_width;
        const gridY = containerY - col_header_height;
        
        if (gridX < 0 || gridY < 0) {
            let headerRow = -1;
            let headerCol = -1;
            
            if (containerX < row_header_width && containerY >= col_header_height) {
                const absoluteGridY = gridY + this.absoluteScrollY;
                if (this.rows && typeof this.rows.getRowAtAbsolutePosition === 'function') {
                    const rowResult = this.rows.getRowAtAbsolutePosition(absoluteGridY);
                    headerRow = rowResult.row;
                } else {
                    let cumulativeHeight = 0;
                    headerRow = 0;
                    while (cumulativeHeight + this.rows.getRowHeight(headerRow) <= absoluteGridY && headerRow < this.rows.getRowCount()) {
                        cumulativeHeight += this.rows.getRowHeight(headerRow);
                        headerRow++;
                    }
                }
            }
            
            if (containerY < col_header_height && containerX >= row_header_width) {
                const absoluteGridX = gridX + this.absoluteScrollX;
                if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
                    const colResult = this.cols.getColumnAtAbsolutePosition(absoluteGridX);
                    headerCol = colResult.col;
                } else {
                    headerCol = Math.floor(absoluteGridX / this.default_col_width);
                }
            }
            
            return {
                row: headerRow,
                col: headerCol,
                x: containerX,
                y: containerY,
                isHeader: true,
                isRowHeader: containerX < row_header_width,
                isColHeader: containerY < col_header_height
            };
        }
        
        const absoluteGridX = gridX + this.absoluteScrollX;
        const absoluteGridY = gridY + this.absoluteScrollY;
        
        let col;
        if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
            const colResult = this.cols.getColumnAtAbsolutePosition(absoluteGridX);
            col = colResult.col;
        } else {
            col = Math.floor(absoluteGridX / this.default_col_width);
        }
        
        let row;
        if (this.rows && typeof this.rows.getRowAtAbsolutePosition === 'function') {
            const rowResult = this.rows.getRowAtAbsolutePosition(absoluteGridY);
            row = rowResult.row;
        } else {
            let cumulativeHeight = 0;
            row = 0;
            while (cumulativeHeight + this.rows.getRowHeight(row) <= absoluteGridY && row < this.rows.getRowCount()) {
                cumulativeHeight += this.rows.getRowHeight(row);
                row++;
            }
        }
        
        return {
            row: row,
            col: col,
            x: containerX,
            y: containerY,
            gridX: gridX,
            gridY: gridY,
            isHeader: false,
            absoluteGridX: absoluteGridX,
            absoluteGridY: absoluteGridY
        };
    }

    /**
     * Auto scroll on selection
     * @param {number} containerX X coordinate for the grid container or the main grid
     * @param {number} containerY Y coordinate of the grid container
     */
    handleAutoScroll(containerX, containerY) {
        const containerWidth = this.gridContainer.clientWidth;
        const containerHeight = this.gridContainer.clientHeight;
        const rowHeaderWidth = 30;
        const colHeaderHeight = 25;
        
        let scrollDirectionX = 0;
        let scrollDirectionY = 0;
        
        if (containerX < rowHeaderWidth + this.autoScrollThreshold) {
            scrollDirectionX = -1;
        } else if (containerX > containerWidth - this.autoScrollThreshold) {
            scrollDirectionX = 1;
        }
        
        if (containerY < colHeaderHeight + this.autoScrollThreshold) {
            scrollDirectionY = -1;
        } else if (containerY > containerHeight - this.autoScrollThreshold) {
            scrollDirectionY = 1;
        }
        
        if (scrollDirectionX !== 0 || scrollDirectionY !== 0) {
            this.startAutoScroll(scrollDirectionX, scrollDirectionY);
        } else {
            this.stopAutoScroll();
        }
    }

    /**
     * Start auto scroll animation 
     * @param {number} directionX The X direction while scrolling
     * @param {number} directionY The Y direction while scrolling
     */
    startAutoScroll(directionX, directionY) {
        this.stopAutoScroll();
        
        const scroll = () => {
            let scrolled = false;
            
            if (directionX !== 0) {
                const newScrollX = this.absoluteScrollX + (directionX * this.autoScrollSpeed);
                if (newScrollX >= 0) {
                    this.absoluteScrollX = newScrollX;
                    
                    const colPosition = this.calculateColPosition(this.absoluteScrollX);
                    this.colStart = colPosition.colStart;
                    this.scroll.scrollX = colPosition.scrollX;
                    scrolled = true;
                }
            }
            
            if (directionY !== 0) {
                const newScrollY = this.absoluteScrollY + (directionY * this.autoScrollSpeed);
                if (newScrollY >= 0) {
                    this.absoluteScrollY = newScrollY;
                    
                    const rowPosition = this.rowCanvas.calculateRowPosition(this.absoluteScrollY);
                    this.rowStart = rowPosition.rowStart;
                    this.scroll.scrollY = rowPosition.scrollY;
                    scrolled = true;
                }
            }
            
            if (scrolled) {
                this.updateRenderer();
                
                if (this.isDragging) {
                    this.autoScrollTimer = requestAnimationFrame(scroll);
                }
            }
        };
        
        this.autoScrollTimer = requestAnimationFrame(scroll);
    }

    /**
     * Get the resize info for resizing operaction
     * @param {*} clientX 
     * @param {*} clientY  
     */
    getResizeInfo(clientX, clientY) {
        const rect = this.gridContainer.getBoundingClientRect();
        const containerX = clientX - rect.left;
        const containerY = clientY - rect.top;
        
        const rowHeaderWidth = 30;
        const colHeaderHeight = 25;
        const resizeThreshold = 3;
        
        if (containerY <= colHeaderHeight && containerX >= rowHeaderWidth) {
            const gridX = containerX - rowHeaderWidth;
            const absoluteGridX = gridX + this.absoluteScrollX;
            
            let currentX = 0;
            let colIndex = 0;
            
            while (currentX < absoluteGridX) {
                const colWidth = this.cols.getColumnWidth(colIndex);
                const nextX = currentX + colWidth;
                
                if (Math.abs(absoluteGridX - nextX) <= resizeThreshold) {
                    return {
                        canResize: true,
                        type: 'col',
                        index: colIndex,
                        borderPosition: nextX
                    };
                }
                
                currentX = nextX;
                colIndex++;
                
                if (colIndex > 1000) break;
            }
        }
        
        if (containerX <= rowHeaderWidth && containerY >= colHeaderHeight) {
            const gridY = containerY - colHeaderHeight;
            const absoluteGridY = gridY + this.absoluteScrollY;
            
            let currentY = 0;
            let rowIndex = 0;
            
            while (currentY < absoluteGridY) {
                const rowHeight = this.rows.getRowHeight(rowIndex);
                const nextY = currentY + rowHeight;
                
                if (Math.abs(absoluteGridY - nextY) <= resizeThreshold) {
                    return {
                        canResize: true,
                        type: 'row',
                        index: rowIndex,
                        borderPosition: nextY
                    };
                }
                
                currentY = nextY;
                rowIndex++;
                
                if (rowIndex > 1000) break;
            }
        }
        
        return {
            canResize: false,
            type: null,
            index: -1
        };
    }

    /**
     * Check if the resize opertaion can be performed or now
     * @param {number} clientX The x co-ordinate on container 
     * @param {number} clientY The y co-ordinate on container
     * @returns {boolean} Boolean to indicate if resizing is possible or not
     */
    isNearResizeBorder(clientX, clientY) {
        const resizeInfo = this.getResizeInfo(clientX, clientY);
        return resizeInfo.canResize;
    }

    /**
     * Stop auto scrolling
     */
    stopAutoScroll() {
        if (this.autoScrollTimer) {
            cancelAnimationFrame(this.autoScrollTimer);
            this.autoScrollTimer = null;
        }
    }


    /**
     * Scroll to a particular cell
     * @param {number} row Row index of that cell
     * @param {number} col Col index of that cell
     */
    scrollToCell(row, col) {
        let targetAbsoluteY = 0;
        for (let i = 0; i < row; i++) {
            targetAbsoluteY += this.rows.getRowHeight(i);
        }
        
        let targetAbsoluteX = 0;
        if (this.cols && typeof this.cols.getColumnAtAbsolutePosition === 'function') {
            for (let i = 0; i < col; i++) {
                targetAbsoluteX += this.cols.getColumnWidth(i);
            }
        } else {
            targetAbsoluteX = col * this.default_col_width;
        }
        
        const viewportHeight = this.gridContainer.clientHeight - 25;
        const viewportWidth = this.gridContainer.clientWidth - 30;
        
        const currentViewportTop = this.absoluteScrollY;
        const currentViewportBottom = this.absoluteScrollY + viewportHeight;
        const cellHeight = this.rows.getRowHeight(row);
        
        if (targetAbsoluteY < currentViewportTop) {
            this.absoluteScrollY = targetAbsoluteY;
        } else if (targetAbsoluteY + cellHeight > currentViewportBottom) {
            this.absoluteScrollY = targetAbsoluteY + cellHeight - viewportHeight;
        }
        
        const currentViewportLeft = this.absoluteScrollX;
        const currentViewportRight = this.absoluteScrollX + viewportWidth;
        const cellWidth = this.cols ? this.cols.getColumnWidth(col) : this.default_col_width;
        
        if (targetAbsoluteX < currentViewportLeft) {
            this.absoluteScrollX = targetAbsoluteX;
        } else if (targetAbsoluteX + cellWidth > currentViewportRight) {
            this.absoluteScrollX = targetAbsoluteX + cellWidth - viewportWidth;
        }
        
        this.absoluteScrollY = Math.max(0, this.absoluteScrollY);
        this.absoluteScrollX = Math.max(0, this.absoluteScrollX);
        
        const rowPosition = this.rowCanvas.calculateRowPosition(this.absoluteScrollY);
        this.rowStart = rowPosition.rowStart;
        this.scroll.scrollY = rowPosition.scrollY;
        
        const colPosition = this.calculateColPosition(this.absoluteScrollX);
        this.colStart = colPosition.colStart;
        this.scroll.scrollX = colPosition.scrollX;
        
        this.updateRenderer();
    }

    /**
     * onSelection change 
     * @param {*} selections 
     */
    onSelectionChange(selections) {
        this.updateRenderer();

        for(let sel of selections){
            console.log(sel.activeRow)
            console.log(sel.activeCol)
            this.cellAddressInput.value = `${this.colCanvas.columnLabel(sel.activeCol)}${sel.activeRow+1}`;
        }
        this.calculateStats(selections); 
    }

    /**
     * Function to get the details of the selection 
     * @returns {object}
     */
    getSelectionForRendering() {
        return {
            selections: this.selection.getAllSelections(),
            bounds: this.selection.getSelectionBounds(),
            isCellSelected: (row, col) => this.selection.isCellSelected(row, col),
            isRowSelected: (row) => this.selection.isRowSelected(row),
            isColumnSelected: (col) => this.selection.isColumnSelected(col),
            scrollOffsetX: this.scroll.scrollX,
            scrollOffsetY: this.scroll.scrollY,
            absoluteScrollX: this.absoluteScrollX,
            absoluteScrollY: this.absoluteScrollY,
            rowStart: this.rowStart,
            colStart: this.colStart,
            isEditing: this.isEditing
        };
    }

}