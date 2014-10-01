'use strict';

angular.module('ThreeSixtyOneView')
	.service('ScenarioService', ["ScenarioModel", "ProjectsService", "CONFIG", function (ScenarioModel, ProjectsService, CONFIG) {
		var scenario = CONFIG.application.models.ScenarioModel.newScenario;

		this.get = function (title){
			return ScenarioModel.get(ProjectsService.getProjectIDByTitle(title));
		};

		this.create = function(scenarioObj){
			var id = ProjectsService.getProjectIDByTitle(scenarioObj.project);
			scenario.name = scenarioObj.title;
			scenario.description = scenarioObj.description || "";
			ScenarioModel.create(scenario, id);
		};
	}]);
