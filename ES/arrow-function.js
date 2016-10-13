/**
 * In prototypal approach of inheritance if we use arrow function and use 'this' it won't work as expected.
 */


//Arrow function
let Circle = function(_radius){
	this.radius = _radius;
};

Circle.prototype.getDiameter = () => {
	return this.radius * 2; 
};

let ball = new Circle(2);
console.log(ball.getDiameter()); //NaN

//In this example the diameter we get is NaN, becuase this.radius is undefined.
//The reason is 'this' is lexically bound to window in the definition of Circle.prototype.getDiameter

//Old way

let Circle_o = function(_radius){
	this.radius = _radius;
};

Circle_o.prototype.getDiameter = function() {
	return this.radius * 2; 
};

let ball_o = new Circle_o(2);
console.log(ball_o.getDiameter()); //4
