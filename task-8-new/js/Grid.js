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
import { CommandManager } from './commands/CommandManager.js';
import { SetCellValueCommand } from './commands/SetCellValueCommand.js';
import { ResizeRowCommand } from './commands/ResizeRowCommand.js';
import { ResizeColumnCommand } from './commands/ResizeColumnCommand.js';

export class Grid {

    /**
     * Grid constructor which initializes the grid and its controlles
     * @param {HTMLElement} gridContainer The main container for the grid
     */
    constructor(gridContainer){
        
        /**@type {object} CommandManager */
        this.commandManager = new CommandManager();
        
        this.gridContainer = gridContainer;

        this.rows = new Rows();
        this.cols = new Columns();
        this.DataStore = new DataStore();

        this.DataStore.setCellValue(0, 0, "id");
        this.DataStore.setCellValue(0, 1, "First Name");
        this.DataStore.setCellValue(0, 2, "Last Name");
        this.DataStore.setCellValue(0, 3, "Age"); 
        this.DataStore.setCellValue(0, 4, "Salary"); 

        const firstNames = ["Raj", "Amit", "Priya", "Neha", "Vikas", "Sonal", "Ravi", "Anjali", "Deepak", "Kiran"];
        const lastNames = ["Solanki", "Sharma", "Patel", "Gupta", "Singh", "Mehta", "Jain", "Verma", "Joshi", "Chopra"];
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        for (let i = 1; i < 50000; i++) {
            const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
            const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
            const age = getRandomInt(20, 60);
            const salary = getRandomInt(300000, 2000000);
            this.DataStore.setCellValue(i, 0, i ); 
            this.DataStore.setCellValue(i, 1, firstName);
            this.DataStore.setCellValue(i, 2, lastName);
            this.DataStore.setCellValue(i, 3, age);
            this.DataStore.setCellValue(i, 4, salary);
        }

        this.selectionSet = new Selection();

        this.viewport = new ViewPort(this.gridContainer, this.cols, this.rows, this.selectionSet)
        this.viewport.setDatastore(this.DataStore);
        
        this.eventmanager = new EventManager(this);

        this.registerHandlers()

        this.init()
    }

    /**
     * init method to initialize the events for handling the grid
     */
    init(){
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                this.commandManager.undo();
                this.viewport.updateRenderer();
                e.preventDefault();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                this.commandManager.redo();
                this.viewport.updateRenderer();
                e.preventDefault();
            }
        });

        this.gridContainer.addEventListener("wheel",(e)=>{
            e.preventDefault();  
            this.viewport.updateScroll(e);
        })

        window.addEventListener("resize",(e)=>{this.viewport.updateRenderer();})

        window.addEventListener('pointerdown', (e) => {this.eventmanager.pointerDown(e)});

        window.addEventListener('pointermove', (e) => {this.eventmanager.pointerMove(e)});

        window.addEventListener('pointerup', (e) => {this.eventmanager.pointerUp(e)});

        window.addEventListener('keydown', (e) => {this.viewport.handleKeyDown(e);});
    
        this.gridContainer.addEventListener('dblclick', (e) => {this.eventmanager.dblclick(e)});

        this.viewport.setCallback('onCellValueChange', (data) => {
            const { row, col, value } = data;
            const oldValue = this.DataStore.getCellValue(row, col);
            const cmd = new SetCellValueCommand(this.DataStore, row, col, oldValue, value);
            this.commandManager.execute(cmd);
            this.viewport.updateRenderer();
        });
        
        this.eventmanager.onRowResize = (rowIndex, oldHeight, newHeight) => {
            const cmd = new ResizeRowCommand(this.rows, rowIndex, oldHeight, newHeight);
            this.commandManager.execute(cmd);
        };

        this.eventmanager.onColumnResize = (colIndex, oldWidth, newWidth) => {
            const cmd = new ResizeColumnCommand(this.cols, colIndex, oldWidth, newWidth);
            this.commandManager.execute(cmd);
        };
        
        this.viewport.updateRenderer();
    }

    registerHandlers(){
        this.eventmanager.RegisterHandler(new CellSelection(this.viewport));
        this.eventmanager.RegisterHandler(new RowResizer(this.viewport));
        this.eventmanager.RegisterHandler(new RowSelection(this.viewport));
        this.eventmanager.RegisterHandler(new ColumnResizer(this.viewport));
        this.eventmanager.RegisterHandler(new ColumnSelection(this.viewport));
    }
}