class Grid {
  constructor(container, cols = 100, rows = 100) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.cellWidth = 100;
    this.cellHeight = 25;

    this.cols = cols;
    this.rows = rows;

    this.data = new Data(cols, rows);
    this.selection = new Selection();
    this.undoRedo = new UndoRedo(this.data);

    this.initCanvas();
    this.bindEvents();
    this.render();
  }

  initCanvas() {
    this.canvas.width = this.cols * this.cellWidth;
    this.canvas.height = this.rows * this.cellHeight;

    this.canvas.style.width = `${this.canvas.width}px`;
    this.canvas.style.height = `${this.canvas.height}px`;

    this.container.appendChild(this.canvas);
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.selection.start(e, this));
    this.canvas.addEventListener('mouseup', (e) => this.selection.end(e, this));
    this.canvas.addEventListener('dblclick', (e) => this.editCell(e));
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.font = "14px sans-serif";
    ctx.textBaseline = "middle";

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = c * this.cellWidth;
        const y = r * this.cellHeight;
        const value = this.data.get(r, c);
        ctx.strokeStyle = "#ccc";
        ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);
        ctx.fillStyle = "#000";
        ctx.fillText(value, x + 4, y + this.cellHeight / 2);
      }
    }

    this.selection.draw(ctx, this.cellWidth, this.cellHeight);
  }

  editCell(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left + this.container.scrollLeft;
    const y = e.clientY - rect.top + this.container.scrollTop;

    const col = Math.floor(x / this.cellWidth);
    const row = Math.floor(y / this.cellHeight);
    const oldVal = this.data.get(row, col);

    const input = document.createElement("input");
    input.type = "text";
    input.value = oldVal;
    input.style.position = "absolute";
    input.style.left = `${col * this.cellWidth}px`;
    input.style.top = `${row * this.cellHeight}px`;
    input.style.width = `${this.cellWidth}px`;
    input.style.height = `${this.cellHeight}px`;

    this.container.appendChild(input);
    input.focus();

    input.addEventListener("blur", () => {
      this.data.set(row, col, input.value);
      this.undoRedo.push({ row, col, oldVal, newVal: input.value });
      this.container.removeChild(input);
      this.render();
    });
  }
}
