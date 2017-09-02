import {Vector} from '../lesson7/vector.js';

export class Particle {
    constructor(positionX = 100, positionY = 100, speed = 0, directionAngle = 0) {
        this.position = new Vector(positionX, positionY);
        this.velocity = new Vector(0, 0);
        this.velocity.length = speed;
        this.velocity.angle = directionAngle;
        this.acceleration = new Vector(0, 0);
        this.radius = 5;
        this.friction = 1;
        this.gravity = new Vector(0, 0.5);
    }

    set accelerate(value) {
        this.acceleration = value;
    }

    update() {
        this.velocity.multiplyBy(this.friction);
        this.position.addTo(this.velocity);
        this.velocity.addTo(this.acceleration.add(this.gravity));
    }
}