
import { MainEngine } from "./MainEngine.js";

export class CornerCanvas extends MainEngine {
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
        this.canvas.setAttribute("id","cornerCanvas");
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
        this.canvas.height = this.default_row_height * dpr;
        this.canvas.style.width = this.row_header_width + "px";
        this.canvas.style.height = this.default_row_height + "px";
        this.canvas.style.top = "0px";
        this.canvas.style.left = "0px";
        this.ctx.scale(dpr, dpr);

        this.renderCanvas(this.ctx, scrollX, scrollY, rowStart, colStart);
    }

    renderCanvas(ctx, scrollX=0, scrollY=0, rowStart=0){

        this.setViewportSize();

        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, 0, this.row_header_width, this.default_row_height);

        ctx.lineWidth = 5 / window.devicePixelRatio;
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "#d0d0d0";
        ctx.moveTo(this.row_header_width-0.5, 0);
        ctx.lineTo(this.row_header_width-0.5, this.default_row_height);

        ctx.moveTo(0, this.default_row_height-0.5);
        ctx.lineTo(this.row_header_width-0.5, this.default_row_height-0.5);
        ctx.stroke();

        // ▼ Draw the triangle
        const size = 10;
        const gap = 3.5;
        ctx.fillStyle = "#b0b0b0"; // triangle fill color
        ctx.beginPath();
        ctx.moveTo(this.row_header_width - gap, this.default_row_height - gap);                    // Bottom right
        ctx.lineTo(this.row_header_width - size - gap, this.default_row_height - gap);            // Bottom left of triangle
        ctx.lineTo(this.row_header_width - gap, this.default_row_height - size - gap);            // Top right of triangle
        ctx.closePath();
        ctx.fill()

        
        ctx.closePath();
    }

}