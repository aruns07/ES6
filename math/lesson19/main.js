import {canvas, context, width, height} from '../canvas.js';
import * as util from '../util.js';

const p0 = {
    x: util.randomRange(0, width),
    y: util.randomRange(0, height)
};

const p1 = {
    x: util.randomRange(0, width),
    y: util.randomRange(0, height)
};

const p2 = {
    x: util.randomRange(0, width),
    y: util.randomRange(0, height)
};

const p3 = {
    x: util.randomRange(0, width),
    y: util.randomRange(0, height)
};

context.beginPath();
context.moveTo(p0.x, p0.y);
context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
context.stroke();