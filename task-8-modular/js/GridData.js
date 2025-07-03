export class GridData {
    constructor() {
        this.data = new Map();
    }

    get(row, col) {
        return this.data.get(`${row},${col}`);
    }

    set(row, col, value) {
        if (value.trim()) {
            this.data.set(`${row},${col}`, value.trim());
        } else {
            this.data.delete(`${row},${col}`);
        }
    }

    delete(row, col) {
        this.data.delete(`${row},${col}`);
    }
}
