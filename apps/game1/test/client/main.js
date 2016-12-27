const test = require('tape');
const player = require('../../src/script/player.js');

test.onFinish(() => {
  window.close();
});


test('Assertions with tape.', (assert) => {
  const expected = 'Hello, my name is John';
  const player1 = player.playerFactory('John');
  const actual = player1.introduce();

  assert.equal(actual, expected,
    'The player should say "Hello, my name is John"');

  assert.end();
});

