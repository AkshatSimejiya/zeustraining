import { ViewPort } from "./ViewPort.js";
import { Columns } from "./data/Columns.js";
import { Rows } from "./data/Rows.js";
import {DataStore} from "./data/DataStore.js"
import { Selection } from "./rendering/Selection.js";

export class Grid {
    constructor(gridContainer){
        this.gridContainer = gridContainer;

        this.rows = new Rows();
        this.cols = new Columns();
        this.DataStore = new DataStore();

        this.selectionSet = new Selection();

        this.viewport = new ViewPort(this.gridContainer, this.cols, this.rows, this.selectionSet)

        this.init()
    }

    init(){

        this.gridContainer.addEventListener("wheel",(e)=>{
            e.preventDefault();  
            this.updateScroll(e)
        })

        window.addEventListener("resize",(e)=>{
            this.updateViewPort(e)
        })

        this.gridContainer.addEventListener("click", (e) => {
            this.updateClick(e);
        });

        this.gridContainer.addEventListener('mousedown', (e) => {
            this.viewport.handleMouseDown(e);
        });

        this.gridContainer.addEventListener('mousemove', (e) => {
            this.viewport.handleMouseMove(e);
        });

        this.gridContainer.addEventListener('mouseup', (e) => {
            this.viewport.handleMouseUp(e);
        });

        // Keyboard events for selection
        window.addEventListener('keydown', (e) => {
            this.viewport.handleKeyDown(e);
        });
    

        // this.setupExampleRowHeights();

    }

    setupExampleRowHeights() {
        this.rows.setRowHeight(2, 50);
        this.rows.setRowHeight(5, 75);
        this.rows.setRowHeight(8, 100);

        this.cols.setColumnWidth(2, 150);
        this.cols.setColumnWidth(5, 200);

        this.viewport.updateRenderer();
    }

    /**
     * Public method to change row height
     */
    // setRowHeight(rowIndex, height) {
    //     this.rows.setRowHeight(rowIndex, height);
    //     this.viewport.updateRenderer();
    // }

    /**
     * Public method to get row height
     */
    // getRowHeight(rowIndex) {
    //     return this.rows.getRowHeight(rowIndex);
    // }

    /**
     * Scroll to a specific row
     */
    // scrollToRow(rowIndex) {
    //     const absolutePosition = this.viewport.getAbsoluteRowPosition(rowIndex);
    //     this.viewport.absoluteScrollY = absolutePosition;
    //     this.viewport.calculateRowStart();
    //     this.viewport.updateRenderer();
    // }

    updateScroll(e){
        this.viewport.updateScroll(e);
    }

    updateViewPort(e){
        this.viewport.updateRenderer();
    }
    
    updateClick(e){
        const position = this.viewport.getGridPositionFromClick(e.clientX, e.clientY);
            
        if (position.isHeader) {
            if (position.isRowHeader) {
                console.log(`Clicked on row header at (${position.x}, ${position.y})`);
            } else if (position.isColHeader) {
                console.log(`Clicked on column header at (${position.x}, ${position.y})`);
            }
        } else {
            console.log(`Clicked on cell (${position.row}, ${position.col})`);
            console.log(`Grid position: (${position.gridX}, ${position.gridY})`);
            console.log(`Cell position: (${position.cellX.toFixed(2)}, ${position.cellY.toFixed(2)})`);
        }

    }   
}