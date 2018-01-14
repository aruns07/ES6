import {canvas, context, width, height} from '../canvas.js';
import * as util from '../util.js';

const p0 = {
    x: 100,
    y: 200
};

const p1 = {
    x: 200,
    y: 100
};

const p2 = {
    x: 500,
    y: 700
};

const p3 = {
    x: 900,
    y: 200
};

context.beginPath();
context.moveTo(p0.x, p0.y);
context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
context.stroke();