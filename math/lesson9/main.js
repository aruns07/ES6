import {Vector} from '../lesson7/vector.js';
import {Particle} from '../lesson8/particle.js';
import {canvas, context, width, height} from '../canvas.js';

const particle = new Particle(100, height, 10, -Math.PI / 3, 0.1);

const update = () => {
    context.clearRect(0, 0, width, height);

    particle.update();
    context.beginPath();
    context.arc(particle.position.x, particle.position.y, 10, 0, Math.PI * 2, false);
    context.fill();

    requestAnimationFrame(update);

};

update();