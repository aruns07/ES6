import {Vector} from '../lesson7/vector.js';
import {Particle} from './particle.js';
import {canvas, context, width, height} from '../canvas.js';

const particleCount = 100;
const particles = [];
const gravity = new Vector(0, 0.05);

let particle;
for (let index = 0; index < particleCount; index++) {
    particle = new Particle(width/2, height/2, Math.random() * 10, Math.random() * Math.PI * 2);
    particle.radius = Math.random() * 10 * 5;
    particle.accelerate = gravity;
    particles.push(particle);
}


const update = () => {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
        particle.update();
        context.beginPath();
        context.arc(particle.position.x, particle.position.y, particle.radius, 0, Math.PI * 2, false);
        context.fill();
    });

    removeOffscreenParticles();
    requestAnimationFrame(update);
};

const removeOffscreenParticles = () => {
    let particle;
    for(let index = particles.length - 1; index >= 0; index--) {
        particle = particles[index];
        if (particle.position.x - particle.radius > width ||
            particle.position.x + particle.radius < 0 ||
            particle.position.y + particle.radius < 0 ||
            particle.position.y - particle.radius > height) {
                particles.splice(index, 1);
            }
    }
};

update();