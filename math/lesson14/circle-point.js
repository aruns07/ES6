import {canvas, context, width, height} from '../canvas.js';
import * as util from '../util.js';

const circle1 = {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 30
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

    if (util.circlePointCollision(circle1, point.x, point.y)) {
        context.fillStyle = '#f66';
    } else {
        context.fillStyle = '#999';
    }

    context.beginPath();
    context.arc(circle1.x, circle1.y, circle1.radius, 0, Math.PI * 2, false);
    context.fill();

    requestAnimationFrame(update);
};

update();
