'use strict';

angular.module('ThreeSixtyOneView')
	.service('GotoService', ["$state", function Goto($state) {
	
	this.scenarioEdit = function (project, scenario){
		$state.go("ScenarioEdit", {"project": project, "scenario": scenario});
	};

	this.dashboard = function(projectId){
		$state.go("Dashboard", {"projectId": projectId});
	};

	this.projects = function(){
		$state.go("ProjectManager");
	};
		
	this.scenarioCreate = function(projectName){
		$state.go("ScenarioCreate", {"projectName": projectName});
	};
}]);