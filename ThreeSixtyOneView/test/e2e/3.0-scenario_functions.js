"use strict";

var coreFunctions = require('./0.0-functions.js'),
	specs = require('./3.0-scenario_specs.js'),
	_ = require('underscore'),

data = {
	selectCube: function(index){
		specs.selectedAnalysisElement.click();
		specs.analysisElements.get(index).click();
	},
	getScenarioEditUrl: function(projectId, scenarioId){
		return this.getScenarioAbsoluteUrl(projectId, scenarioId) + specs.testQuery + "&" + specs.server;
	},
	getScenarioAbsoluteUrl: function(projectId, scenarioId){
		return browser.params.path + specs.scenarioUrl.replace(/:projectId/, projectId).replace(/:scenarioId/, scenarioId);
	},
	getScenarioCalculateUrl: function(projectId, scenarioId){
		return this.getCalculateAbsoluteUrl(projectId, scenarioId) + specs.testQuery + "&" + specs.server;
	},
	getCalculateAbsoluteUrl: function(projectId, scenarioId){
		return browser.params.path + specs.calculateUrl.replace(/:projectId/, projectId).replace(/:scenarioId/, scenarioId);
	}
};

_.extend(data, coreFunctions);

module.exports = data;