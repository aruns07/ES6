'use strict';
class Player {
    constructor(name = 'player') {
        this.name = name;
        this.positionX = 0;
        this.positionY = 0;
    }
}
const playerFactory = function (name) {
    return new Player(name);
};


const introduce = function () {
    return 'Hello, my name is ' + this.name;
};

const moveLeft = function () {
    this.positionX = this.positionX - 1;
    return this;
};

const moveRight = function () {
    this.positionX = this.positionX + 1;
    return this;
};

const moveUp = function () {
    this.positionY = this.positionY - 1;
    return this;
};

const moveDown = function () {
    this.positionY = this.positionY + 1;
    return this;
};

const rules = {introduce, moveLeft, moveRight, moveUp, moveDown};

module.exports = {playerFactory, rules};