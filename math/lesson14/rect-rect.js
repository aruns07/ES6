import {canvas, context, width, height} from '../canvas.js';
import * as util from '../util.js';

const rect1 = {
    x: Math.random() * width,
    y: Math.random() * height,
    width: 300,
    height: 100
};
const rect2 = {
    x: 0,
    y: 0,
    width: 200,
    height: 70
};

window.addEventListener('mousemove', (event) => {
    rect2.x = event.clientX;
    rect2.y = event.clientY;
});

const update = () => {
    context.clearRect(0, 0, width, height);

    if (util.rectCollision(rect1, rect2)) {
        context.fillStyle = '#f66';
    } else {
        context.fillStyle = '#999';
    }

    context.beginPath();
    context.rect(rect1.x, rect1.y, rect1.width, rect1.height);
    context.fill();

    context.beginPath();
    context.rect(rect2.x, rect2.y, rect2.width, rect2.height);
    context.fill();

    requestAnimationFrame(update);
};

update();
