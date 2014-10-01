/* global _ */
/*jshint unused:false */

'use strict';

angular.module('ThreeSixtyOneView')
	.service('ScenarioService', ["$q", "ScenarioModel", "ProjectsService", "CONFIG", function ($q, ScenarioModel, ProjectsService, CONFIG) {
		var scenario = CONFIG.application.models.ScenarioModel.newScenario;

		this.get = function (identifier){
			if(/[a-z\d]{32}/.test(identifier)) {
				// is UUID (probably)
				return ScenarioModel.get(identifier);
			} else {
				return ScenarioModel.get(ProjectsService.getProjectIDByTitle(identifier));
			}
		};

		this.create = function(scenarioObj){
			var id = ProjectsService.getProjectIDByTitle(scenarioObj.project);
			scenario.name = scenarioObj.title;
			scenario.description = scenarioObj.description || "";
			ScenarioModel.create(scenario, id);
		};

		this.getAll = function(){
			var projects = ProjectsService.getProjects(),
			promises = [],
			ids = _.pluck(projects,'id');
			angular.forEach(ids, function(v,k,o){
				console.info("the project is ");
				console.info(o[k]);
				promises.push(this.get(v));
			}, this);
			$q.all(promises).then(function(response){
				console.info("get all");
				console.info(response);
				angular.forEach(response, function(v,k,o){
					console.info("getting projects with scenarios");
					console.info(v);
				});
			});
		};
	}]);
