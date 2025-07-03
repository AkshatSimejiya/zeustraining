
import { MainEngine } from "./MainEngine.js";
//Row Header responsible for rendering the rows canvas

export class RowHeader extends MainEngine {
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
        this.canvas.setAttribute("id","rowheaderCanvas");
        this.ctx = this.canvas.getContext("2d")
        this.ctx.translate(0.5,0.5)

        this.setViewportSize();

        this.gridContainer.appendChild(this.canvas);

        this.renderer();
    }

    renderer(scrollX=0, scrollY=0, rowStart=0, colStart=0){
        const dpr = window.devicePixelRatio || 1;


        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = this.row_header_width * dpr;
        this.canvas.height = (this.gridContainer.clientHeight - this.default_row_height)  * dpr;
        this.canvas.style.width = this.row_header_width + "px";
        this.canvas.style.height = (this.gridContainer.clientHeight - this.default_row_height) + "px";
        this.canvas.style.top = this.default_row_height + "px";
        this.canvas.style.left = "0px";
        this.ctx.scale(dpr, dpr);

        this.renderCanvas(this.ctx, scrollX, scrollY, rowStart, colStart);
    }

    renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0){

        this.setViewportSize();

        ctx.clearRect(0, 0, this.row_header_width, this.viewPortHeight);
        
        ctx.lineWidth = 1  / window.devicePixelRatio;
        ctx.font = "12px Arial"
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, 0, this.row_header_width, this.viewPortHeight);

        let currentY = -scrollY;
        let rowIndex = rowStart;

        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.moveTo(this.row_header_width-0.5, 0);
        ctx.lineTo(this.row_header_width-0.5, this.viewPortHeight);
        while (currentY < this.viewPortHeight && rowIndex < rowStart + 1000) {
            const rowHeight = this.rows.getRowHeight(rowIndex);
            if (currentY + rowHeight >= 0) {
                const label = rowIndex + 1;
                
                ctx.fillText(label, ((this.row_header_width-5)-ctx.measureText(label).width), currentY + rowHeight / 2 + 4);
                
                ctx.moveTo(0, currentY + rowHeight + 0.5);
                ctx.lineTo(this.row_header_width, currentY + rowHeight + 0.5);
            }
            
            currentY += rowHeight;
            rowIndex++;
        }
        
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Calculate which row starts at a given absolute Y position
     * @param {number} absoluteY - Absolute Y position in the grid
     * @returns {object} - {rowStart: number, scrollY: number}
     */
    calculateRowPosition(absoluteY) {
        let cumulativeHeight = 0;
        let row = 0;
        
        while (cumulativeHeight + this.rows.getRowHeight(row) <= absoluteY) {
            cumulativeHeight += this.rows.getRowHeight(row);
            row++;
        }
        
        return {
            rowStart: row,
            scrollY: absoluteY - cumulativeHeight
        };
    }
}