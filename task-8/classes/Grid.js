/**
 * Main grid class that handles rendering with virtualization
 */
export class Grid {
    /**
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} context 
     * @param {HTMLDivElement} container 
     */
    constructor(canvas, context, container) {
        this.canvas = canvas;
        this.ctx = context;
        this.container = container;

        /** @type {number} */
        this.defaultColWidth = 100;
        /** @type {number} */
        this.defaultRowHeight = 24;
        /** @type {number} */
        this.totalCols = 500;
        /** @type {number} */
        this.totalRows = 100000;

        // Set canvas size to full virtual area
        canvas.width = this.defaultColWidth * this.totalCols;
        canvas.height = this.defaultRowHeight * this.totalRows;

        // Initial render
        this.render();

        // Bind scroll
        this.container.addEventListener('scroll', () => {
            this.render();
        });
    }

    /**
     * Renders only the visible portion of the grid
     */
    render() {
        const scrollLeft = this.container.scrollLeft;
        const scrollTop = this.container.scrollTop;
        const viewWidth = this.container.clientWidth;
        const viewHeight = this.container.clientHeight;

        const startCol = Math.floor(scrollLeft / this.defaultColWidth);
        const endCol = Math.min(this.totalCols, startCol + Math.ceil(viewWidth / this.defaultColWidth) + 1);

        const startRow = Math.floor(scrollTop / this.defaultRowHeight);
        const endRow = Math.min(this.totalRows, startRow + Math.ceil(viewHeight / this.defaultRowHeight) + 1);

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                const x = col * this.defaultColWidth;
                const y = row * this.defaultRowHeight;

                ctx.strokeStyle = '#ccc';
                ctx.strokeRect(x, y, this.defaultColWidth, this.defaultRowHeight);

                ctx.fillStyle = '#000';
                ctx.font = '12px Arial';
                ctx.fillText(
                    `${String.fromCharCode(65 + (col % 26))}${row + 1}`,
                    x + 4,
                    y + 16
                );
            }
        }
    }
}
