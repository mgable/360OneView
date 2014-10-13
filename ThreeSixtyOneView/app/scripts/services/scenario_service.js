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
			return ScenarioModel.create(scenario, id);
		};

		this.getAll = function(){
			var projects = ProjectsService.getProjects(),
			promises = [],
			ids = [], // _.pluck(projects,'id'),
			results = [];

			angular.forEach(projects, function(v,k,o){
				ids.push(_.pick(v, 'id', 'title'));
			});

			angular.forEach(ids, function(v,k,o){
				promises.push({title: v.title, promise: this.get(v.id)});
			}, this);

			return $q.all(_.pluck(promises, "promise")).then(function(response){
				angular.forEach(response, function(v,k,o){
					if (v.data.length){
						results.push({title:promises[k].title, data: v.data});
					}
				});
				return results;
			});
		};
	}]);
