export class Canvas {
    constructor(gridContainer, rowHeight, colWidth){
        /**@type {HTML Element} Stores the gridContainer to use inside the object */
        this.gridContainer = gridContainer;
        this.default_col_width = colWidth;
        this.default_row_height = rowHeight;

        this.row_header_width = 30;

        this.viewPortWidth = 0;
        this.viewPortHeight = 0;

        this.scrollY = 0;
        this.scrollX = 0;
        this.rowStart = 0;
        this.colStart = 0;

        this.selectedCell = null; // { row, col }

        this.cellData = new Map(); 


        this.init();
    }

    init(){
        const dpr = window.devicePixelRatio || 1;
        console.log(dpr)
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id","viewportCanvas");
        this.ctx = this.canvas.getContext("2d")
        this.ctx.translate(0.5,0.5)
        
        this.setViewportSize();

        this.cornercanvas = document.createElement("canvas");
        this.cornercanvas.setAttribute("id","cornerCanvas");
        this.ctxCr = this.cornercanvas.getContext("2d")
        this.ctxCr.translate(0.5,0.5)

        this.rowcanvas = document.createElement("canvas");
        this.rowcanvas.setAttribute("id","rowheaderCanvas");
        this.ctxR = this.rowcanvas.getContext("2d")
        
        this.columncanvas = document.createElement("canvas");
        this.columncanvas.setAttribute("id","columnheaderCanvas");
        this.ctxC = this.columncanvas.getContext("2d")
        
        this.gridContainer.appendChild(this.canvas)
        this.gridContainer.appendChild(this.rowcanvas)
        this.gridContainer.appendChild(this.columncanvas)
        this.gridContainer.appendChild(this.cornercanvas)

        this.renderer()

        window.addEventListener("resize",()=>{
            this.renderer()
        })

        this.canvas.addEventListener("dblclick",(e)=>{
            this.addSelection(e)
        })

        this.gridContainer.addEventListener("wheel", (e) => {
            e.preventDefault();
            
            this.updatedScroll(e);
        }, { passive: false });

        this.canvas.addEventListener("click", (e) => {
            this.handleCellClick(e);
        });

        window.addEventListener("keydown", (e) => {
            this.handleTyping(e);
        });

    }

    handleCellClick(e) {
        const canvasX = e.offsetX + this.scrollX;
        const canvasY = e.offsetY + this.scrollY;

        const col = Math.floor(canvasX / this.default_col_width);
        const row = Math.floor(canvasY / this.default_row_height);

        this.selectedCell = {
            row: row + this.rowStart,
            col: col + this.colStart
        };

        const input = this.gridContainer.querySelector("input.cell-editor");
        const mark = this.gridContainer.querySelector("div.mark-editor");
        if (input) input.remove();
        if (mark) mark.remove();

        const visRow = row;
        const visCol = col;
        const x = (visCol * this.default_col_width - this.scrollX) + 0.5;
        const y = (visRow * this.default_row_height - this.scrollY) + 0.5;

        const div = document.createElement("div");
        div.className = "mark-editor";
        div.style.position = "absolute";
        div.style.cursor = "crosshair";
        div.className = "mark-editor";
        div.style.top =   `${(y + this.default_row_height *2) - 8}px`
        div.style.left = `${(x + this.row_header_width + this.default_col_width) - 8}px`

        this.gridContainer.appendChild(div);
        

        this.renderer();
    }


