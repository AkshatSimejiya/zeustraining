import { GridData } from "./GridData.js";
import {Rows} from './Rows.js'
import { Columns } from "./Columns.js";

export class Canvas {

    /**
     * Initializes the Canvas class with a grid
     * @param {HTMLElement} gridContainer The container Element for grid div
     * @param {number} rowHeight The height of each row
     * @param {number} colWidth The width of each column
     */
    constructor(gridContainer, rowHeight, colWidth){

        /** @type {HTMLElement} Storing the HTML Element for grid */
        this.gridContainer = gridContainer;
        this.default_col_width = colWidth;
        this.default_row_height = rowHeight;

        /** @type {number} Storing the width of the row header */
        this.row_header_width = 30;

        this.viewPortWidth = 0;
        this.viewPortHeight = 0;

        this.scrollY = 0;
        this.scrollX = 0;
        this.rowStart = 0;
        this.colStart = 0;

        this.selectedCell = null;
        this.selectedRow = null;
        this.selectedColumn = null;

        this.dataStore = new GridData();

        
        this.isResizing = false;
        this.resizeType = null;
        this.resizeIndex = -1;
        this.resizeStartPos = 0;
        this.resizeStartSize = 0;
        
        this.rowManager = new Rows(this.default_row_height);
        this.colsManager = new Columns(this.default_col_width);
        this.colWidths = new Map();

        this.isEditing = false;

        this.isSelecting = false;
        this.selectionStart = null;
        this.selectionEnd = null;
        this.selectedRange = null;
        
        this.scrollbarWidth = 12;
        this.scrollbarThickness = 8;
        this.isDraggingVScrollbar = false;
        this.isDraggingHScrollbar = false;
        this.scrollbarDragOffset = 0;
        
        this.init();
    }

