import {canvas, context, width, height} from '../canvas.js';
import * as util from '../util.js';

const circle1 = {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 30
};
const circle2 = {
    x: 100,
    y: 100,
    radius: 20
};

window.addEventListener('mousemove', (event) => {
    circle2.x = event.clientX;
    circle2.y = event.clientY;
});

const update = () => {
    context.clearRect(0, 0, width, height);

    if (util.circleCollision(circle1, circle2)) {
        context.fillStyle = '#f66';
    } else {
        context.fillStyle = '#999';
    }

    context.beginPath();
    context.arc(circle1.x, circle1.y, circle1.radius, 0, Math.PI * 2, false);
    context.fill();

    context.beginPath();
    context.arc(circle2.x, circle2.y, circle2.radius, 0, Math.PI * 2, false);
    context.fill();

    requestAnimationFrame(update);
};

update();
