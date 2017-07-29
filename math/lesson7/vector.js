export class Vector {
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    set x(value) {
        this._x = value;
    }

    get x() {
        return this._x;
    }

    set y(value) {
        this._y = value;
    }

    get y() {
        return this._y;
    }

    set angle(value) {
        let length = this.length;
        this._x = Math.cos(value) * length;
        this._y = Math.sin(value) * length;
    }

    get angle() {
        return Math.atan2(this._y, this._x);
    }

    set length(value) {
        this._x = Math.cos(this.angle) * value;
        this._y = Math.sin(this.angle) * value;
    }

    get length() {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    add(v2) {
        return new Vector(this._x + v2.x, this._y + v2.y);
    }

    subtract(v2) {
        return new Vector(this._x - v2.x, this._y - v2.y);
    }

    multiply(value) {
        return new Vector(this._x * value, this._y * value);
    }

    divide(value) {
        return new Vector(this._x / value, this._y / value);
    }

    addTo(vector) {
        this._x = this._x + vector.x;
        this._y = this._y + vector.y;
    }

    subtractFrom(vector) {
        this._x = this._x - vector.x;
        this._y = this._y - vector.y;
    }

    multiplyBy(value) {
        this._x = this._x * value;
        this._y = this._y * value;
    }

    divideBy(value) {
        this._x = this._x / value;
        this._y = this._y / value;
    }
}