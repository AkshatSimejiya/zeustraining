import { Grid } from "./Grid.js"


console.log("Hello World")

const container = document.getElementById("grid-container")

const grid = new Grid(container)

grid.render()

grid.fillCanvas()
