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

let t = 0.01;
let pFinal = {};
const movePointOverPath = () => {
    pFinal = util.qubicBezier(p0, p1, p2, p3, t);
    context.beginPath();    
    context.arc(pFinal.x, pFinal.y, 10, 0, Math.PI * 2, false);
    context.fill();
    t+=0.01;

    if (t >= 1) {
        t = 0;
    }
};


const drawBezierCurve = () => {
    context.beginPath();
    context.moveTo(p0.x, p0.y);
    context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    context.stroke();
};

const render = () => {
    context.clearRect(0, 0, width, height);
    drawBezierCurve();
    movePointOverPath();
    requestAnimationFrame(render);
};

render();