    /**
     * initialize the gridcontainer with canvas for viewport, row header, column header and corner
     */
    init(){
        const dpr = window.devicePixelRatio || 1;
        console.log(dpr)
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id","viewportCanvas");
        this.ctx = this.canvas.getContext("2d")
        this.ctx.translate(0.5,0.5)
        
        this.setViewportSize();

        this.cornercanvas = document.createElement("canvas");
        this.cornercanvas.setAttribute("id","cornerCanvas");
        this.ctxCr = this.cornercanvas.getContext("2d")
        this.ctxCr.translate(0.5,0.5)

        this.rowcanvas = document.createElement("canvas");
        this.rowcanvas.setAttribute("id","rowheaderCanvas");
        this.ctxR = this.rowcanvas.getContext("2d")
        this.ctxR.translate(0.5,0.5)

        this.columncanvas = document.createElement("canvas");
        this.columncanvas.setAttribute("id","columnheaderCanvas");
        this.ctxC = this.columncanvas.getContext("2d")
        this.ctxC.translate(0.5,0.5)
        
        this.gridContainer.appendChild(this.canvas)
        this.gridContainer.appendChild(this.rowcanvas)
        this.gridContainer.appendChild(this.columncanvas)
        this.gridContainer.appendChild(this.cornercanvas)
        
        this.renderer()

        window.addEventListener("resize",()=>{
            this.renderer()
        })

        this.canvas.addEventListener("dblclick",(e)=>{
            this.addSelection(e)
        })

        this.gridContainer.addEventListener("wheel", (e) => {
            e.preventDefault();
            this.updatedScroll(e);
        }, { passive: false });

        this.canvas.addEventListener("click", (e) => {
            this.handleCellClick(e);
        });

        this.rowcanvas.addEventListener("click", (e) => {
            this.handleRowClick(e);
        });

        this.rowcanvas.addEventListener("mousedown", (e) => {
            this.handleRowMouseDown(e);
        });

        this.columncanvas.addEventListener("click", (e) => {
            this.handleColumnClick(e);
        });

        this.columncanvas.addEventListener("mousedown", (e) => {
            this.handleColumnMouseDown(e);
        });

        document.addEventListener("mousemove", (e) => {
            this.handleMouseMove(e);
        });

        document.addEventListener("mouseup", (e) => {
            this.handleMouseUp(e);
        });

        this.rowcanvas.addEventListener("mousemove", (e) => {
            this.updateRowCursor(e);
        });

        this.columncanvas.addEventListener("mousemove", (e) => {
            this.updateColumnCursor(e);
        });

        window.addEventListener("keydown", (e) => {
            this.handleTyping(e);
        });

        // Replace the existing cell click handler with these:
        this.canvas.addEventListener("mousedown", (e) => {
            this.handleCellMouseDown(e);
        });

        this.canvas.addEventListener("mousemove", (e) => {
            this.handleCellMouseMove(e);
        });

        this.canvas.addEventListener("mouseup", (e) => {
            this.handleCellMouseUp(e);
        });
        
        // Create scrollbars
        this.createScrollbars();
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
    getColAtPosition(x) {
        let currentX = -this.scrollX;
        let colIndex = this.colStart;
        
        while (currentX < x) {
            currentX += this.getColWidth(colIndex);
            if (currentX > x) break;
            colIndex++;
        }
        
        return colIndex;
    }

    /**
     * Handle click on the row header
     * @param {event} e The event passed from the click
    */
    handleRowClick(e) {
        if (this.isResizing) return;
        
        const rowIndex = this.rowManager.getRowAtPosition(this.rowStart, this.scrollY, e.offsetY);
        this.selectedRow = rowIndex;
        this.selectedColumn = null;
        this.selectedCell = null;
        
        this.removeInputElements();
        
        this.renderer();
    }

    /**
     * Handle click on the column header
     * @param {event} e The event passed from the click
    */
    handleColumnClick(e) {
        if (this.isResizing) return;
        
        const colIndex = this.getColAtPosition(e.offsetX);
        this.selectedColumn = colIndex;
        this.selectedRow = null;
        this.selectedCell = null;
        
        this.removeInputElements();
        
        this.renderer();
    }

    /**
     * Handle mousedown on the row header
     * @param {event} e The event passed from the mousedown
     */
    handleRowMouseDown(e) {
        const resizeThreshold = 3;
        const rowIndex = this.rowManager.getRowAtPosition(this.rowStart, this.scrollY, e.offsetY);
        console.log(this.rowStart, this.scrollY, rowIndex);
        const rowY = this.rowManager.getRowPosition(this.rowStart, this.scrollY,rowIndex);
        const rowHeight = this.rowManager.getRowHeight(rowIndex);
        
        if (Math.abs(e.offsetY - (rowY + rowHeight)) < resizeThreshold) {
            this.isResizing = true;
            this.resizeType = 'row';
            this.resizeIndex = rowIndex;
            this.resizeStartPos = e.clientY;
            this.resizeStartSize = this.rowManager.getRowHeight(rowIndex);
            e.preventDefault();
        }
    }

    /**
     * Handle mousedown on the column header
     * @param {event} e The event passed from the mousedown
     */
    handleColumnMouseDown(e) {
        const resizeThreshold = 3;
        const colIndex = this.getColAtPosition(e.offsetX);
        const colX = this.getColPosition(colIndex);
        const colWidth = this.getColWidth(colIndex);
        
        if (Math.abs(e.offsetX - (colX + colWidth)) < resizeThreshold) {
            this.isResizing = true;
            this.resizeType = 'column';
            this.resizeIndex = colIndex;
            this.resizeStartPos = e.clientX;
            this.resizeStartSize = this.getColWidth(colIndex);
            e.preventDefault();
        }
    }

    /**
     * Handle mouse move to resize rows or columns
     * @param {event} e event object 
     */
    handleMouseMove(e) {
        if (!this.isResizing) return;
        
        if (this.resizeType === 'row') {
            const deltaY = e.clientY - this.resizeStartPos;
            const newHeight = this.resizeStartSize + deltaY;
            this.rowManager.setRowHeight(this.resizeIndex, newHeight);
        } else if (this.resizeType === 'column') {
            const deltaX = e.clientX - this.resizeStartPos;
            const newWidth = this.resizeStartSize + deltaX;
            this.setColWidth(this.resizeIndex, newWidth);
        }
        
        this.renderer();
    }

    /**
     * Release the resizing state on mouse up
     * @param {event} e event object of the listener
     */
    handleMouseUp(e) {
        if (this.isResizing) {
            this.isResizing = false;
            this.resizeType = null;
            this.resizeIndex = -1;
        }
    }

    /**
     * Updating the cursor to indicating the row resizing feature
     * @param {event} e event object
    */
    updateRowCursor(e) {
        if (this.isResizing) return;
        
        const resizeThreshold = 3;
        const rowIndex = this.rowManager.getRowAtPosition(this.rowStart, this.scrollY, e.offsetY);
        console.log(this.rowStart, this.scrollY, rowIndex);
        const rowY = this.rowManager.getRowPosition(this.rowStart, this.scrollY, rowIndex);
        const rowHeight = this.rowManager.getRowHeight(rowIndex);
        
        if (Math.abs(e.offsetY - (rowY + rowHeight)) < resizeThreshold) {
            this.rowcanvas.style.cursor = 'ns-resize';
        } else {
            this.rowcanvas.style.cursor = 'pointer';
        }
    }

    /**
     * Updating the cursor to indicating the column resizing feature
     * @param {event} e event object
    */
    updateColumnCursor(e) {
        if (this.isResizing) return;
        
        const resizeThreshold = 3;
        const colIndex = this.getColAtPosition(e.offsetX);
        const colX = this.getColPosition(colIndex);
        const colWidth = this.getColWidth(colIndex);
        
        if (Math.abs(e.offsetX - (colX + colWidth)) < resizeThreshold) {
            this.columncanvas.style.cursor = 'ew-resize';
        } else {
            this.columncanvas.style.cursor = 'pointer';
        }
    }

    /**
     * Handle mouse click on a cell
     * @param {event} e event object
     */
    handleCellClick(e) {
        const col = this.getColAtPosition(e.offsetX);
        const row = this.rowManager.getRowAtPosition(this.rowStart, this.scrollY, e.offsetY);

        this.selectedCell = {
            row: row,
            col: col
        };
        this.selectedRow = null;
        this.selectedColumn = null;

        this.removeInputElements();

        this.createSelectionMarker(row, col);

        this.renderer();
    }

    /**
     * Handle keydown events for cell editing
     * @param {event} e event object
     */
    handleTyping(e) {
        if (!this.selectedCell || this.isEditing) return;
        
        if (e.key.length === 1 || e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault();
            this.startCellEdit(e.key);
        }
    }

    /**
     * Start editing a cell
     * @param {string} initialKey The initial key pressed to start editing
     */
    startCellEdit(initialKey = '') {
        if (!this.selectedCell || this.isEditing) return;

        const { row, col } = this.selectedCell;
        this.isEditing = true;
        
        this.removeInputElements();

        const currentValue = this.dataStore.get(`${row},${col}`) || '';
        
        let inputValue = '';
        if (initialKey === 'Delete' || initialKey === 'Backspace') {
            inputValue = '';
        } else if (initialKey && initialKey.length === 1) {
            inputValue = initialKey;
        } else {
            inputValue = currentValue; 
        }

        this.createCellInput(row, col, inputValue);
    }

    /**
     * Create a selection marker for the selected cell
     * @param {number} row The row index of the selected cell
     * @param {number} col The column index of the selected cell
     */
    createSelectionMarker(row, col) {
        this.removeSelectionMarker();

        const x = this.getColPosition(col);
        console.log(this.rowStart, this.scrollY, row);
        const y = this.rowManager.getRowPosition(this.rowStart, this.scrollY, row);
        const colWidth = this.getColWidth(col);
        const rowHeight = this.rowManager.getRowHeight(row);

        const marker = document.createElement("div");
        marker.className = "cell-marker";
        marker.style.position = "absolute";
        marker.style.width = "6px";
        marker.style.height = "6px";
        marker.style.backgroundColor = "#147E43";
        marker.style.border = "1px solid white";
        marker.style.top = `${y + this.default_row_height + rowHeight - 3}px`;
        marker.style.left = `${x + this.row_header_width + colWidth - 3}px`;
        marker.style.cursor = "crosshair";
        marker.style.zIndex = "1001";

        this.gridContainer.appendChild(marker);
    }

    /**
     * Remove the selection marker if it exists
     */
    removeSelectionMarker() {
        const existingMarker = this.gridContainer.querySelector("div.cell-marker");
        if (existingMarker && existingMarker.parentNode) {
            existingMarker.parentNode.removeChild(existingMarker);
        }
    }

    /**
     * Create an input element for editing a cell
     * @param {number} row The row index of the cell
     * @param {number} col The column index of the cell
     * @param {string} initialValue The initial value to display in the input
     */
    createCellInput(row, col, initialValue) {
        const x = this.getColPosition(col);
        console.log(this.rowStart, this.scrollY, row);
        const y = this.rowManager.getRowPosition(this.rowStart, this.scrollY, row);
        const colWidth = this.getColWidth(col);
        const rowHeight = this.rowManager.getRowHeight(row);

        console.log(y)
        console.log(this.rowManager.getRowHeight(row))
        const input = document.createElement("input");
        input.className = "cell-editor";
        input.type = "text";
        input.value = initialValue;

        input.style.position = "absolute";
        input.style.top = `${y + this.default_row_height}px`;
        input.style.left = `${x + this.row_header_width}px`;
        input.style.width = `${colWidth - 5}px`;
        input.style.height = `${rowHeight - 5}px`;
        input.style.padding = "2px";
        input.style.border = "2px solid #147E43";
        input.style.outline = "none";
        input.style.font = "12px Arial";
        input.style.backgroundColor = "white";
        input.style.zIndex = "1000";

        this.gridContainer.appendChild(input);

        input.focus();
        if (initialValue === this.dataStore.get(row, col)) {
            input.select();
        } else {
            input.setSelectionRange(initialValue.length, initialValue.length);
        }

        input.addEventListener("blur", () => {
            this.finishCellEdit(row, col, input.value);
        });

        input.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                ev.preventDefault();
                this.finishCellEdit(row, col, input.value);
            } else if (ev.key === "Escape") {
                ev.preventDefault();
                this.cancelCellEdit();
            }
        });
    }

    /**
     * Set the value of a cell after editing
     * @param {number} row the row index
     * @param {number} col the column index
     * @param {*} value the new value for the cell
     */
    finishCellEdit(row, col, value) {
        if (!this.isEditing) return;
        
        const trimmedValue = value.trim();
        const key = `${row},${col}`;
        
        if (trimmedValue) {
            this.dataStore.set(row, col, trimmedValue);
        } else {
            this.dataStore.delete(row, col);
        }
        
        this.isEditing = false;
        this.removeInputElements();
        
        if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
            this.createSelectionMarker(row, col);
        }
        
        this.renderer();
    }

    /**
     * Cancel the cell edit
     */
    cancelCellEdit() {
        this.isEditing = false;
        this.removeInputElements();
        
        if (this.selectedCell) {
            this.createSelectionMarker(this.selectedCell.row, this.selectedCell.col);
        }
        
        this.renderer();
    }

    /** Remove input elements if present*/
    removeInputElements() {
        const input = this.gridContainer.querySelector("input.cell-editor");
        if (input && input.parentNode) {
            input.parentNode.removeChild(input);
        }
        
        const mark = this.gridContainer.querySelector("div.mark-editor");
        if (mark && mark.parentNode) {
            mark.parentNode.removeChild(mark);
        }
    }

    /**
     * Add a selection marker for the selected cell
     * @param {event} e event object
     */
    addSelection(e) {
        if (!this.selectedCell) return;
        
        this.startCellEdit();
    }

    /**
     * Update the scroll position of the grid
     * @param {WheelEvent} e The wheel event
     */
    updatedScroll(e){
        const delta = e.deltaY;

        if (e.shiftKey) {
            let adjustedDelta = delta * 0.2;
            this.scrollX += adjustedDelta;

            while (this.scrollX >= this.getColWidth(this.colStart)) {
                this.scrollX -= this.getColWidth(this.colStart);
                this.colStart++;
            }

            while (this.scrollX <= -this.getColWidth(this.colStart - 1) && this.colStart > 0) {
                this.colStart--;
                this.scrollX += this.getColWidth(this.colStart);
            }

            if (this.colStart === 0 && this.scrollX < 0) {
                this.scrollX = 0;
            }
        } else {
            this.scrollY += delta;

            while (this.scrollY >= this.rowManager.getRowHeight(this.rowStart)) {
                this.scrollY -= this.rowManager.getRowHeight(this.rowStart);
                this.rowStart++;
            }

            while (this.scrollY <= -this.rowManager.getRowHeight(this.rowStart - 1) && this.rowStart > 0) {
                this.rowStart--;
                this.scrollY += this.rowManager.getRowHeight(this.rowStart);
            }

            if (this.rowStart === 0 && this.scrollY < 0) {
                this.scrollY = 0;
            }
        }

        if (this.selectedCell && !this.isEditing) {
            this.createSelectionMarker(this.selectedCell.row, this.selectedCell.col);
        } else {
            this.removeSelectionMarker();
        }

        this.renderer();
    }

    /**
     * render the grid
     */
    renderer(){
        const dpr = window.devicePixelRatio || 1;
        
        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.canvas.height = (this.gridContainer.clientHeight - this.default_row_height) * dpr;
        this.canvas.style.width = (this.gridContainer.clientWidth - this.row_header_width) + "px";
        this.canvas.style.height = (this.gridContainer.clientHeight - this.default_row_height) + "px";
        this.canvas.style.top = this.default_row_height + "px";
        this.canvas.style.left = this.row_header_width + "px";
        this.ctx.scale(dpr, dpr);
        
        this.ctxCr = this.cornercanvas.getContext("2d")
        this.cornercanvas.width = this.row_header_width * dpr;
        this.cornercanvas.height = this.default_row_height * dpr;
        this.cornercanvas.style.width = this.row_header_width + "px";
        this.cornercanvas.style.height = this.default_row_height + "px";
        this.cornercanvas.style.top = "0px";
        this.cornercanvas.style.left = "0px";
        this.ctxCr.scale(dpr, dpr);
        
        this.ctxR = this.rowcanvas.getContext("2d")
        this.rowcanvas.width = this.row_header_width * dpr;
        this.rowcanvas.height = (this.gridContainer.clientHeight - this.default_row_height)  * dpr;
        this.rowcanvas.style.width = this.row_header_width + "px";
        this.rowcanvas.style.height = (this.gridContainer.clientHeight - this.default_row_height) + "px";
        this.rowcanvas.style.top = this.default_row_height + "px";
        this.rowcanvas.style.left = "0px";
        this.ctxR.scale(dpr, dpr);
        
        this.ctxC = this.columncanvas.getContext("2d")
        this.columncanvas.width = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.columncanvas.height = (this.default_row_height)  * dpr;
        this.columncanvas.style.width = (this.gridContainer.clientWidth - this.row_header_width)+ "px";
        this.columncanvas.style.height = this.default_row_height + "px";
        this.columncanvas.style.top =  "0px";
        this.columncanvas.style.left = this.row_header_width +"px";
        this.ctxC.scale(dpr, dpr);
        
        this.setViewportSize();

        this.renderCanvas(this.ctx)
        this.renderRows(this.ctxR)
        this.renderColumns(this.ctxC)
        this.renderCorner(this.ctxCr)

        this.updateScrollbars();
    }

    /**
     * Set the viewport size based on the dpr
     */
    setViewportSize(){
        const dpr = window.devicePixelRatio || 1;
        this.viewPortWidth = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.viewPortHeight = (this.gridContainer.clientHeight - this.default_row_height) * dpr;
    }

    /**
     * Render the grid 
     * @param {*} ctx context of the canvas
     */
    renderCanvas(ctx){
        ctx.clearRect(0, 0, this.viewPortWidth, this.viewPortHeight);
        
        let visibleRows = [];
        let visibleCols = [];
        let currentY = -this.scrollY;
        let currentX = -this.scrollX;
        let rowIndex = this.rowStart;
        let colIndex = this.colStart;
        
        while (currentY < this.viewPortHeight && rowIndex < this.rowStart + 100) {
            const rowHeight = this.rowManager.getRowHeight(rowIndex);
            if (currentY + rowHeight >= 0) {
                visibleRows.push({ index: rowIndex, y: currentY, height: rowHeight });
            }
            currentY += rowHeight;
            rowIndex++;
        }
        
        while (currentX < this.viewPortWidth && colIndex < this.colStart + 100) {
            const colWidth = this.getColWidth(colIndex);
            if (currentX + colWidth >= 0) {
                visibleCols.push({ index: colIndex, x: currentX, width: colWidth });
            }
            currentX += colWidth;
            colIndex++;
        }

        ctx.lineWidth = 1 / window.devicePixelRatio;
        ctx.font = "12px Arial";
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#000";

        ctx.beginPath();
        
        for (let row of visibleRows) {
            ctx.moveTo(0, row.y + row.height + 0.5);
            ctx.lineTo(this.viewPortWidth, row.y + row.height + 0.5);
        }
        
        for (let col of visibleCols) {
            ctx.moveTo(col.x + col.width + 0.5, 0);
            ctx.lineTo(col.x + col.width + 0.5, this.viewPortHeight);
        }
        
        ctx.stroke();
        ctx.closePath();

        for (let row of visibleRows) {
            for (let col of visibleCols) {
                const value = this.dataStore.get(row.index, col.index) || '';
                if (value) {
                    const x = col.x + 5;
                    const y = row.y + row.height / 2 + 4;
                    ctx.fillText(value, x, y);
                }
            }
        }

        if (this.selectedRow !== null) {
            const row = visibleRows.find(r => r.index === this.selectedRow);
            if (row) {
                ctx.fillStyle = "rgba(20, 126, 67, 0.2)";
                ctx.fillRect(0, row.y, this.viewPortWidth, row.height);
            }
        }

        if (this.selectedColumn !== null) {
            const col = visibleCols.find(c => c.index === this.selectedColumn);
            if (col) {
                ctx.fillStyle = "rgba(20, 126, 67, 0.2)";
                ctx.fillRect(col.x, 0, col.width, this.viewPortHeight);
            }
        }

        if (this.selectedCell) {
            const { row, col } = this.selectedCell;
            const visRow = visibleRows.find(r => r.index === row);
            const visCol = visibleCols.find(c => c.index === col);

            if (visRow && visCol) {
                ctx.strokeStyle = "#147E43";
                ctx.lineWidth = 2 / window.devicePixelRatio;
                ctx.strokeRect(visCol.x + 0.5, visRow.y + 0.5, visCol.width, visRow.height);
            }
        }

        if (this.selectedRange) {
            const { startRow, endRow, startCol, endCol } = this.selectedRange;
            
            for (let row of visibleRows) {
                for (let col of visibleCols) {
                    if (row.index >= startRow && row.index <= endRow && 
                        col.index >= startCol && col.index <= endCol) {
                        ctx.fillStyle = "rgba(20, 126, 67, 0.1)";
                        ctx.fillRect(col.x, row.y, col.width, row.height);
                        
                        ctx.strokeStyle = "#147E43";
                        ctx.lineWidth = 2 / window.devicePixelRatio;

                        if (row.index === startRow) {
                            ctx.beginPath();
                            ctx.moveTo(col.x, row.y + 0.5);
                            ctx.lineTo(col.x + col.width, row.y + 0.5);
                            ctx.stroke();
                        }
                        
                        if (row.index === endRow) {
                            ctx.beginPath();
                            ctx.moveTo(col.x, row.y + row.height - 0.5);
                            ctx.lineTo(col.x + col.width, row.y + row.height - 0.5);
                            ctx.stroke();
                        }
                        
                        if (col.index === startCol) {
                            ctx.beginPath();
                            ctx.moveTo(col.x + 0.5, row.y);
                            ctx.lineTo(col.x + 0.5, row.y + row.height);
                            ctx.stroke();
                        }
                        
                        if (col.index === endCol) {
                            ctx.beginPath();
                            ctx.moveTo(col.x + col.width - 0.5, row.y);
                            ctx.lineTo(col.x + col.width - 0.5, row.y + row.height);
                            ctx.stroke();
                        }
                    }
                }
            }

            ctx.lineWidth = 1 / window.devicePixelRatio;
            ctx.strokeStyle = "#d0d0d0";
        }

        ctx.fillStyle = "#000";
    }

    /**
     * Render the rows of the grid
     * @param {*} ctx context of the canvas
     */
    renderRows(ctx){
        ctx.clearRect(0, 0, this.row_header_width, this.viewPortHeight);
        
        ctx.lineWidth = 1  / window.devicePixelRatio;
        ctx.font = "12px Arial"
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, 0, this.row_header_width, this.viewPortHeight);

        let currentY = -this.scrollY;
        let rowIndex = this.rowStart;
        
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.moveTo(this.row_header_width-0.5, 0);
        ctx.lineTo(this.row_header_width-0.5, this.viewPortHeight);
        while (currentY < this.viewPortHeight && rowIndex < this.rowStart + 100) {
            const rowHeight = this.rowManager.getRowHeight(rowIndex);
            
            if (currentY + rowHeight >= 0) {
                if (this.selectedRow === rowIndex) {
                    ctx.fillStyle = "rgba(20, 126, 67, 0.3)";
                    ctx.fillRect(0, currentY, this.row_header_width, rowHeight);
                    ctx.fillStyle = "#000";
                }
                
                const label = rowIndex + 1;
                ctx.fillText(label, 5, currentY + rowHeight / 2 + 4);
                
                ctx.moveTo(0, currentY + rowHeight + 0.5);
                ctx.lineTo(this.row_header_width, currentY + rowHeight + 0.5);
            }
            
            currentY += rowHeight;
            rowIndex++;
        }
        
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Render the columns of the grid
     * @param {*} ctx context of the canvas
     */
    renderColumns(ctx){
        ctx.clearRect(0, 0, this.viewPortWidth, this.default_row_height);
        
        ctx.lineWidth = 1 / window.devicePixelRatio;
        ctx.font = "12px Arial"
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#F5F5F5";
        ctx.textBaseline = "middle";
        ctx.fillRect(0, 0, this.viewPortWidth, this.default_row_height);

        let currentX = -this.scrollX;
        let colIndex = this.colStart;
        
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.moveTo(0, this.default_row_height-0.5);
        ctx.lineTo(this.viewPortWidth, this.default_row_height-0.5);
        while (currentX < this.viewPortWidth && colIndex < this.colStart + 100) {
            const colWidth = this.getColWidth(colIndex);
            
            if (currentX + colWidth >= 0) {
                if (this.selectedColumn === colIndex) {
                    ctx.fillStyle = "rgba(20, 126, 67, 0.3)";
                    ctx.fillRect(currentX, 0, colWidth, this.default_row_height);
                    ctx.fillStyle = "#000";
                }
                
                const label = this.columnLabel(colIndex);
                ctx.fillText(label, currentX + colWidth / 2, this.default_row_height / 2);
                
                ctx.moveTo(currentX + colWidth + 0.5, 0);
                ctx.lineTo(currentX + colWidth + 0.5, this.default_row_height);
            }
            
            currentX += colWidth;
            colIndex++;
        }
        
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Render the corner on top left
     * @param {*} ctx context of the corner canvas
     */
    renderCorner(ctx){
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, 0, this.row_header_width, this.default_row_height);

        ctx.lineWidth = 1 / window.devicePixelRatio;
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "#d0d0d0";
        ctx.moveTo(this.row_header_width-0.5, 0);
        ctx.lineTo(this.row_header_width-0.5, this.default_row_height);

        ctx.moveTo(0, this.default_row_height-0.5);
        ctx.lineTo(this.row_header_width-0.5, this.default_row_height-0.5);
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Handle mouse down event on a cell
     * @param {*} e event object
     */
    handleCellMouseDown(e) {
        const col = this.getColAtPosition(e.offsetX);
        const row = this.rowManager.getRowAtPosition(this.rowStart, this.scrollY, e.offsetY);
        
        if (!e.ctrlKey && !e.shiftKey) {
            this.selectedCell = { row: row, col: col };
            this.selectedRow = null;
            this.selectedColumn = null;
            this.selectedRange = null;
            
            this.removeInputElements();
            this.createSelectionMarker(row, col);
        } else if (e.shiftKey && this.selectedCell) {
            this.selectedRange = {
                startRow: Math.min(this.selectedCell.row, row),
                endRow: Math.max(this.selectedCell.row, row),
                startCol: Math.min(this.selectedCell.col, col),
                endCol: Math.max(this.selectedCell.col, col)
            };
            this.removeInputElements();
            this.removeSelectionMarker();
        } else {
            this.isSelecting = true;
            this.selectionStart = { row: row, col: col };
            this.selectionEnd = { row: row, col: col };
            this.selectedCell = null;
            this.selectedRow = null;
            this.selectedColumn = null;
            this.removeInputElements();
            this.removeSelectionMarker();
        }
        
        this.renderer();
    }

    /**
     * Handle mouse move event on a cell
     * @param {*} e event object
     */
    handleCellMouseMove(e) {
        if (!this.isSelecting) return;
        
        const col = this.getColAtPosition(e.offsetX);
        const row = this.rowManager.getRowAtPosition(this.rowStart, this.scrollY, e.offsetY);
        
        this.selectionEnd = { row: row, col: col };
        this.selectedRange = {
            startRow: Math.min(this.selectionStart.row, this.selectionEnd.row),
            endRow: Math.max(this.selectionStart.row, this.selectionEnd.row),
            startCol: Math.min(this.selectionStart.col, this.selectionEnd.col),
            endCol: Math.max(this.selectionStart.col, this.selectionEnd.col)
        };
        
        this.renderer();
    }

    /**
     * Handle mouse up event on a cell
     * @param {*} e event object
     */
    handleCellMouseUp(e) {
        if (this.isSelecting) {
            this.isSelecting = false;
        }
    }

    createScrollbars() {
        this.removeScrollbars();
        
        this.vScrollbar = document.createElement('div');
        this.vScrollbar.className = 'custom-v-scrollbar';
        this.vScrollbar.style.cssText = `
            position: absolute;
            right: 0;
            top: ${this.default_row_height}px;
            width: ${this.scrollbarWidth}px;
            height: ${this.gridContainer.clientHeight - this.default_row_height}px;
            background: #f0f0f0;
            border-left: 1px solid #ddd;
            z-index: 1002;
        `;
        
        this.vScrollThumb = document.createElement('div');
        this.vScrollThumb.className = 'custom-v-scroll-thumb';
        this.vScrollThumb.style.cssText = `
            position: absolute;
            right: 2px;
            width: ${this.scrollbarThickness}px;
            background: #c0c0c0;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        
        this.hScrollbar = document.createElement('div');
        this.hScrollbar.className = 'custom-h-scrollbar';
        this.hScrollbar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: ${this.row_header_width}px;
            width: ${this.gridContainer.clientWidth - this.row_header_width - this.scrollbarWidth}px;
            height: ${this.scrollbarWidth}px;
            background: #f0f0f0;
            border-top: 1px solid #ddd;
            z-index: 1002;
        `;
        
        this.hScrollThumb = document.createElement('div');
        this.hScrollThumb.className = 'custom-h-scroll-thumb';
        this.hScrollThumb.style.cssText = `
            position: absolute;
            top: 2px;
            height: ${this.scrollbarThickness}px;
            background: #c0c0c0;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        
        this.vScrollThumb.addEventListener('mouseenter', () => {
            this.vScrollThumb.style.background = '#a0a0a0';
        });
        this.vScrollThumb.addEventListener('mouseleave', () => {
            if (!this.isDraggingVScrollbar) {
                this.vScrollThumb.style.background = '#c0c0c0';
            }
        });
        
        this.hScrollThumb.addEventListener('mouseenter', () => {
            this.hScrollThumb.style.background = '#a0a0a0';
        });
        this.hScrollThumb.addEventListener('mouseleave', () => {
            if (!this.isDraggingHScrollbar) {
                this.hScrollThumb.style.background = '#c0c0c0';
            }
        });
        
        this.addScrollbarListeners();
        
        this.vScrollbar.appendChild(this.vScrollThumb);
        this.hScrollbar.appendChild(this.hScrollThumb);
        this.gridContainer.appendChild(this.vScrollbar);
        this.gridContainer.appendChild(this.hScrollbar);
        
        this.updateScrollbars();
    }

    /**
     * Add event listeners for the custom scrollbars
     */
    addScrollbarListeners() {
        this.vScrollThumb.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDraggingVScrollbar = true;
            this.scrollbarDragOffset = e.offsetY;
            this.vScrollThumb.style.background = '#808080';
        });
        
        this.vScrollbar.addEventListener('click', (e) => {
            if (e.target === this.vScrollbar) {
                const clickY = e.offsetY;
                const thumbHeight = parseInt(this.vScrollThumb.style.height);
                const newTop = Math.max(0, Math.min(clickY - thumbHeight/2, 
                    this.vScrollbar.clientHeight - thumbHeight));
                this.updateVerticalScrollFromThumb(newTop);
            }
        });
        
        this.hScrollThumb.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDraggingHScrollbar = true;
            this.scrollbarDragOffset = e.offsetX;
            this.hScrollThumb.style.background = '#808080';
        });
        
        this.hScrollbar.addEventListener('click', (e) => {
            if (e.target === this.hScrollbar) {
                const clickX = e.offsetX;
                const thumbWidth = parseInt(this.hScrollThumb.style.width);
                const newLeft = Math.max(0, Math.min(clickX - thumbWidth/2, 
                    this.hScrollbar.clientWidth - thumbWidth));
                this.updateHorizontalScrollFromThumb(newLeft);
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDraggingVScrollbar) {
                const rect = this.vScrollbar.getBoundingClientRect();
                const y = e.clientY - rect.top - this.scrollbarDragOffset;
                const maxY = this.vScrollbar.clientHeight - parseInt(this.vScrollThumb.style.height);
                const newTop = Math.max(0, Math.min(y, maxY));
                this.updateVerticalScrollFromThumb(newTop);
            }
            
            if (this.isDraggingHScrollbar) {
                const rect = this.hScrollbar.getBoundingClientRect();
                const x = e.clientX - rect.left - this.scrollbarDragOffset;
                const maxX = this.hScrollbar.clientWidth - parseInt(this.hScrollThumb.style.width);
                const newLeft = Math.max(0, Math.min(x, maxX));
                this.updateHorizontalScrollFromThumb(newLeft);
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDraggingVScrollbar) {
                this.isDraggingVScrollbar = false;
                this.vScrollThumb.style.background = '#c0c0c0';
            }
            if (this.isDraggingHScrollbar) {
                this.isDraggingHScrollbar = false;
                this.hScrollThumb.style.background = '#c0c0c0';
            }
        });
    }

    /**
     * Update the vertical scroll position
     * @param {} thumbTop 
     */
    updateVerticalScrollFromThumb(thumbTop) {
        const scrollbarHeight = this.vScrollbar.clientHeight;
        const thumbHeight = parseInt(this.vScrollThumb.style.height);
        const scrollRatio = thumbTop / (scrollbarHeight - thumbHeight);
        
        const totalRows = this.rowStart + 100;
        let totalHeight = 0;
        for (let i = 0; i < totalRows; i++) {
            totalHeight += this.rowManager.getRowHeight(i);
        }
        
        const maxScroll = Math.max(0, totalHeight - this.gridContainer.clientHeight);
        const newScrollY = scrollRatio * maxScroll;
        
        this.scrollY = newScrollY % this.rowManager.getRowHeight(this.rowStart);
        this.rowStart = Math.floor(newScrollY / this.default_row_height);
        
        this.vScrollThumb.style.top = thumbTop + 'px';
        this.renderer();
    }

    /**
     * Update the horizontal scroll position
     * @param {} thumbLeft 
     */
    updateHorizontalScrollFromThumb(thumbLeft) {
        const scrollbarWidth = this.hScrollbar.clientWidth;
        const thumbWidth = parseInt(this.hScrollThumb.style.width);
        const scrollRatio = thumbLeft / (scrollbarWidth - thumbWidth);
        
        const totalCols = this.colStart + 50;
        let totalWidth = 0;
        for (let i = 0; i < totalCols; i++) {
            totalWidth += this.getColWidth(i);
        }
        
        const maxScroll = Math.max(0, totalWidth - this.gridContainer.clientWidth);
        const newScrollX = scrollRatio * maxScroll;
        
        this.scrollX = newScrollX % this.getColWidth(this.colStart);
        this.colStart = Math.floor(newScrollX / this.default_col_width);
        
        this.hScrollThumb.style.left = thumbLeft + 'px';
        this.renderer();
    }

    /**
     * Update the scrollbars 
    */ 
    updateScrollbars() {
        if (!this.vScrollbar || !this.hScrollbar) return;
        
        const visibleHeight = this.gridContainer.clientHeight - this.default_row_height;
        const totalRows = Math.max(50, this.rowStart + 30);
        let totalHeight = 0;
        for (let i = 0; i < totalRows; i++) {
            totalHeight += this.rowManager.getRowHeight(i);
        }
        
        const vThumbRatio = Math.min(1, visibleHeight / totalHeight);
        const vThumbHeight = Math.max(20, this.vScrollbar.clientHeight * vThumbRatio);
        this.vScrollThumb.style.height = vThumbHeight + 'px';
        
        const visibleWidth = this.gridContainer.clientWidth - this.row_header_width - this.scrollbarWidth;
        const totalCols = Math.max(26, this.colStart + 20);
        let totalWidth = 0;
        for (let i = 0; i < totalCols; i++) {
            totalWidth += this.getColWidth(i);
        }
        
        const hThumbRatio = Math.min(1, visibleWidth / totalWidth);
        const hThumbWidth = Math.max(20, this.hScrollbar.clientWidth * hThumbRatio);
        this.hScrollThumb.style.width = hThumbWidth + 'px';
        

        this.vScrollbar.style.height = (this.gridContainer.clientHeight - this.default_row_height) + 'px';
        this.hScrollbar.style.width = (this.gridContainer.clientWidth - this.row_header_width - this.scrollbarWidth) + 'px';
    }

    /**
     * Remove the custom scrollbars if needed 
     */
    removeScrollbars() {
        const vScrollbar = this.gridContainer.querySelector('.custom-v-scrollbar');
        const hScrollbar = this.gridContainer.querySelector('.custom-h-scrollbar');
        if (vScrollbar) vScrollbar.remove();
        if (hScrollbar) hScrollbar.remove();
    }

    
    // handleCellClick(e) {
    //     this.handleCellMouseDown(e);
    // }

    /**
     * Get the column label for a given index
     * @param {number} index The index of the column
     * @returns {string} The column label
     */
    columnLabel(index) {
        let label = "";
        while (index >= 0) {
            label = String.fromCharCode((index % 26) + 65) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    }   
}