module.exports = function(test) {
  const playerModule = require('../../src/script/player.js');

  test('Player introduce.', (assert) => {
    const expected = 'Hello, my name is John';
    const player1 = playerModule.playerFactory('John');
    const actual = playerModule.rules.introduce.call(player1);

    assert.equal(actual, expected,
      'The player should say "Hello, my name is John"');

    assert.end();
  });

  test('Player Move.', (t) => {

    t.test('Move left', (assert) => {
      try {
        const player1 = playerModule.playerFactory('John');
        const expected = -1;
        const actual = playerModule.rules.moveLeft.call(player1).positionX;
        assert.equal(actual, expected, 'The player x position should be one less');

      } catch(err) {
        assert.fail(err);
      } finally {
        assert.end();        
      }
    });

    t.test('Move right', (assert) => {
      try {
        const player1 = playerModule.playerFactory('John');
        const expected = 1;
        const actual = playerModule.rules.moveRight.call(player1).positionX;

        assert.equal(actual, expected, 'The player x position should be one more');

      } catch(err) {
        assert.fail(err);
      } finally {
        assert.end();        
      }

    });

    t.test('Move up', (assert) => {
      try {
        const player1 = playerModule.playerFactory('John');
        const expected = -1;
        const actual = playerModule.rules.moveUp.call(player1).positionY;
        assert.equal(actual, expected, 'The player y position should be one less');

      } catch(err) {
        assert.fail(err);
      } finally {
        assert.end();        
      }
    });

    t.test('Move down', (assert) => {
      try {
        const player1 = playerModule.playerFactory('John');
        const expected = 1;
        const actual = playerModule.rules.moveDown.call(player1).positionY;

        assert.equal(actual, expected, 'The player y position should be one more');

      } catch(err) {
        assert.fail(err);
      } finally {
        assert.end();        
      }

    });

  });
};