import {Vector} from '../lesson7/vector.js';

export class Mass {
    constructor(positionX = 100, positionY = 100, speed = 0, directionAngle = 0) {
        this.mass = 1;
        this.position = new Vector(positionX, positionY);
        this.velocity = new Vector(0, 0);
        this.velocity.length = speed;
        this.velocity.angle = directionAngle;
    }

    accelerate(value) {
        this.velocity.addTo(value);
    }

    angleTo(point) {
        return Math.atan2(point.y - this.position.y, point.x - this.position.x);
    }

    distanceTo(point) {
        let dx = point.x - this.position.x;
        let dy = point.y - this.position.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    accelerateTo(mass) {
        let angle = this.angleTo(mass.position);
        let distance = this.distanceTo(mass.position);

        let acceleration = new Vector(0, 0);
        acceleration.length = mass.mass / (distance * distance);
        acceleration.angle = angle;

        this.velocity.addTo(acceleration);
    }

    update() {
        this.position.addTo(this.velocity);
    }
}