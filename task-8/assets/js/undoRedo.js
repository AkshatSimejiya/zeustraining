class UndoRedo {
  constructor(data) {
    this.stack = [];
    this.index = -1;
    this.data = data;
  }

  push(change) {
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push(change);
    this.index++;
  }

  undo() {
    if (this.index < 0) return;
    const change = this.stack[this.index--];
    this.data.set(change.row, change.col, change.oldVal);
  }

  redo() {
    if (this.index + 1 >= this.stack.length) return;
    const change = this.stack[++this.index];
    this.data.set(change.row, change.col, change.newVal);
  }
}
