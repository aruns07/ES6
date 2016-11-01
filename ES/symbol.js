/**
 * A new primitive type 
 */

//symbol is unique
//
var Car =(
		function() {
			class Car {
				constructor() {
					this.build = 'BMW';					
				}

				start() {
					this.ignition();
				}

				ignition() {
					console.log('Combustion started');
				}
			}
			return Car;
		}
	)();

let myFirstCar = new Car();
myFirstCar.start(); //Combustion started
myFirstCar.ignition(); //Combustion started

//But consumer of Car cunstructor can access ignition. That we don't want.
//Solution : use symbol in private closures

var Car_second =(
		function() {
			const IGNITION = Symbol();

			class Car {
				constructor() {
					this.build = 'BMW';					
				}

				start() {
					this[IGNITION]();
				}

				[IGNITION]() {
					console.log('Combustion started');
				}
			}
			return Car;
		}
	)();

let mySecondCar = new Car_second();
mySecondCar.start(); //Combustion started
mySecondCar.ignition(); //not defined

//Other way to access the ignition method is;
mySecondCar[Object.getOwnPropertySymbols(Car_second.prototype)[0]]() //Combustion started
//Here we know which symbol at [0] is the desired one, what if list is long.
//


/*
 * In built symbol Symbol.iterator
 * Define how your object could be iterated
 */

let cars = {
	model_1: 'Audi',
	model_2: 'BMW',
	model_3: 'Jaguar',
	set addModel(modelName) {
		this.count++;
		Object.defineProperty(this, 'model_' + this.count, {value: modelName});
	},
	count: 3
};
for (var car in cars) { console.log(cars[car]);}//Audi, BMW, Jaguar, undefined, 3
//I don't want 'undefined', and 3. Desired list is Audi, BMW, and Jaguar. How to achieve it.
//Symbol.iterator

for (var car of cars) { console.log(cars[car]);}// Uncaught TypeError: cars[Symbol.iterator] is not a function(…)


let cars = {
	model_1: 'Audi',
	model_2: 'BMW',
	model_3: 'Jaguar',
	set addModel(modelName) {
		this.count++;
		Object.defineProperty(this, 'model_' + this.count, {value: modelName});
	},
	count: 3,
	[Symbol.iterator]() {
		let self = this;
		let index = 0;

		return {
			next() {
				index++;
				console.log(this, index, self['model_' + index]);
				return {
					value: self['model_' + index],
					done: (self['model_' + (index+1)]) ? false : true
				};
				
			}
		};
	} 
};
for (var car of cars) { console.log(cars[car]);}//Audi, BMW, Jaguar
//Good, no more unwanted properties. iterating over desired data only.

cars.addModel = "Mercedes";

for (var car of cars) { console.log(cars[car]);}//Audi, BMW, Jaguar, Mercedes
	//That is good, for..in was not reading dynamically added propery
