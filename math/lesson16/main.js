import {Vector} from '../lesson7/vector.js';
import {Particle} from '../lesson13/particle.js';
import {canvas, context, width, height} from '../canvas.js';

const weight = new Particle(width * Math.random(), height * Math.random());
weight.friction = 0.9;
const point = new Vector(width/2, height/2);
const separation = 100;
const springConstant = 0.05;
let forceVector;

/*
window.addEventListener('mousemove', (event) => {
    point.x = event.clientX;
    point.y = event.clientY;
});
*/
const update = () => {
    context.clearRect(0, 0, width, height);

    forceVector = point.subtract(weight.position);
    forceVector.length = forceVector.length - separation;
    forceVector.multiplyBy(springConstant);
    weight.accelerate = forceVector;
    weight.update();

    context.beginPath();
    context.arc(weight.position.x, weight.position.y, 20, 0, Math.PI * 2, false);
    context.fill();

    context.beginPath();
    context.arc(point.x, point.y, 2, 0, Math.PI * 2, false);
    context.fill();

    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(weight.position.x, weight.position.y);
    context.stroke();

    requestAnimationFrame(update);
};

update();
