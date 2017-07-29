import {Vector} from '../lesson7/vector.js';
import {Particle} from '../lesson8/particle.js';
import {canvas, context, width, height} from '../canvas.js';

const ship = new Particle(width / 2, height / 2);
const thrust = new Vector();

document.addEventListener('keydown', (event) => {
    console.log(event.keyCode);
    switch(event.keyCode) {
        case 37: //Left
            thrust.x = -0.1;
            break;
        case 38: //Up
            thrust.y = -0.1;
            break;
        case 39: //Right
            thrust.x = 0.1;
            break;
        case 40: //Down
            thrust.y = 0.1;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    console.log('Keyup', event.keyCode);
    switch(event.keyCode) {
        case 37: //Left
        case 39: //Right
            thrust.x = 0;
            break;
        case 38: //Up
        case 40: //Down
            thrust.y = 0;
            break;
    }
    console.log('Keyup', thrust);
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

    ship.accelerate(thrust);
    ship.update();

    context.beginPath();
    context.arc(ship.position.x, ship.position.y, 10, 0, Math.PI * 2, false);
    context.fill();

    requestAnimationFrame(update);
};

update();