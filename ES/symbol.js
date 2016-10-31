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
mySecondCar.ignition(); //Combustion started
