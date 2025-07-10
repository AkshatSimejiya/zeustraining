export class EventManager {
    constructor(){
        this.eventHandlers = [];
        this.currentHandler = null;
    }

    RegisterHandler(handler) {
        this.eventHandlers.push(handler);
    }

    pointerUp(e) {
        if(this.currentHandler){
            this.currentHandler.pointerUp(e);
        }
        this.currentHandler = null;
    }

    pointerDown(e) {
        for(let handler of this.eventHandlers){
            if(handler.hitTest(e)){
                this.currentHandler = handler;
                break;
            }
        }

        if(this.currentHandler)
            this.currentHandler.pointerDown(e)
    }

    pointerMove(e){
        if (this.currentHandler)
			this.currentHandler.pointerMove(e);
		// else {
		// 	for (let handler in eventHandlers) {
		// 		if (handler.hitTest(e))
		// 			break;
		// 	}
		// }	
    }
}