import {Vector} from '../lesson7/vector.js';
import {Particle} from './particle.js';
import {canvas, context, width, height} from '../canvas.js';

const particle = new Particle(width / 2, height/ 2, 5, Math.random() * Math.PI * 2);
particle.radius = 30;

const gravity = new Vector(0, 0.05);
particle.accelerate = gravity;

const drag = 0.99;

const update = () => {
    context.clearRect(0, 0, width, height);

    particle.update();

    if (particle.position.x + particle.radius > width ||
        particle.position.x - particle.radius < 0) {
        particle.velocity.x = particle.velocity.x * -drag;
    }

    if (particle.position.y + particle.radius > height ||
        particle.position.y - particle.radius < 0) {
        particle.velocity.y = particle.velocity.y * -drag;
    }
    
    context.beginPath()
    context.arc(particle.position.x, particle.position.y, particle.radius, 0, Math.PI * 2, false);
    context.fill();

    requestAnimationFrame(update);
};

update();