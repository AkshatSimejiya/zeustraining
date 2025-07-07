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
        this.viewport.setDatastore(this.DataStore);
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

        window.addEventListener('mousedown', (e) => {
            this.viewport.handleMouseDown(e);
        });

        window.addEventListener('mousemove', (e) => {
            this.viewport.handleMouseMove(e);
        });

        window.addEventListener('mouseup', (e) => {
            this.viewport.handleMouseUp(e);
        });

        window.addEventListener('keydown', (e) => {
            this.viewport.handleKeyDown(e);
        });
    
        this.gridContainer.addEventListener('dblclick', (e) => {
            this.viewport.handleDoubleClick(e);
        });


        this.viewport.setCallback('onCellValueChange', (data) => {
            const { row, col, value } = data;
            
            this.DataStore.setCellValue(row, col, value);
            
            this.viewport.updateRenderer();

        });

        this.DataStore.setCellValue(0, 0, 'Hello');
        this.DataStore.setCellValue(0, 1, 'World');
        this.DataStore.setCellValue(1, 0, '123');
        this.DataStore.setCellValue(1, 1, '456');

        

        
        this.viewport.updateRenderer();
        this.setupExampleRowHeights();

    }

    setupExampleRowHeights() {
        this.rows.setRowHeight(2, 50);
        this.rows.setRowHeight(5, 75);
        this.rows.setRowHeight(8, 100);

        this.cols.setColumnWidth(2, 150);
        this.cols.setColumnWidth(5, 200);

        this.viewport.updateRenderer();
    }

    updateScroll(e){
        this.viewport.updateScroll(e);
    }

    updateViewPort(e){
        this.viewport.updateRenderer();
    }
}