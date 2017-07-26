class Particle {
    constructor(positionX, positionY, speed, directionAngle) {
        this.position = new Vector(positionX, positionY);
        this.velocity = new Vector(0, 0);
        this.velocity.length = speed;
        this.velocity.angle = directionAngle;
    }

    update() {
        this.position.addTo(this.velocity);
    }
}