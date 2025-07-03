
import { MainEngine } from "./MainEngine.js";

export class Canvas extends MainEngine {
    constructor(gridContainer, default_row_height=25, default_col_width=100, colInstance, rowsInstance) {
        super(gridContainer, colInstance, rowsInstance);

        this.viewPortWidth = 0;
        this.viewPortHeight = 0;

        this.row_header_width = 30;
        this.default_row_height = default_row_height;
        this.default_col_width = default_col_width;

        this.init()
    }

    init(){
        this.dpr = window.devicePixelRatio || 1;

        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "gridCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.translate(0.5,0.5)

        this.setViewportSize();

        this.gridContainer.appendChild(this.canvas);

        this.renderer();
    }

    renderer(scrollX=0, scrollY=0, rowStart=0, colStart=0){
        const dpr = window.devicePixelRatio || 1;


        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.canvas.height = (this.gridContainer.clientHeight - this.default_row_height) * dpr;
        this.canvas.style.width = (this.gridContainer.clientWidth - this.row_header_width) + "px";
        this.canvas.style.height = (this.gridContainer.clientHeight - this.default_row_height) + "px";
        this.canvas.style.top = this.default_row_height + "px";
        this.canvas.style.left = this.row_header_width + "px";
        this.ctx.scale(dpr, dpr);

        this.renderCanvas(this.ctx, scrollX, scrollY, rowStart, colStart);
    }

    renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0, colStart=0){

        this.setViewportSize();
        
        ctx.clearRect(0, 0, this.viewPortWidth, this.viewPortHeight);

        let visibleRows = [];
        let visibleCols = [];
        let currentY = -scrollY;
        let currentX = -scrollX;
        let rowIndex = rowStart;
        let colIndex = colStart;
        
        while (currentY < this.viewPortHeight && rowIndex < rowStart + 100) {
            const rowHeight = this.rows.getRowHeight(rowIndex);
            if (currentY + rowHeight >= 0) {
                visibleRows.push({ index: rowIndex, y: currentY, height: rowHeight });
            }
            currentY += rowHeight;
            rowIndex++;
        }
        while (currentX < this.viewPortWidth && colIndex < colStart + 100) {
            const colWidth = this.cols.getColumnWidth(colIndex);
            if (currentX + colWidth >= 0) {
                visibleCols.push({ index: colIndex, x: currentX, width: colWidth });
            }
            currentX += colWidth;
            colIndex++;
        }

        ctx.lineWidth = 1 / window.devicePixelRatio;
        ctx.font = "12px Arial";
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#000";

        ctx.beginPath();
        
        for (let row of visibleRows) {
            ctx.moveTo(0, row.y + row.height + 0.5);
            ctx.lineTo(this.viewPortWidth, row.y + row.height + 0.5);
        }
        
        for (let col of visibleCols) {
            ctx.moveTo(col.x + col.width + 0.5, 0);
            ctx.lineTo(col.x + col.width + 0.5, this.viewPortHeight);
        }
        
        ctx.stroke();
        ctx.closePath();
    }

    setSelection(position){
        this.ctx.strokeStyle = "#147E43";
        this.ctx.fillStyle = "#147E43";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(position.cellCanvasX + 0.5, position.cellCanvasY + 0.5, this.cols.getColumnWidth(position.col), this.rows.getRowHeight(position.row));
        this.ctx.fillRect((position.cellCanvasX + this.cols.getColumnWidth(position.col) + 0.5) - 4, (position.cellCanvasY + this.rows.getRowHeight(position.row) + 0.5) - 4, 8, 8);
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.strokeRect((position.cellCanvasX + this.cols.getColumnWidth(position.col) + 0.5) - 5, (position.cellCanvasY + this.rows.getRowHeight(position.row) + 0.5) - 5, 10, 10);
    }

}