"use strict";

var specs = require('./1.0-project_listing_specs.js'),
	coreSpecs = require('./3.0-scenario_specs.js'),
	_ = require('underscore'),

	status = ".scenario-calculation-title",
	failureMessage = ".scenario-calculation-description",
	states = "state in getStates()",

	data = {
		status: element(by.css(status)),
		failureMessage: element(by.css(failureMessage)),
		states: element.all(by.repeater(states)),
		calculateUrl: "#/scenario/:projectId/:scenarioId/calculate"
	};

_.extend(data, coreSpecs, specs);

module.exports = data;