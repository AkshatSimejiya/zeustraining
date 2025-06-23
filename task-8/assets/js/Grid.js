
import { Canvas } from "./Canvas.js";


export class Grid {
    constructor(container){
        this.container = container;

        this.isSelected = false;

        this.dimensions = {
            rowHeight : 24,
            colWidth : 100
        }

        this.inputField = document.createElement("input")
        this.inputField.setAttribute("type", "text");
        this.inputField.setAttribute("id", "TextInput");
        this.inputField.setAttribute("autocomplete","off");
        this.inputField.style.display = "none";
        this.inputField.value ="";
        this.inputField.style.width = `${this.dimensions.colWidth}px`
        this.inputField.style.height = `${this.dimensions.rowHeight}px`
        this.container.appendChild(this.inputField)

        
    }

    newCanvas(){
        const can1 = new Canvas(this.container, this.inputField, this.dimensions)
        const can2 = new Canvas(this.container, this.inputField, this.dimensions)
    }

    // render(){
    //     this.canvas = document.createElement("canvas");
    //     this.canvas.setAttribute("tabindex","0")
    //     this.container.appendChild(this.canvas)
    //     this.ctx = this.canvas.getContext("2d")

    //     this.canvas.width = this.cols * this.colWidth
    //     this.canvas.height = this.rows * this.rowHeight

    //     this.canvas.addEventListener('click', this.onSelect.bind(this))

    //     this.ctx.font = "18px sans-serif"
    //     this.inputField.addEventListener("keydown", this.editCell.bind(this))
    // }

    // onSelect(event){

    //     if(this.isSelected){

    //         let x = this.selectedCell.col * this.colWidth;
    //         let y = this.selectedCell.row * this.rowHeight;

    //         this.ctx.strokeStyle = "#000000"
    //         this.ctx.lineWidth = 1
    //         this.ctx.clearRect(x, y, this.colWidth, this.rowHeight);
    //         this.ctx.strokeRect(x, y, this.colWidth, this.rowHeight);
            
    //         if(this.inputField.value !== ""){
    //             this.ctx.fillText(this.inputField.value, x+5, y+18)
    //         }
    //         this.isSelected = false;

    //         this.inputField.style.display = "none";
    //     }else {
    //         let row = Math.floor(event.y / this.rowHeight);
    //         let col = Math.floor(event.x / this.colWidth);
    //         console.log(`Row = ${row} , Col = ${col}`)

    //         let y = row * this.rowHeight;
    //         let x = col * this.colWidth;
            
    //         this.ctx.strokeStyle = "#258f41"
    //         this.ctx.lineWidth = 3;
    //         this.ctx.strokeRect(x,y, this.colWidth, this.rowHeight)

    //         this.selectedCell.row = row
    //         this.selectedCell.col = col
            
    //         this.inputField.value = ""

        
    //         this.inputField.style.display = "block";

    //         this.inputField.style.top = `${y}px`;
    //         this.inputField.style.left = `${x}px`;
        
    //         this.inputField.focus()


    //         this.isSelected = true
    //     }
    // }

    // editCell(event) {
    //     if(this.isSelected){
            
    //         let x = this.selectedCell.col * this.colWidth;
    //         let y = this.selectedCell.row * this.rowHeight;


    //         if(event.key === "Enter" || event.key === "Escape"){

    //             this.ctx.strokeStyle = "#000000"
    //             this.ctx.lineWidth = 1
    //             this.ctx.clearRect(x, y, this.colWidth, this.rowHeight);
    //             this.ctx.strokeRect(x, y, this.colWidth, this.rowHeight);
                
    //             if(this.inputField.value !== ""){
    //                 this.ctx.fillText(this.inputField.value, x+5, y+18)
    //             }
    //             this.isSelected = false;

    //             this.inputField.blur()

    //             this.inputField.style.display = "none";
    //         }
    //     }

    //     console.log(event)
    // }

    // fillCanvas(){
    //     for (let row = 0; row < this.rows; row++) {        
    //         for (let col = 0; col < this.cols; col++) {
    //             const x = col * this.colWidth;
    //             const y = row * this.rowHeight;
    //             this.ctx.strokeRect(x, y, this.colWidth, this.rowHeight);
    //         }
    //     }
    // }
}