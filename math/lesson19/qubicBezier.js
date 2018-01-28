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
context.arc(p0.x, p0.y, 10, 0, Math.PI * 2, false);
context.fillStyle = '#F1948A';//Red
context.fill();

context.beginPath();
context.arc(p1.x, p1.y, 10, 0, Math.PI * 2, false);
context.fillStyle = '#5DADE2';//Blue
context.fill();

context.beginPath();
context.arc(p2.x, p2.y, 10, 0, Math.PI * 2, false);
context.fillStyle = '#5DADE2';//Blue
context.fill();

context.beginPath();
context.arc(p3.x, p3.y, 10, 0, Math.PI * 2, false);
context.fillStyle = '#52BE80';//Green
context.fill();

let t = 0.01;
let pFinal = {};
context.beginPath();
context.moveTo(p0.x, p0.y);
for (let t = 0.01; t <= 1; t+=0.01) {
    pFinal = util.qubicBezier(p0, p1, p2, p3, t);
    context.lineTo(pFinal.x, pFinal.y);
    context.stroke();
}
