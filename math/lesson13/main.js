import {Vector} from '../lesson7/vector.js';
import {Particle} from './particle.js';
import {canvas, context, width, height} from '../canvas.js';

const particle = new Particle(width/2, height/2, 10, Math.random() * Math.PI * 2);
particle.friction = new Vector(0.2, 0);

const update = () => {
    context.clearRect(0, 0, width, height);

    particle.update();

    context.beginPath();
    context.arc(particle.position.x, particle.position.y, 20, 0, Math.PI * 2, false);
    context.fill();

    requestAnimationFrame(update);
};

update();
