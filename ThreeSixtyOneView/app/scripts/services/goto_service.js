'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('GotoService', ["$state", function Goto($state) {

	this.scenarioEdit = function (projectId, scenarioId, scenarioElementId){
		$state.go("Scenario.edit", {"projectId": projectId, "scenarioId": scenarioId, "scenarioElementId": scenarioElementId});
	};

	this.scenarioCalculate = function (projectId, scenarioId){
		$state.go("Scenario.calculate", {"projectId": projectId, "scenarioId": scenarioId});
	};

	this.dashboard = function(projectId){
		$state.go("Dashboard", {"projectId": projectId});
	};

	this.projects = function(){
		$state.go("ProjectManager");
	};

	this.scenarioCreate = function(projectId){
		$state.go("ScenarioCreate", {"projectId": projectId});
	};

	this.baseScenario = function(projectId, scenarioId){
		console.info("goto base scenrio");
		console.info(scenarioId);
		$state.go("Scenario.edit", {"projectId": projectId, "scenarioId": scenarioId});
	};
}]);