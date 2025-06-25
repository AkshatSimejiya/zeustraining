import { Grid } from './classes/Grid.js';

const canvas = document.getElementById('gridCanvas');
const container = document.getElementById('gridContainer');
const context = canvas.getContext('2d');

const grid = new Grid(canvas, context, container);
