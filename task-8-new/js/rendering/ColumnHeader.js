
import { MainEngine } from "./MainEngine.js";

export class ColumnHeader extends MainEngine {
    constructor(gridContainer, default_row_height=25, default_col_width=100, colInstance) {
        super(gridContainer,colInstance);

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
        this.canvas.setAttribute("id","columnheaderCanvas");
        this.ctx = this.canvas.getContext("2d")
        this.ctx.translate(0.5,0.5)

        this.setViewportSize();

        this.gridContainer.appendChild(this.canvas);

        this.renderer();
    }

    renderer(scrollX=0, scrollY=0, rowStart=0, colStart=0){
        const dpr = window.devicePixelRatio || 1;


        this.ctxC = this.canvas.getContext("2d")
        this.canvas.width = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.canvas.height = (this.default_row_height)  * dpr;
        this.canvas.style.width = (this.gridContainer.clientWidth - this.row_header_width)+ "px";
        this.canvas.style.height = this.default_row_height + "px";
        this.canvas.style.top =  "0px";
        this.canvas.style.left = this.row_header_width +"px";
        this.ctx.scale(dpr, dpr);

        this.renderCanvas(this.ctx, scrollX, scrollY, rowStart, colStart);

    }

    renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0,colStart=0){

        this.setViewportSize();
        ctx.clearRect(0, 0, this.row_header_width, this.viewPortHeight);
        
        ctx.lineWidth = 1  / window.devicePixelRatio;
        ctx.font = "12px Arial"
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#F5F5F5";
        ctx.textBaseline = "middle";
        ctx.fillRect(0, 0, this.viewPortWidth, this.default_row_height);

        let currentX = -scrollX;
        let colIndex = colStart;
        
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.moveTo(0, this.default_row_height-0.5);
        ctx.lineTo(this.viewPortWidth, this.default_row_height-0.5);
        while (currentX < this.viewPortWidth && colIndex < colStart + 1000) {
            const colWidth = this.cols.getColumnWidth(colIndex);
            
            if (currentX + colWidth >= 0) {
                
                const label = this.columnLabel(colIndex);
                ctx.fillText(label, currentX + colWidth / 2, this.default_row_height / 2);
                
                ctx.moveTo(currentX + colWidth + 0.5, 0);
                ctx.lineTo(currentX + colWidth + 0.5, this.default_row_height);
            }
            
            currentX += colWidth;
            colIndex++;
        }
        
        ctx.stroke();
        ctx.closePath();
    }

    columnLabel(index) {
        let label = "";
        while (index >= 0) {
            label = String.fromCharCode((index % 26) + 65) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    }   
}