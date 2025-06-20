

export class Grid {
    constructor(container){
        this.container = container;
        this.rowHeight = 24;
        this.colWidth = 100;
        this.rows = Math.floor(this.container.clientHeight / this.rowHeight)
        this.cols = Math.floor(this.container.clientWidth / this.colWidth)

        this.isSelected = false;

        this.inputField = document.createElement("input")
        this.inputField.setAttribute("type", "text");
        this.inputField.setAttribute("id", "TextInput");
        this.inputField.setAttribute("hidden","true");
        document.body.appendChild(this.inputField)

        this.selectedCell={
            row : 0,
            col : 0,
        }
    }

    render(){
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("tabindex","0")
        this.container.appendChild(this.canvas)
        this.ctx = this.canvas.getContext("2d")

        this.canvas.width = this.cols * this.colWidth
        this.canvas.height = this.rows * this.rowHeight

        this.canvas.addEventListener('click', this.onSelect.bind(this))

        this.canvas.addEventListener("keydown", this.editCell.bind(this))
    }

    onSelect(event){

        if(this.isSelected){
            this.ctx.strokeStyle = "#000000"
            this.ctx.lineWidth = 1
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.fillCanvas()

            this.isSelected = false;
        }else {
            let row = Math.floor(event.y / this.rowHeight);
            let col = Math.floor(event.x / this.colWidth);
            console.log(`Row = ${row} , Col = ${col}`)

            let y = row * this.rowHeight;
            let x = col * this.colWidth;
            
            this.ctx.strokeStyle = "#258f41"
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x,y, this.colWidth, this.rowHeight)

            this.selectedCell.row = row
            this.selectedCell.col = col
            
            this.isSelected = true
        }
    }

    editCell(event) {
        if(this.isSelected){
            let x = this.selectedCell.col * this.colWidth;
            let y = this.selectedCell.row * this.rowHeight;

            this.ctx.fillText(event.key, x+5, y+5)
        }

        console.log(event)
    }

    fillCanvas(){
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * this.colWidth;
                const y = row * this.rowHeight;
                this.ctx.strokeRect(x, y, this.colWidth, this.rowHeight);
                this.ctx.fillText(`${row} ${col}`, x + 5, y + 18); // Render text inside the cell
            }
        }
    }
}