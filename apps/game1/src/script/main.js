const playerModule = require('./player.js');
const playerUiModule = require('./playerUi.js');

const uiWorld = document.querySelector('.world');
const uiPlayer = document.querySelector('.player');

let player = {};

const uiInteraction = function(event) {
    if (event.type === "keydown") {
        if (event.key === "ArrowDown") {
            playerModule.rules.moveDown(player);
        } else if  (event.key === "ArrowUp") {
            playerModule.rules.moveUp(player);
        } else if  (event.key === "ArrowLeft") {
            playerModule.rules.moveLeft(player);
        } else if  (event.key === "ArrowRight") {
            playerModule.rules.moveRight(player);
        } 
        playerUiModule.renderPlayerUi(player, uiPlayer);
    }
}

const bindEvents = function() {
    window.addEventListeners('keydown', uiInteraction);
}

const init = function() {
    player = playerModule.playerFactory('John');
    bindEvents();
}
