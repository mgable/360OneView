"use strict";

var specs = require('./3.0-scenario_specs.js'),

data = {
	selectSecondCube: function(){
		specs.selectedAnalysisElement.click();
		specs.analysisElements.get(1).click();
	}
};

module.exports = data;