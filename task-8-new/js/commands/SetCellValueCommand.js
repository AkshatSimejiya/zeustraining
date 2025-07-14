import { Command } from './Command.js';

export class SetCellValueCommand extends Command {

    /**
     * Initializes the SetCellValueCommand with necessary parameters
     * @param {object} dataStore The data store that manages cell values
     * @param {number} row The row index of the cell to set
     * @param {number} col The column index of the cell to set
     * @param {*} oldValue The previous value of the cell
     * @param {*} newValue The new value to set for the cell
     */
    constructor(dataStore, row, col, oldValue, newValue) {
        super();
        this.dataStore = dataStore;
        this.row = row;
        this.col = col;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    /**
     * Executes the command to set the cell value
     */
    execute() {
        this.dataStore.setCellValue(this.row, this.col, this.newValue);
    }

    /**
     * Undoes the command by resetting the cell value to its old value
     */
    undo() {
        this.dataStore.setCellValue(this.row, this.col, this.oldValue);
    }
}
