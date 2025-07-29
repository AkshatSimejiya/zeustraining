export class Box
{
    constructor()
    {
        this.boxElement = document.createElement("div")
        this.boxElement.classList.add("box")

        this.boxX = 0;
        this.boxY = 0;

        this.setBoxPos(this.boxX, this.boxY)
    }

    getBox()
    {
        return this.boxElement
    }

    setBoxPos(x, y)
    {
        this.boxElement.style.top = `${y}px`;
        this.boxElement.style.left = `${x}px`;
    }
}