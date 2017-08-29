import {canvas, context, width, height} from '../canvas.js';
import * as util from '../util.js';

const rect1 = {
    x: Math.random() * width,
    y: Math.random() * height,
    width: -200,
    height: 100
};
const point = {
    x: 100,
    y: 100
};

window.addEventListener('mousemove', (event) => {
    point.x = event.clientX;
    point.y = event.clientY;
});

const update = () => {
    context.clearRect(0, 0, width, height);

    if (util.rectPointCollision(rect1, point.x, point.y)) {
        context.fillStyle = '#f66';
    } else {
        context.fillStyle = '#999';
    }

    context.beginPath();
    context.rect(rect1.x, rect1.y, rect1.width, rect1.height);
    context.fill();

    requestAnimationFrame(update);
};

update();
