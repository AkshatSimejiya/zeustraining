import {Box} from "./box.js"
import { EventManager } from "./eventManager.js"
import { BoxDrag } from "./boxDrag.js"

export class Controller
{
    constructor(mainContainer)
    {
        this.mainContainer = mainContainer
        this.Box = new Box()
        console.log(mainContainer)

        this.init()

        this.eventManager = new EventManager()

        this.registerHandlers()
    }

    addBox()
    {
        const newBox = document.createElement("div")
        newBox.setAttribute("class", "box-container")

        this.mainContainer.append(newBox)
    }

    init()
    {
        document.body.appendChild(this.Box.getBox())   

        document.addEventListener("pointerdown", (e)=> {this.eventManager.pointerDown(e)})
        document.addEventListener("pointermove", (e)=> {this.eventManager.pointerMove(e)})
        document.addEventListener("pointerup", (e)=> {this.eventManager.pointerUp(e)})
    }

    registerHandlers()
    {
        this.eventManager.RegisterHandler(new BoxDrag());
    }
}
