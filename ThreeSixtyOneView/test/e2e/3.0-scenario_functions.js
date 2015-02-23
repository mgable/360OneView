"use strict";

var coreFunctions = require('./0.0-functions.js'),
	specs = require('./3.0-scenario_specs.js'),
	_ = require('underscore'),

data = {
	selectSecondCube: function(){
		specs.selectedAnalysisElement.click();
		specs.analysisElements.get(1).click();
	}
};

_.extend(data, coreFunctions);

module.exports = data;