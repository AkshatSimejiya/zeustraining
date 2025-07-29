import { Controller } from "./modules/controller.js"

console.log("Hello World")

const mainContainer = document.getElementById("main-container")

const controller = new Controller(mainContainer)

controller.addBox()
controller.addBox()
controller.addBox()
controller.addBox()