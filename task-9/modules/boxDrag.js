export class BoxDrag {
    constructor() {
        console.log("Box Drag Handler");

        this.initialDragX = 0;
        this.initialDragY = 0;

        this.offsetX = 0;
        this.offsetY = 0;

        this.box = document.querySelector(".box");
        const rect = this.box.getBoundingClientRect();
        this.lastValidPos = { x: rect.left, y: rect.top };

        this.isDragging = false;
    }

    hitTest(e) {
        const rect = this.box.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        return x <= 60 && y <= 60;
    }

    pointerDown(e) {
        console.log("Pointer Down");

        this.isDragging = true;

        const rect = this.box.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;

        // Save last known valid position
        this.lastValidPos = {
            x: rect.left,
            y: rect.top,
        };
    }

    pointerMove(e) {
        if (!this.isDragging) return;

        const x = e.clientX - this.offsetX;
        const y = e.clientY - this.offsetY;

        this.box.style.position = "absolute";
        this.box.style.left = `${x}px`;
        this.box.style.top = `${y}px`;
    }

    pointerUp(e) {
        console.log("Pointer Up");
        this.isDragging = false;

        const boxRect = this.box.getBoundingClientRect();
        const containers = document.querySelectorAll(".box-container");

        let droppedInBox = false;

        containers.forEach(container => {
            const rect = container.getBoundingClientRect();
            if (
                boxRect.left >= rect.left &&
                boxRect.right <= rect.right &&
                boxRect.top >= rect.top &&
                boxRect.bottom <= rect.bottom
            ) 
            {
                droppedInBox = true;
            }
        });

        if (!droppedInBox) {
            this.box.style.left = `${this.lastValidPos.x}px`;
            this.box.style.top = `${this.lastValidPos.y}px`;
        } else {
            this.lastValidPos = {
                x: boxRect.left,
                y: boxRect.top,
            };
        }
    }
}
