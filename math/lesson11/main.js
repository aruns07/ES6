import {Vector} from '../lesson7/vector.js';
import {Mass} from './mass.js';
import {canvas, context, width, height} from '../canvas.js';

const sun = new Mass(width/2, height/2, 0, 0);
sun.mass = 200;
const planet = new Mass(width/2 + 200, height/2, 1, Math.PI / 2);

const update = () => {
    context.clearRect(0, 0, width, height);

    planet.accelerateTo(sun);
    planet.update();

    context.beginPath();
    context.fillStyle = '#fff00';
    context.arc(sun.position.x, sun.position.y, 10, 0, Math.PI * 2, false);
    context.fill();


    context.beginPath();
    context.fillStyle = '#000ff';
    context.arc(planet.position.x, planet.position.y, 5, 0, Math.PI * 2, false);
    context.fill();

    requestAnimationFrame(update);
};

update();