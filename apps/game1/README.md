# TDD Game

## 27 Dec, 2016
Functional programming:
1. At this point my understanding of mathematical function is 'For an input function always give same one output. Two different input can have same output, but one input will not have two different output irrespective of time, and circumstances'
2. In programming I used to think that a function can take input only through parameters. But now I think it could be given through context as well. for example
   ```
    const moveLeft = function () {
      this.positionX = this.positionX - 1;
      return this;
    };
    let data = {positionX: 0};
    moveLeft.call(data);
   ``` 
   Here for a certain state of data the function call `moveLeft` will leave state in one form of output state always.

3. Here I have a thought of breaking concept of pure function. The function is changing external state.
    1. Think it like. Every object has a state (defined by data) and want to maintian its state. It is the external force that make changes in its state as per a rule. These forces are functions and logic in function defines the rule.
    2. If required to keep the function pure. We can return a new object in a new state.


## 26 Dec, 2016
Tried Tape https://github.com/substack/tape. Could require('tape') in code that run on server and browser. 

Tried mocha integration with browser-run. Was not successful. `require('mocha')` was not running. https://github.com/aruns07/Playground/tree/c62682c594b9e23cff9d346d72930c0eacb02a29/apps/game1

