import { ViewPort } from "./ViewPort.js";
import { Columns } from "./data/Columns.js";
import { Rows } from "./data/Rows.js";
import {DataStore} from "./data/DataStore.js"
import { Selection } from "./rendering/Selection.js";
import { EventManager } from "./EventManager.js";
import { CellSelection } from "./handlers/CellSelection.js";
import { ColumnResizer } from "./handlers/ColumnResizer.js";
import { RowResizer } from "./handlers/RowResizer.js";
import  { ColumnSelection } from "./handlers/ColumnSelection.js";
import { RowSelection } from "./handlers/RowSelection.js";

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

        this.eventmanager = new EventManager();

        this.eventmanager.RegisterHandler(new CellSelection(this.viewport));
        this.eventmanager.RegisterHandler(new RowResizer(this.viewport));
        this.eventmanager.RegisterHandler(new RowSelection(this.viewport));
        this.eventmanager.RegisterHandler(new ColumnResizer(this.viewport));
        this.eventmanager.RegisterHandler(new ColumnSelection(this.viewport));


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

        window.addEventListener('pointerdown', (e) => {
            this.eventmanager.pointerDown(e)
        });

        window.addEventListener('pointermove', (e) => {
            this.eventmanager.pointerMove(e)
        });

        window.addEventListener('pointerup', (e) => {
            this.eventmanager.pointerUp(e)
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
                this.gridContainer.style.cursor = 'ns-resize';
            } else if (resizeInfo.type === 'col') {
                this.gridContainer.style.cursor = 'ew-resize';
            }
        } else {
            this.gridContainer.style.cursor = 'default';
        }
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