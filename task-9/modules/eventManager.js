export class EventManager
{
    constructor() 
    {
        this.eventHandlers = [];
        this.currentHandler = null;
    }

    /**
     * Register a new Handler
     * @param {Object} handler The object of handler 
     */
    RegisterHandler(handler) 
    {
        this.eventHandlers.push(handler);
    }

    /**
     * Called when the pointer up event occurs
     * @param {event} e The event object
     */
    pointerUp(e) {
        if (this.currentHandler) 
        {
            this.currentHandler.pointerUp(e, this.grid);
        }

        this.currentHandler = null;
    }

    /**
     * Pointer Down Event and Setting the current handler to execute pointer down
     * @param {Object} e The event object of pointer down
     */
    pointerDown(e) 
    {
        for (let handler of this.eventHandlers) 
        {
            if (handler.hitTest(e)) 
            {
                this.currentHandler = handler;
                break;
            }
        }
        
        if (this.currentHandler) 
        {
            this.currentHandler.pointerDown(e);
        }
    }

    /**
     * Handling the pointer move
     * @param {Object} e Event object for pointer move
     */
    pointerMove(e) 
    {
        if (this.currentHandler) 
        {
            if (this.currentHandler.pointerMove) 
            {
                this.currentHandler.pointerMove(e);
            }
        }
    }
}