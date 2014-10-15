/* global _ */
/*jshint unused:false */

'use strict';

angular.module('ThreeSixtyOneView')
	.service('ScenarioService', ["$q", "ScenarioModel", "ProjectsService", "CONFIG", "Model", function ($q, ScenarioModel, ProjectsService, CONFIG, Model) {
		var scenario = CONFIG.application.models.ScenarioModel.newScenario,
		MyScenarioModel, myScenarios;

		MyScenarioModel = new Model();
        angular.extend(this, MyScenarioModel.prototype);
        myScenarios = new MyScenarioModel(ScenarioModel);
        angular.extend(this, myScenarios);

        this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.get = function (identifier){
			if(/[a-z\d]{32}/.test(identifier)) {
				// is UUID (probably)
				return myScenarios.get(identifier);
			} else {
				return myScenarios.get(ProjectsService.getProjectIDByTitle(identifier));
			}
		};

		this.create = function(scenarioObj){
			var id = scenarioObj.projectId ? scenarioObj.projectId : ProjectsService.getProjectIDByTitle(scenarioObj.projectName);
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
