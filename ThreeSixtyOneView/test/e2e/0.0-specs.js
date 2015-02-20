"use strict";

var simulate = "span[data-ms-id='scenario.simulate.button']",

	data = {
		inputRestrictions: ["\\", "\/", ":", "?", "*", "\"", ">", "<", "|"], //\\\/\?\:\*"><|
		minimumCharacters: "xx",
		maximumCharacters: "Bacon ipsum dolor amet spare ribs drumstick short loin capicola boudin kielbasa. Ham hock chuck jowl swine, pork beef ribs turducken shoulder short ribs landjaeger. Beef turkey jowl tongue filet mignon cow spare ribs kielbasa drumstick ham hock jerky capxx",
		simulateButton: element(by.css(simulate))
	};

module.exports = data;