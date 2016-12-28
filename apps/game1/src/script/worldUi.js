'use strict';
const playerUiModule = require('./playerUi.js');

let worldUi = {};


const uiInteraction = function(event) {
    playerUiModule.uiInteraction(event);
}

const bindEvents = function() {
    window.addEventListeners('keydown', uiInteraction);
}

const init = function() {
    worldUi = document.querySelector('.world');
    playerUiModule.init();
    bindEvents();
}

module.exports = {init};