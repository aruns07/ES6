# WebComponents

Notes :
1. Imported html resides in a seperate document.
2. ::shadow, :host, /deep/ to style shadow elements. https://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-201/ Deprecated 


Finding :
1. Using V1 spec of custom element `document.createElement('site-header-v1');` is throwing error.
	
	When running from console, currentScript does not have owner document.

	When running form main document script, it is not finding template. May be because current script document doesn't have it.

	Probably because the custom element is defined by an import document.

2. custom elements are inline by default.

