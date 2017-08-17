import {Vector} from '../lesson7/vector.js';
import {Particle} from './particle.js';
import {canvas, context, width, height} from '../canvas.js';

const particles = [];
const particleCount = 300;
const gravity = new Vector(0, 0.05);
let generatedCount = 0;



const generateParticles = () => {
    if (generatedCount < particleCount) {
        let nextCount = Math.floor(Math.random() * particleCount/20);
        console.log(nextCount);
        generatedCount += nextCount;
        for (let index = 0; index < nextCount; index++) {
            let particle = new Particle(width/2, height, Math.random() * 10, -(Math.PI / 2) - 0.1 + (Math.random() * 0.2));
            particle.radius = Math.random() * 7;
            particle.accelerate = gravity;
            particles.push(particle);
        }

    }
};


const update = () => {
    context.clearRect(0, 0, width, height);

    generateParticles();

    particles.forEach((particle) => {
        particle.update();

        if (particle.position.y + particle.radius < 0 ||
            particle.position.y - particle.radius > height + 20) {
            particle.position.x = width / 2;
            particle.position.y = height;
            particle.velocity.length = Math.random() * 10;
            particle.velocity.angle = -(Math.PI / 2) - 0.1 + (Math.random() * 0.2);
        }


        context.beginPath();
        context.arc(particle.position.x, particle.position.y, particle.radius, 0, Math.PI * 2, false);
        context.fill();
    });

    requestAnimationFrame(update);
};

update();