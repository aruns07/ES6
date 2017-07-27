import {Vector} from '../lesson7/vector.js';
import {Particle} from '../lesson8/particle.js';
import {canvas, context, width, height} from '../canvas.js';

const particles = [];
const particleCount = 400;

for (let index = 0; index< particleCount; index++) {
    particles.push(new Particle(width / 2, height/ 2, Math.random() * 6 + 1, Math.random() * Math.PI * 2, 0.05));
}

const update = () => {
    context.clearRect(0, 0, width, height);

    particles.forEach(particle => {
        particle.update();
        context.beginPath();
        context.arc(particle.position.x, particle.position.y, 5, 0, Math.PI * 2, false);
        context.fill();
    });

    requestAnimationFrame(update);

};

update();