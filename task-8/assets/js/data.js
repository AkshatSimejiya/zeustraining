class Data {
  constructor(cols, rows) {
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(""));
  }

  get(r, c) {
    return this.grid[r]?.[c] || "";
  }

  set(r, c, val) {
    this.grid[r][c] = val;
  }

  getRange(r1, c1, r2, c2) {
    const cells = [];
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        cells.push(this.get(r, c));
      }
    }
    return cells;
  }
}
