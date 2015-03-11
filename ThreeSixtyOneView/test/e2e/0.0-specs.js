"use strict";

var servers = require('./servers.js'),
	_ = require('underscore'),
	simulate = "span[data-ms-id='scenario.simulate.button']",
	clientServer = servers.getServer(browser.params.client.toLowerCase()),
	projects = "/rubix/v1/project",
	scenarioStatus = '/rubix/v1/analytics/scenario/:id/calculate',

	data = {
		server: "server=http://" + clientServer.url + ":" + clientServer.port,
		domain: clientServer.url,
		port:  clientServer.port,
		projects: projects, 
		scenarios: projects + "/:uuid/scenario",
		scenarioStatus: scenarioStatus,
		testQuery: "?e2e=true",
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

console.info("Pulling data from " + data.domain + ":" + data.port);

module.exports = data;
	