'use strict';

angular.module('ThreeSixtyOneView')
	.service('GotoService', ["$state", function Goto($state) {
	
	this.scenarioEdit = function (projectId, scenarioId){
		$state.go("ScenarioEdit", {"projectId": projectId, "scenarioId": scenarioId});
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
}]);