    handleTyping(e) {
        if (!this.selectedCell || this.gridContainer.querySelector("input.cell-editor")) return;

        const { row, col } = this.selectedCell;

        const visRow = row - this.rowStart;
        const visCol = col - this.colStart;

        const x = (visCol * this.default_col_width - this.scrollX) + 0.5;
        const y = (visRow * this.default_row_height - this.scrollY) + 0.5;

        const input = document.createElement("input");
        const div = document.createElement("div");
        input.className = "cell-editor";
        div.className = "mark-editor";
        input.type = "text";
        input.value = e.key.length === 1 ? e.key : "";

        input.style.position = "absolute";
        div.style.position = "absolute";
        input.style.top = `${y + this.default_row_height}px`;
        input.style.left = `${x + this.row_header_width}px`;
        div.style.top =   `${(y + this.default_row_height *2) - 8}px`
        div.style.left = `${(x + this.row_header_width + this.default_col_width) - 8}px`
        input.style.width = `${this.default_col_width - 5}px`;
        input.style.height = `${this.default_row_height - 5}px`;
        input.style.padding = "2px";
        input.style.border = "1px solid #147E43";
        input.style.outline = "1px solid #147E43";
        input.style.font = "12px Arial";

        this.gridContainer.appendChild(input);
        this.gridContainer.appendChild(div);

        input.focus();

        input.addEventListener("blur", () => {
            const key = `${row + this.rowStart},${col + this.colStart}`;
            const value = input.value.trim();
            if (value) {
                this.cellData.set(key, value);
            } else {
                this.cellData.delete(key);
            }
            input.remove();
            div.remove();
            this.renderer();
        });

        input.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                input.blur();
            }
        });
    }



    addSelection(e) {
        const canvasX = e.offsetX + this.scrollX;
        const canvasY = e.offsetY + this.scrollY;

        const col = Math.floor(canvasX / this.default_col_width);
        const row = Math.floor(canvasY / this.default_row_height);

        const x = (col * this.default_col_width - this.scrollX) + 0.5;
        const y = (row * this.default_row_height - this.scrollY) + 0.5;

        const existingInput = this.gridContainer.querySelector("input.cell-editor");
        const existingDiv = this.gridContainer.querySelector("input.mark-editor");
        if (existingInput) {
            existingInput.remove();
            existingDiv.remove();
        }

        console.log(x)
        console.log(y)

        const input = document.createElement("input");
        const div = document.createElement("div");
        input.classList.add("cell-editor");
        div.classList.add("mark-editor");
        input.type = "text";
        input.value = this.cellData.get(`${row + this.rowStart},${col + this.colStart}`) || "";
        
        input.style.position = "absolute";
        div.style.position = "absolute";
        input.style.top = `${y + this.default_row_height}px`;
        input.style.left = `${x + this.row_header_width}px`;
        div.style.top =   `${(y + this.default_row_height *2) - 8}px`
        div.style.left = `${(x + this.row_header_width + this.default_col_width) - 8}px`
        input.style.width = `${this.default_col_width - 5}px`;
        input.style.height = `${this.default_row_height - 5}px`;
        input.style.padding = "2px";
        input.style.padding = "2px";
        input.style.border = "1px solid #147E43";
        input.style.outline = "1px solid #147E43";
        input.classList.add("overlayinput");
        input.setAttribute("id","overlayinput")
        input.setAttribute("name","Input Box")
        input.style.font = "12px Arial";

        this.gridContainer.appendChild(input);
        this.gridContainer.appendChild(div);

        input.focus();
        
        input.addEventListener("blur", () => {
            const key = `${row + this.rowStart},${col + this.colStart}`;
            const value = input.value.trim();
            if (value) {
                this.cellData.set(key, value);
            } else {
                this.cellData.delete(key);
            }
            input.remove();
            div.remove();
            this.renderer();
        });

        input.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                input.blur();
            }
        });
    }




    updatedScroll(e){
        const delta = e.deltaY;


        if (e.shiftKey) {
            let adjustedDelta = delta * 0.2;
            this.scrollX += adjustedDelta;

            while (this.scrollX >= this.default_col_width) {
                this.scrollX -= this.default_col_width;
                this.colStart++;
            }

            while (this.scrollX <= -this.default_col_width) {
                if (this.colStart > 0) {
                    this.scrollX += this.default_col_width;
                    this.colStart--;
                } else {
                    this.scrollX = 0;
                    break;
                }
            }

            if (this.colStart === 0 && this.scrollX < 0) {
                this.scrollX = 0;
            }
        } else {
            this.scrollY += delta;

            while (this.scrollY >= this.default_row_height) {
                this.scrollY -= this.default_row_height;
                this.rowStart++;
            }

            while (this.scrollY <= -this.default_row_height) {
                if (this.rowStart > 0) {
                    this.scrollY += this.default_row_height;
                    this.rowStart--;
                } else {
                    this.scrollY = 0;
                    break;
                }
            }
        }

        if(document.querySelector('.mark-editor')){
           document.querySelector('.mark-editor').remove(); 
        }

        this.renderer();

    }


    renderer(){
        const dpr = window.devicePixelRatio || 1;
        
        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.canvas.height = (this.gridContainer.clientHeight - this.default_row_height) * dpr;
        this.canvas.style.width = (this.gridContainer.clientWidth - this.row_header_width) + "px";
        this.canvas.style.height = (this.gridContainer.clientHeight - this.default_row_height) + "px";
        this.canvas.style.top = this.default_row_height + "px";
        this.canvas.style.left = this.row_header_width + "px";
        this.ctx.scale(dpr, dpr);
        
        
        this.ctxCr = this.cornercanvas.getContext("2d")
        this.cornercanvas.width = this.row_header_width * dpr;
        this.cornercanvas.height = this.default_row_height * dpr;
        this.cornercanvas.style.width = this.row_header_width + "px";
        this.cornercanvas.style.height = this.default_row_height + "px";
        this.cornercanvas.style.top = "0px";
        this.cornercanvas.style.left = "0px";
        this.ctxCr.scale(dpr, dpr);
        
        this.ctxR = this.rowcanvas.getContext("2d")
        this.rowcanvas.width = this.row_header_width * dpr;
        this.rowcanvas.height = (this.gridContainer.clientHeight - this.default_row_height)  * dpr;
        this.rowcanvas.style.width = this.row_header_width + "px";
        this.rowcanvas.style.height = (this.gridContainer.clientHeight - this.default_row_height) + "px";
        this.rowcanvas.style.top = this.default_row_height + "px";
        this.rowcanvas.style.left = "0px";
        this.ctxR.scale(dpr, dpr);
        
        this.ctxC = this.columncanvas.getContext("2d")
        this.columncanvas.width = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.columncanvas.height = (this.default_row_height)  * dpr;
        this.columncanvas.style.width = (this.gridContainer.clientWidth - this.row_header_width)+ "px";
        this.columncanvas.style.height = this.default_row_height + "px";
        this.columncanvas.style.top =  "0px";
        this.columncanvas.style.left = this.row_header_width +"px";
        this.ctxC.scale(dpr, dpr);
        
        this.setViewportSize();

        this.renderCanvas(this.ctx)
        this.renderRows(this.ctxR)
        this.renderColumns(this.ctxC)
        this.renderCorner(this.ctxCr)
    }

    setViewportSize(){

        const dpr = window.devicePixelRatio || 1;

        this.viewPortWidth = (this.gridContainer.clientWidth - this.row_header_width) * dpr;
        this.viewPortHeight = (this.gridContainer.clientHeight - this.default_row_height) * dpr;

    }

    renderCanvas(ctx){
        const rows = Math.ceil(this.viewPortHeight / this.default_row_height) + 1;
        const cols = Math.ceil(this.viewPortWidth / this.default_col_width) + 1;

        ctx.lineWidth = 1;
        ctx.font = "12px Arial";
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#000";

        ctx.beginPath();
        for(let r = 0; r <= rows; r++){
            const y = r * this.default_row_height - this.scrollY;
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(this.viewPortWidth, y + 0.5);
        }
        for(let c = 0; c <= cols; c++){
            const x = c * this.default_col_width - this.scrollX;
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, this.viewPortHeight);
        }
        ctx.stroke();
        ctx.closePath();

        // Draw stored cell text
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const rowIdx = this.rowStart + r;
                const colIdx = this.colStart + c;
                const key = `${rowIdx},${colIdx}`;
                const value = this.cellData.get(key);
                if (value) {
                    const x = c * this.default_col_width - this.scrollX + 5;
                    const y = r * this.default_row_height - this.scrollY + this.default_row_height / 2 + 4;
                    ctx.fillText(value, x, y);
                }
            }
        }

        // Draw selection border
        if (this.selectedCell) {
            const { row, col } = this.selectedCell;
            const visRow = row - this.rowStart;
            const visCol = col - this.colStart;

            if (visRow >= 0 && visCol >= 0) {
                const x = visCol * this.default_col_width - this.scrollX + 0.5;
                const y = visRow * this.default_row_height - this.scrollY + 0.5;
                ctx.strokeStyle = "#147E43";
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, this.default_col_width, this.default_row_height);
            }
        }

    }


    renderRows(ctx){
        const rows = Math.ceil(this.viewPortHeight / this.default_row_height) + 1

        ctx.lineWidth = 1;
        ctx.font = "12px Arial"
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0,0, this.row_header_width, this.viewPortHeight)

        ctx.beginPath();
        ctx.fillStyle = "#000";
        for(let r = 0; r <= rows; r++){
            const y = r * this.default_row_height - this.scrollY;
            const label = this.rowStart + r + 1;
            ctx.fillText(label, 5, y + 5 + this.default_row_height / 2);
            ctx.moveTo(0, y+0.5);
            ctx.lineTo(this.viewPortWidth, y+0.5)
        }
        ctx.stroke();
        ctx.closePath();
    }

    renderColumns(ctx){
        const cols = Math.ceil(this.viewPortWidth / this.default_col_width) + 1;
        ctx.lineWidth = 1;
        ctx.font = "12px Arial"
        ctx.strokeStyle = "#d0d0d0";
        ctx.fillStyle = "#F5F5F5";
        ctx.textBaseline = "middle";
        ctx.fillRect(0, 0, this.viewPortWidth, this.default_row_height);

        ctx.beginPath();
        ctx.fillStyle = "#000";
        for(let c = 0; c <= cols; c++){
            const x = c * this.default_col_width - this.scrollX;
            const labelIndex = this.colStart + c;
            ctx.fillText(this.columnLabel(labelIndex), x + this.default_col_width / 2 , this.default_row_height / 2);
            ctx.moveTo(x+0.5, 0);
            ctx.lineTo(x+0.5, this.default_row_height)
        }
        ctx.stroke();
        ctx.closePath();

    }

    renderCorner(ctx){
        ctx.fillStyle = "#F5F5F5";
        ctx.fillRect(0, 0, this.row_header_width, this.default_row_height)
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