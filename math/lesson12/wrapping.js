import {Vector} from '../lesson7/vector.js';
import {Particle} from './particle.js';
import {canvas, context, width, height} from '../canvas.js';

const particle = new Particle(width / 2, height/ 2, 1, Math.random() * Math.PI * 2);
particle.radius = 20;

const update = () => {
    context.clearRect(0, 0, width, height);

    particle.update();

    if (particle.position.x - particle.radius > width) {
        particle.position.x = 0;
    } else if (particle.position.x + particle.radius < 0) {
        particle.position.x = width;
    }

    if (particle.position.y - particle.radius > height) {
        particle.position.y = 0;
    } else if (particle.position.y + particle.radius < 0) {
        particle.position.y = height;
    }
    
    context.beginPath()
    context.arc(particle.position.x, particle.position.y, particle.radius, 0, Math.PI * 2, false);
    context.fill();

    requestAnimationFrame(update);
};

update();