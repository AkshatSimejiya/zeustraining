import { Command } from './Command.js';

export class ResizeColumnCommand extends Command {
    
    /**
     * Initializes the ResizeColumnCommand with necessary parameters
     * @param {*} cols The columns object that manages column widths
     * @param {*} colIndex The index of the column to resize
     * @param {*} oldWidth The previous width of the column
     * @param {*} newWidth The new width to set for the column
     */
    constructor(cols, colIndex, oldWidth, newWidth) {
        super();
        this.cols = cols;
        this.colIndex = colIndex;
        this.oldWidth = oldWidth;
        this.newWidth = newWidth;
    }

    /**
     * Executes the command to resize the column
     */
    execute() {
        this.cols.setColumnWidth(this.colIndex, this.newWidth);
    }

    /**
     * Undoes the resize operation by resetting the column width to its old value
     */
    undo() {
        this.cols.setColumnWidth(this.colIndex, this.oldWidth);
    }
}
