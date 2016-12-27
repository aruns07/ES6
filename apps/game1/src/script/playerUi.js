

const renderPlayerUi = function(player, uiPlayer) {
    uiPlayer.style.left = player.positionX + 'px';
    uiPlayer.style.top = player.positionY + 'px';
}


module.exports = {renderPlayerUi};