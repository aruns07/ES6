class HelloMessage extends Polymer.Element {
				static get is() { return 'hello-message'};
				static get config() {
					return {
						properties: { name: { type: String}}
					};
				}

				constructor() {
					super();
				}
			}

			customElements.define('hello-message', HelloMessage);
