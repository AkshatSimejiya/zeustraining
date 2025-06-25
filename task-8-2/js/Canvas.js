
// Class Canvas which will handle the rendering of Canvas on screen 

export class Canvas {

    /**
     * Initialize Canvas object
     * @param {HTML Element} gridContainer Grid Container which will be the outer div 
     * @param {number} colWidth Default column width 
     * @param {number} rowHeight Default row height 
    */
    constructor(gridContainer, colWidth, rowHeight) {

        /**@type {HTML Element} Stores the gridContainer to use inside the object */
        this.gridContainer = gridContainer;
        this.default_col_width = colWidth;
        this.default_row_height = rowHeight;

        this.header_width = 50;
        this.header_height = rowHeight;

        this.tileWidth = 1000;
        this.tileHeight = 1000; 

        this.dataCanvases = [];
        this.rowHeaderCanvases = [];
        this.colHeaderCanvases = [];

        this.init();
    }

    /**
     * Initialize the canvas for sheet, rows and column headers etc. And setting other properties 
     */
    init() {
        this.gridContainer.style.position = "relative";
        this.gridContainer.style.overflow = "scroll";

        this.gridContainer.addEventListener("scroll", (e) => {
            setTimeout(()=>this.addNew(e), 500)  
        });
        
            
        this.renderer();

        window.addEventListener("resize",()=>{
            this.renderer();
        })

    }

    /**
     * Function to re-render the canvas when scrolled
     * @param {event} e event object which will be passed to the method
     */
    addNew(e) {
        this.renderer();
    }

    /**
     * Render method to render the canvas on events such as initial load, scroll
     */
    renderer() {
        const scrollTop = this.gridContainer.scrollTop;
        const scrollLeft = this.gridContainer.scrollLeft;
        const visibleWidth = this.gridContainer.clientWidth;
        const visibleHeight = this.gridContainer.clientHeight;

        const rightEdge = scrollLeft + visibleWidth;
        const bottomEdge = scrollTop + visibleHeight;

        const requiredCols = Math.ceil((rightEdge - this.header_width) / this.tileWidth);
        const requiredRows = Math.ceil((bottomEdge - this.header_height) / this.tileHeight);

        this.renderDataCanvases(requiredRows, requiredCols);
        this.renderRowHeaderCanvases(requiredRows);
        this.renderColHeaderCanvases(requiredCols);
    }

    /**
     * method to add/render new canvas for data
     * @param {number} requiredRows the number of required rows computed by renderer method
     * @param {number} requiredCols the number of reuired columns 
     */
    renderDataCanvases(requiredRows, requiredCols) {
        for (let r = 0; r <= requiredRows; r++) {
            if (!this.dataCanvases[r]) this.dataCanvases[r] = [];
            for (let c = 0; c <= requiredCols; c++) {
                if (!this.dataCanvases[r][c]) {
                    const canvas = document.createElement("canvas");
                    const dpr = window.devicePixelRatio || 1;
                    canvas.width = this.tileWidth * dpr;
                    canvas.height = this.tileHeight * dpr;
                    canvas.style.width = this.tileWidth + "px";
                    canvas.style.height = this.tileHeight + "px";

                    canvas.style.position = "absolute";
                    canvas.style.left = (c * this.tileWidth + this.header_width) + "px";
                    canvas.style.top = (r * this.tileHeight + this.header_height) + "px";

                    const ctx = canvas.getContext("2d");
                    ctx.scale(dpr, dpr);

                    this.gridContainer.appendChild(canvas);
                    this.dataCanvases[r][c] = { canvas, ctx };

                    this.renderDataTile(ctx);

                    canvas.addEventListener("click",(e)=>{
                        this.addSelection(e)
                    })
                }
            }
        }
    }

