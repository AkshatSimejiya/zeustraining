export class Command {

    /**
     * Throwing error if the method is not implemented
     */
    execute() {
        throw new Error('execute() must be implemented');
    }

    /**
     * Throwing error if undo method is not implemented
     */
    undo() {
        throw new Error('undo() must be implemented');
    }
}
