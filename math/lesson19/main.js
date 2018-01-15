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
/*
context.beginPath();
context.moveTo(p0.x, p0.y);
context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
context.stroke();
*/

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
context.fillStyle = '#52BE80';//Green
context.fill();

let t = 0.01;
let pFinal = {};
context.beginPath();
context.moveTo(p0.x, p0.y);
for (let t = 0.01; t <= 1; t+=0.01) {
    pFinal = util.quadraticBezier(p0, p1, p2, t);
    context.lineTo(pFinal.x, pFinal.y);
    context.stroke();
}

/*
let t = 0.01;
let pFinal = {};
context.fillStyle = '#000000';
for (let t = 0.01; t <= 1; t+=0.01) {
    context.beginPath();
    
    pFinal = util.quadraticBezier(p0, p1, p2, t);
    context.arc(pFinal.x, pFinal.y, 10, 0, Math.PI * 2, false);
    context.fill();
}*/