    /**
     * Function to add new canvas for row headeres
     * @param {*} requiredRows the number of required rows  
     */
    renderRowHeaderCanvases(requiredRows) {
        for (let r = 0; r <= requiredRows; r++) {
            if (this.rowHeaderCanvases[r]) continue;

            const canvas = document.createElement("canvas");
            canvas.setAttribute("class", "row_header")
            const dpr = window.devicePixelRatio || 1;
            canvas.width = this.header_width * dpr;
            canvas.height = this.tileHeight * dpr;
            canvas.style.width = this.header_width + "px";
            canvas.style.height = this.tileHeight + "px";

            canvas.style.position = "absolute";
            canvas.style.left = "0px";
            canvas.style.top = (r * this.tileHeight + this.header_height) + "px";

            const ctx = canvas.getContext("2d");
            ctx.scale(dpr, dpr);

            this.gridContainer.appendChild(canvas);
            this.rowHeaderCanvases[r] = { canvas, ctx };

            this.renderRowHeaderTile(ctx, r);
        }
    }

    /**
     * Render new col headers 
     * @param {number} requiredCols 
     */
    renderColHeaderCanvases(requiredCols) {
        for (let c = 0; c <= requiredCols; c++) {
            if (this.colHeaderCanvases[c]) continue;

            const canvas = document.createElement("canvas");
            canvas.setAttribute("class","column_header")
            const dpr = window.devicePixelRatio || 1;
            canvas.width = this.tileWidth * dpr;
            canvas.height = this.header_height * dpr;
            canvas.style.width = this.tileWidth + "px";
            canvas.style.height = this.header_height + "px";

            canvas.style.position = "absolute";
            canvas.style.left = (c * this.tileWidth + this.header_width) + "px";
            canvas.style.top = "0px";

            const ctx = canvas.getContext("2d");
            ctx.scale(dpr, dpr);

            this.gridContainer.appendChild(canvas);
            this.colHeaderCanvases[c] = { canvas, ctx };

            this.renderColHeaderTile(ctx, c);
        }
    }

    /**
     * Function to render the data inside of DataTile
     * @param {context} ctx the context of particular canvas to be rendered   
     */
    renderDataTile(ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, this.tileWidth, this.tileHeight);
        // ctx.lineWidth = 0.5

        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";

        ctx.strokeStyle = "#ccc";
        ctx.beginPath();
        const rows = Math.ceil(this.tileHeight / this.default_row_height);
        const cols = Math.ceil(this.tileWidth / this.default_col_width);
        for (let r = 0; r <= rows; r++) {
            const y = r * this.default_row_height;
            ctx.moveTo(0, y);
            ctx.lineTo(this.tileWidth, y);
        }
        for (let c = 0; c <= cols; c++) {
            const x = c * this.default_col_width;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.tileHeight);
        }
        ctx.stroke();
    }

    /**
     * Function to render the content for row headers
     * @param {context} ctx for the given row 
     * @param {number} tileRow the number of tile 
     */
    renderRowHeaderTile(ctx, tileRow) {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, this.header_width, this.tileHeight);

        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        const rows = Math.ceil(this.tileHeight / this.default_row_height);
        ctx.lineWidth = 0.5

        ctx.strokeStyle = "#ccc";
        ctx.beginPath();
        ctx.fillStyle = "#000";
        for (let r = 0; r <= rows ; r++) {
            const y = r * this.default_row_height;
            ctx.fillText(`${tileRow * rows + r + 1}`, 5, y + this.default_row_height / 2);
            ctx.moveTo(0, y);
            ctx.lineTo(this.header_width, y);
        }
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Render the data for Columns headers
     * @param {context} ctx Context for the column canvas
     * @param {number} tileCol the number of current column tile
     */
    renderColHeaderTile(ctx, tileCol) {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, this.tileWidth, this.header_height);
        ctx.lineWidth = 0.5
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        const cols = Math.ceil(this.tileWidth / this.default_col_width);
        for (let c = 0; c < cols; c++) {
            const x = c * this.default_col_width;
            const labelIndex = tileCol * cols + c;
            ctx.fillText(this.columnLabel(labelIndex), x + 5, this.header_height / 2);
        }

        ctx.strokeStyle = "#ccc";
        ctx.beginPath();
        ctx.fillStyle = "#000";
        for (let c = 0; c <= cols ; c++) {
            const x = c * this.default_col_width;
            const labelIndex = tileCol * cols + c;
            ctx.fillText(this.columnLabel(labelIndex), x + 5, this.header_height / 2);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.header_height);
        }
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Function that will be called when the user click on the canvas,
     * @param {event} e event object that will be passed
     */
    addSelection(e){
        console.log(e)
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
