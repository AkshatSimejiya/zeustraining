import { Command } from './Command.js';

export class ResizeRowCommand extends Command {

    /**
     * Initializes the ResizeRowCommand with necessary parameters
     * @param {object} rows The rows object that manages row heights
     * @param {number} rowIndex The index of the row to resize
     * @param {number} oldHeight The previous height of the row
     * @param {number} newHeight The new height to set for the row
     */
    constructor(rows, rowIndex, oldHeight, newHeight) {
        super();
        this.rows = rows;
        this.rowIndex = rowIndex;
        this.oldHeight = oldHeight;
        this.newHeight = newHeight;
    }

    /**
     * Executes the command to resize the row
     */
    execute() {
        this.rows.setRowHeight(this.rowIndex, this.newHeight);
    }

    /**
     * Undo the resize operation by resetting the row height to its old value
     */
    undo() {
        this.rows.setRowHeight(this.rowIndex, this.oldHeight);
    }
}
