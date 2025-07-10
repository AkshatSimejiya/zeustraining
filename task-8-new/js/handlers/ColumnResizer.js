export class ColumnResizer {
    constructor() {
        this.rowHeaderWidth = 30;
        this.colHeaderHeight = 25;
    }

    hitTest(e) {
        if(e.clientX > this.rowHeaderWidth && e.clientY > this.colHeaderHeight){
            return true;
        }else {
            return false;
        }
    }

    pointerDown(e) {
        console.log("This is the pointer down")
    }

    pointerUp(e){
        console.log("This should be pointer up")
    }

    pointerMove(e){
        console.log("This should be pointer move")
    }
}
