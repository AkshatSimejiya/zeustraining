export class EventManager {
    constructor() {
        this.eventHandlers = [];
        this.currentHandler = null;
        this.hoverHandler = null;
    }

    RegisterHandler(handler) {
        this.eventHandlers.push(handler);
    }

    pointerUp(e) {
        if (this.currentHandler && this.currentHandler.pointerUp) {
            this.currentHandler.pointerUp(e);
        }

        this.currentHandler = null;
    }

    pointerDown(e) {
        for (let handler of this.eventHandlers) {
            if (handler.hitTest(e)) {
                this.currentHandler = handler;
                break;
            }
        }

        if (this.currentHandler && this.currentHandler.pointerDown) {
            this.currentHandler.pointerDown(e);
        }
    }

    pointerMove(e) {
        if (this.currentHandler) {
            if (this.currentHandler.pointerMove) {
                this.currentHandler.pointerMove(e);
            }
            this.currentHandler.setCursor(e);

        } else {
            let hovered = null;

            for (let handler of this.eventHandlers) {
                if (handler.hitTest(e)) {
                    hovered = handler;
                    break;
                }
            }

            if (hovered !== this.hoverHandler) {
                this.hoverHandler = hovered;

                if (this.hoverHandler) {
                    this.hoverHandler.setCursor(e);
                }
            }
        }
    }



}
