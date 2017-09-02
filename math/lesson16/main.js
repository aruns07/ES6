import {Vector} from '../lesson7/vector.js';
import {Particle} from '../lesson13/particle.js';
import {canvas, context, width, height} from '../canvas.js';

const weight1 = new Particle(width * Math.random(), height * Math.random());
weight1.friction = 0.85;

const weight2 = new Particle(width * Math.random(), height * Math.random());
weight2.friction = 0.85;

const weight3 = new Particle(width * Math.random(), height * Math.random());
weight3.friction = 0.85;

const weight4 = new Particle(width * Math.random(), height * Math.random());
weight4.friction = 0.85;

const weight5 = new Particle(width * Math.random(), height * Math.random());
weight5.friction = 0.85;

const separation = 100;
const springConstant = 0.07;

/*
window.addEventListener('mousemove', (event) => {
    point.x = event.clientX;
    point.y = event.clientY;
});
*/

const applySpringForce = (weight1, weight2, separation) => {
    let forceVector = weight1.position.subtract(weight2.position);
    forceVector.length = forceVector.length - separation;
    forceVector.multiplyBy(springConstant);
    weight2.accelerate = forceVector;
    weight2.update();

    forceVector.multiplyBy(-1);
    weight1.accelerate = forceVector;
    weight1.update();
};

const update = () => {
    context.clearRect(0, 0, width, height);

    applySpringForce(weight1, weight2, separation);
    applySpringForce(weight1, weight3, separation);
    applySpringForce(weight1, weight4, separation);
    applySpringForce(weight1, weight5, separation);

    context.beginPath();
    context.arc(weight1.position.x, weight1.position.y, 20, 0, Math.PI * 2, false);
    context.fill();

    context.beginPath();
    context.arc(weight2.position.x, weight2.position.y, 20, 0, Math.PI * 2, false);
    context.fill();

    context.beginPath();
    context.arc(weight3.position.x, weight3.position.y, 20, 0, Math.PI * 2, false);
    context.fill();

    context.beginPath();
    context.arc(weight4.position.x, weight4.position.y, 20, 0, Math.PI * 2, false);
    context.fill();

    context.beginPath();
    context.arc(weight5.position.x, weight5.position.y, 20, 0, Math.PI * 2, false);
    context.fill();

    context.beginPath();
    context.moveTo(weight1.position.x, weight1.position.y);
    context.lineTo(weight2.position.x, weight2.position.y);
    context.stroke();

    context.beginPath();
    context.moveTo(weight1.position.x, weight1.position.y);
    context.lineTo(weight3.position.x, weight3.position.y);
    context.stroke();

    context.beginPath();
    context.moveTo(weight1.position.x, weight1.position.y);
    context.lineTo(weight4.position.x, weight4.position.y);
    context.stroke();

    context.beginPath();
    context.moveTo(weight1.position.x, weight1.position.y);
    context.lineTo(weight5.position.x, weight5.position.y);
    context.stroke();

    requestAnimationFrame(update);
};

update();
