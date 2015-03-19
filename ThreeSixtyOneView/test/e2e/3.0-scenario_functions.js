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
	}, 
	addDimension: function(callback){
		var selectedIndex = null;
		specs.dimensions.each(function(el, index){
			var holder = el.element(by.css('span'));

			coreFunctions.hasClass(holder, "disabled").then(function(isDisabled){
				holder.getText().then(function(text){
					if(isDisabled !== true && text !== "" && selectedIndex === null){
						selectedIndex = index;
						console.info('the selected index is ' + index);
					}
				});
			});
		}).then(
			function() {
				callback.call(null, selectedIndex);
			}
		);
	}
};

_.extend(data, coreFunctions);

module.exports = data;