'use strict';

angular.module('ThreeSixtyOneView')
	.service('ScenarioService', function (ScenarioModel, ProjectsService) {
	// AngularJS will instantiate a singleton by calling "new" on this function

		this.get = function (title){
			return ScenarioModel.get(ProjectsService.getProjectIDByTitle(title));
		};
	});
