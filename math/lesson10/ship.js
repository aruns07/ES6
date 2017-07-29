import {Vector} from '../lesson7/vector.js';
import {Particle} from '../lesson8/particle.js';
import {canvas, context, width, height} from '../canvas.js';

const ship = new Particle(width / 2, height / 2);
const thrust = new Vector();

let thrusting = false;
let angle = 0;


document.addEventListener('keydown', (event) => {
    switch(event.keyCode) {
        case 37: //Left
            angle -= 0.1;
            break;
        case 38: //Up
            thrusting = true;
            thrust.length = 0.1;
            break;
        case 39: //Right
            angle += 0.1;
            break;
        case 40: //Down
            thrust.length = 0;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch(event.keyCode) {
        case 38: //Up
            thrusting = false;
            thrust.length = 0;
            break;
    }
});


const update = () => {
    context.clearRect(0, 0, width, height);

    if (ship.position.x > width) {
        ship.position.x = 0;
    } else if (ship.position.x < 0) {
        ship.position.x = width;
    }


    if (ship.position.y > height) {
        ship.position.y = 0;
    } else if (ship.position.y < 0) {
        ship.position.y = height;
    }

    thrust.angle = angle;
    ship.accelerate(thrust);
    ship.update();

    context.save();
    context.translate(ship.position.x, ship.position.y);
    context.rotate(angle);

    context.beginPath();
    context.moveTo(20, 0);
    context.lineTo(0, 5);
    context.lineTo(0 , -5);
    context.lineTo(20, 0);

    if (thrusting) {
        context.moveTo(0, 0);
        context.lineTo(-10, 0);
    }

    context.stroke();

    context.restore();

    requestAnimationFrame(update);
};

update();