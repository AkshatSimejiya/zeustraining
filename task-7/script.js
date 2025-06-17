class DraggableChild {
  constructor(parent, color) {
    this.parent = parent;
    this.element = document.createElement('div');
    this.element.className = 'childDiv';
    this.element.style.width = `50px`
    this.element.style.height = `50px`
    this.element.style.backgroundColor = color;
   
   
    this.left = 0;
    this.top = 0;

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.xPercent = 0;
    this.yPercent = 0;

    this.element.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.element.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.element.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.element.addEventListener('pointercancel', this.onPointerCancel.bind(this));

    parent.element.appendChild(this.element);
  }

  updateRelativePosition() {
    const maxX = this.parent.element.clientWidth - this.element.clientWidth;
    const maxY = this.parent.element.clientHeight - this.element.clientHeight;

    this.xPercent = this.left / maxX;
    this.yPercent = this.top / maxY;
     
  }

  
  applyRelativePosition() {
    const maxX = this.parent.element.clientWidth - this.element.clientWidth;
    const maxY = this.parent.element.clientHeight - this.element.clientHeight;

    this.left = this.xPercent * maxX;
    this.top = this.yPercent * maxY;

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  onPointerDown(event) {
    console.log(event)
    this.isDragging = true;
    this.startX = event.clientX - this.left;
    this.startY = event.clientY - this.top;
    this.element.setPointerCapture(event.pointerId);
    this.element.style.cursor = "grabbing";
  }

  onPointerMove(event) {
    if (!this.isDragging) return;

    const maxX = this.parent.element.clientWidth - this.element.clientWidth;
    const maxY = this.parent.element.clientHeight - this.element.clientHeight;

    let newX = event.clientX - this.startX;
    let newY = event.clientY - this.startY;

    newX = Math.min(Math.max(0, newX), maxX);
    newY = Math.min(Math.max(0, newY), maxY);

    this.left = newX;
    this.top = newY;

    this.updatePosition();
    this.updateRelativePosition();
  }

  onPointerUp() {
    this.isDragging = false;
    this.element.style.cursor = "grab";
  }

  onPointerCancel() {
    this.isDragging = false;
    this.element.style.cursor = "grab";
  }
}

class BackgroundContainer {
  constructor(width, height) {
    this.element = document.createElement('div');
    this.element.className = 'bgDiv';
    this.element.style.width = `${width}%`
    this.element.style.height = `${height}%`

    // this.child = new DraggableChild(this);

    this.child = new DraggableChild(this, '#473d9e');
    
    // Update child position on resize
    window.addEventListener('resize', () => {
      this.child.applyRelativePosition();
    });
  }
}

const container = new BackgroundContainer(100, 100);
const container2 = new BackgroundContainer(100, 100);
const container3 = new BackgroundContainer(100, 100);
const container4 = new BackgroundContainer(100, 100);

const mainDv = document.createElement("div");
mainDv.setAttribute("class", "mainContainer")
document.body.insertBefore(mainDv, document.body.firstChild);

mainDv.appendChild(container.element)
mainDv.appendChild(container2.element)
mainDv.appendChild(container3.element)
mainDv.appendChild(container4.element)