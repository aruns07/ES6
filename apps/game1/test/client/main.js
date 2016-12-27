const test = require('tape');
const playerModule = require('../../src/script/player.js');
const playerUiModule = require('../../src/script/playerUi.js');

test.onFinish(() => {
  window.close();
});


test('Assertions with tape.', (assert) => {
  const expected = 'Hello, my name is John';
  const player1 = playerModule.playerFactory('John');
  const actual = playerModule.rules.introduce.call(player1);

  assert.equal(actual, expected,
    'The player should say "Hello, my name is John"');

  assert.end();
});

test('Move player UI right', (assert) => {
  
  const player = playerModule.playerFactory('John');
  playerModule.rules.moveRight.call(player);

  const playerUi = document.querySelector('.player');
  playerUiModule.renderPlayerUi(player, playerUi);
  
  const expected = '1px';
  const actual = playerUi.style.left;

  assert.equal(actual, expected,
    'The player moved right by 1px');

  assert.end();
});

test('Move player UI down', (assert) => {
  
  const player = playerModule.playerFactory('John');
  playerModule.rules.moveDown.call(player);
  playerModule.rules.moveDown.call(player);
  
  const playerUi = document.querySelector('.player');
  playerUiModule.renderPlayerUi(player, playerUi);
  
  const expected = '2px';
  const actual = playerUi.style.top;

  assert.equal(actual, expected,
    'The player moved down by 2px');

  assert.end();
});