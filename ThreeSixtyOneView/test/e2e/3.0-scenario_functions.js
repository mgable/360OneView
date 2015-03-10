"use strict";

var coreFunctions = require('./1.0-project_listing_functions.js'),
	specs = require('./3.0-scenario_specs.js'),
	_ = require('underscore'),

data = {
	selectCube: function(index){
		specs.selectedAnalysisElement.click();
		specs.analysisElements.get(index).click();
	},
	getScenarioUrl: function(projectId, scenarioId){
		return this.getScenarioAbsoluteUrl(projectId, scenarioId) + specs.testQuery + "&" + specs.server;
	},
	getScenarioAbsoluteUrl: function(projectId, scenarioId){
		return browser.params.path + specs.scenarioUrl.replace(/:projectId/, projectId).replace(/:scenarioId/, scenarioId);
	},
	getCalculateUrl: function(projectId, scenarioId){
		return this.getCalculateAbsoluteUrl(projectId, scenarioId) + specs.testQuery + "&" + specs.server;
	},
	getCalculateAbsoluteUrl: function(projectId, scenarioId){
		return browser.params.path + specs.calculateUrl.replace(/:projectId/, projectId).replace(/:scenarioId/, scenarioId);
	}
};

_.extend(data, coreFunctions);

module.exports = data;