export class CommandManager {

    /**
     * Initializes the CommandManager with empty undo and redo stacks
     */
    constructor() {
        /**
         * Stack to keep track of executed commands for undo functionality
         * @type {Array<Command>}
         */
        this.undoStack = [];
        
        /**
         * Stack to keep track of undone commands for redo functionality
         * @type {Array<Command>}
         */
        this.redoStack = [];
    }

    /**
     * Executes a command and updates the undo and redo stacks
     * @param {Command} command 
     */
    execute(command) {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = [];
    }

    /**
     * Undoes the last executed command if available
     * and moves it to the redo stack
     */
    undo() {
        if (this.undoStack.length > 0) {
            const command = this.undoStack.pop();
            command.undo();
            this.redoStack.push(command);
        }
    }

    /**
     * Redoes the last undone command if available
     * and moves it back to the undo stack
     */
    redo() {
        if (this.redoStack.length > 0) {
            const command = this.redoStack.pop();
            command.execute();
            this.undoStack.push(command);
        }
    }
}
