import {Vector} from '../lesson7/vector.js';

export class Particle {
    constructor(positionX, positionY, speed, directionAngle, accelerationY = 0) {
        this.position = new Vector(positionX, positionY);
        this.velocity = new Vector(0, 0);
        this.velocity.length = speed;
        this.velocity.angle = directionAngle;
        this.gravity = new Vector(0, accelerationY);
    }

    update() {
        this.position.addTo(this.velocity);
        this.velocity.addTo(this.gravity);
    }
}