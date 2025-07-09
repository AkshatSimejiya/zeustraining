import { ViewPort } from "./ViewPort.js";
import { Columns } from "./data/Columns.js";
import { Rows } from "./data/Rows.js";
import {DataStore} from "./data/DataStore.js"
import { Selection } from "./rendering/Selection.js";

export class Grid {

    /**
     * Grid constructor which initializes the grid and its controlles
     * @param {HTMLElement} gridContainer The main container for the grid
     */
    constructor(gridContainer){
        this.gridContainer = gridContainer;

        this.rows = new Rows();
        this.cols = new Columns();
        this.DataStore = new DataStore();

        this.selectionSet = new Selection();

        this.viewport = new ViewPort(this.gridContainer, this.cols, this.rows, this.selectionSet)
        this.viewport.setDatastore(this.DataStore);

        this.isResizing = false;
        this.resizeType = null;
        this.resizeIndex = -1;
        this.resizeStartPos = 0;
        this.resizeStartSize = 0;
        
        this.originalSize = 0;
        
        this.init()
    }

    /**
     * init method to initialize the events for handling the grid
     */
    init(){

        this.gridContainer.addEventListener("wheel",(e)=>{
            e.preventDefault();  
            this.updateScroll(e)
        })

        window.addEventListener("resize",(e)=>{
            this.updateViewPort(e)
        })

        window.addEventListener('mousedown', (e) => {
            if (this.checkForResize(e)) {
                this.startResize(e);
            } else {
                this.viewport.handleMouseDown(e);
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (this.isResizing) {
                this.handleResize(e);
            } else {
                this.viewport.handleMouseMove(e);
            }
        });

        this.gridContainer.addEventListener('mousemove', (e) => {
            if (!this.isResizing) {
                this.updateResizeCursor(e);
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (this.isResizing) {
                this.endResize(e);
            } else {
                this.viewport.handleMouseUp(e);
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isResizing) {
                this.cancelResize();
            } else {
                this.viewport.handleKeyDown(e);
            }
        });
    
        this.gridContainer.addEventListener('dblclick', (e) => {
            this.viewport.handleDoubleClick(e);
        });

        this.viewport.setCallback('onCellValueChange', (data) => {
            const { row, col, value } = data;
            
            this.DataStore.setCellValue(row, col, value);
            
            this.viewport.updateRenderer();

        });
        
        this.viewport.updateRenderer();
    }

    /**
     * Update the cursor style during resize 
     * @param {event} e the mouse event passed to update the resize the cursor 
     */
    updateResizeCursor(e) {
        const resizeInfo = this.viewport.getResizeInfo(e.clientX, e.clientY);
        
        if (resizeInfo.canResize) {
            if (resizeInfo.type === 'row') {
                this.gridContainer.style.cursor = 'row-resize';
            } else if (resizeInfo.type === 'col') {
                this.gridContainer.style.cursor = 'col-resize';
            }
        } else {
            this.gridContainer.style.cursor = 'default';
        }
    }

    /**
     * Check the resize information based on the mouse position
     * @param {event} e  event object containing the mouse position
     * @returns {boolean}
     */
    checkForResize(e) {
        const resizeInfo = this.viewport.getResizeInfo(e.clientX, e.clientY);
        return resizeInfo.canResize;
    }

    /**
     * Start the resize operation
     * @param {event} e  event object containing the mouse position
     */
    startResize(e) {
        const resizeInfo = this.viewport.getResizeInfo(e.clientX, e.clientY);
        
        if (resizeInfo.canResize) {
            this.isResizing = true;
            this.resizeType = resizeInfo.type;
            this.resizeIndex = resizeInfo.index;
            this.resizeStartPos = resizeInfo.type === 'row' ? e.clientY : e.clientX;
            
            if (resizeInfo.type === 'row') {
                this.resizeStartSize = this.rows.getRowHeight(resizeInfo.index);
                this.originalSize = this.resizeStartSize;
            } else {
                this.resizeStartSize = this.cols.getColumnWidth(resizeInfo.index);
                this.originalSize = this.resizeStartSize;
            }
            
            this.gridContainer.classList.add('resizing');
            
            e.preventDefault();
        }
    }

    /**
     * Handle the resize operation - only updates headers during drag
     * @param {event} e  event object containing the mouse position
     */
    handleResize(e) {
        if (!this.isResizing) return;
        
        const currentPos = this.resizeType === 'row' ? e.clientY : e.clientX;
        const delta = currentPos - this.resizeStartPos;
        const newSize = Math.max(20, this.resizeStartSize + delta);
        
        if (this.resizeType === 'row') {
            this.rows.setRowHeight(this.resizeIndex, newSize);
        } else {
            this.cols.setColumnWidth(this.resizeIndex, newSize);
        }
        
        this.viewport.updateHeadersOnly();
        
        e.preventDefault();
    }

    /**
     * End the resize operation on mouse up - triggers full grid update
     * @param {event} e  event object containing the mouse position
     */
    endResize(e) {
        if (this.isResizing) {
            this.isResizing = false;
            
            this.viewport.updateRenderer();
            
            this.cleanup();
            e.preventDefault();
        }
    }

    /**
     * Cancel the resize operation and revert to original size
     */
    cancelResize() {
        if (this.isResizing) {
            this.isResizing = false;
            
            if (this.resizeType === 'row') {
                this.rows.setRowHeight(this.resizeIndex, this.originalSize);
            } else {
                this.cols.setColumnWidth(this.resizeIndex, this.originalSize);
            }
            
            this.viewport.updateRenderer();
            
            this.cleanup();
        }
    }

    /**
     * Clean up resize state
     */
    cleanup() {
        this.resizeType = null;
        this.resizeIndex = -1;
        this.resizeStartPos = 0;
        this.resizeStartSize = 0;
        this.originalSize = 0;
        this.gridContainer.style.cursor = 'default';
        this.gridContainer.classList.remove('resizing');
    }

    /**
     * Update the viewport on scroll event
     * @param {event} e wheel event  
     */
    updateScroll(e){
        this.viewport.updateScroll(e);
    }

    /**
     * Update the viewport on window resize based on the dpr
     * @param {event} e  event object containing the mouse position
     */
    updateViewPort(e){
        this.viewport.updateRenderer();
    }
}