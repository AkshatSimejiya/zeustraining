class Selection {
  constructor() {
    this.startCell = null;
    this.endCell = null;
  }

  start(e, grid) {
    const { offsetX, offsetY } = e;
    this.startCell = [
      Math.floor(offsetY / grid.cellHeight),
      Math.floor(offsetX / grid.cellWidth)
    ];
  }

  end(e, grid) {
    const { offsetX, offsetY } = e;
    this.endCell = [
      Math.floor(offsetY / grid.cellHeight),
      Math.floor(offsetX / grid.cellWidth)
    ];
    grid.render();
  }

  draw(ctx, cw, ch) {
    if (!this.startCell || !this.endCell) return;

    const [r1, c1] = this.startCell;
    const [r2, c2] = this.endCell;

    const top = Math.min(r1, r2);
    const left = Math.min(c1, c2);
    const height = (Math.abs(r2 - r1) + 1) * ch;
    const width = (Math.abs(c2 - c1) + 1) * cw;

    ctx.save();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(left * cw, top * ch, width, height);
    ctx.restore();
  }
}
