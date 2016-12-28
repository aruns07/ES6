'use strict';
const playerModule = require('./player.js');

let playerUi = {};
let player = {};

const renderPlayerUi = function(player, playerUi) {
    playerUi.style.left = player.positionX + 'px';
    playerUi.style.top = player.positionY + 'px';
};

const movePlayer = function(player, direction = 'ArrowDown') {
    if (direction === 'ArrowDown') {
        playerModule.rules.moveDown.call(player);
    } else if  (direction === 'ArrowUp') {
        playerModule.rules.moveUp.call(player);
    } else if  (direction === 'ArrowLeft') {
        playerModule.rules.moveLeft.call(player);
    } else if  (direction === 'ArrowRight') {
        playerModule.rules.moveRight.call(player);
    } 
};

const uiInteraction = function(event) {
    if (event.type === 'keydown') {
        movePlayer(player, event.key);
        renderPlayerUi(player, playerUi);
    }
};

const init = function() {
    playerUi = document.querySelector('.player');
    player = playerModule.playerFactory('John');
};

module.exports = {init, renderPlayerUi, movePlayer, uiInteraction};