"use strict";

var _ = require('underscore'),
	simulate = "span[data-ms-id='scenario.simulate.button']",

	data = {
		inputRestrictions: ["\\", "\/", ":", "?", "*", "\"", ">", "<", "|"], //\\\/\?\:\*"><|
		minimumCharacters: "xx",
		maximumCharacters: "Bacon ipsum dolor amet spare ribs drumstick short loin capicola boudin kielbasa. Ham hock chuck jowl swine, pork beef ribs turducken shoulder short ribs landjaeger. Beef turkey jowl tongue filet mignon cow spare ribs kielbasa drumstick ham hock jerky capxx",
		simulateButton: element(by.css(simulate)),
		customMatchers: {
			arrayElementContains:  function(expected){

		        var self = this, regEx = new RegExp(expected), deferred = protractor.promise.defer(), result = false;

				_.each(self.actual, function(key){
					if (regEx.test(key)){
						result = true;
					}
				});

				if (result) {
		      		deferred.fulfill(true);
		    	} else {
		      		deferred.reject(self.actual + ' did not contain ' + expected);
		    	}
		        return deferred.promise;
		    }
		}
	};

module.exports = data;