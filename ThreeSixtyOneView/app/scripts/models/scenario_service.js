/* global _ */
/*jshint unused:false */

'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('ScenarioService', ["$q", "$rootScope", "ScenarioModel", "ProjectsService", "CONFIG", "EVENTS", "Model", function ($q, $rootScope, ScenarioModel, ProjectsService, CONFIG, EVENTS, Model) {
		var MyScenarioModel, myScenarios, self = this;

		MyScenarioModel = new Model();
        angular.extend(this, MyScenarioModel.prototype);
        myScenarios = new MyScenarioModel(ScenarioModel);
        angular.extend(this, myScenarios);

        this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.myScenarios = myScenarios;

		this.get = function (projectId, scenarioId){
			return this.resource.get({"id": projectId}, this.config).then(function(response){
				self.data = response;
				if(scenarioId) {
					return _.findWhere(response, {id: parseInt(scenarioId,10)});
				} else {
					return response;
				}
			});
		};

		this.rename = function(scenario, projectId){
			var additionalPath = "name";
			return this.put(scenario, {id: projectId}, additionalPath).then(function(response){
				return response;
			});
		};

		this.edit = function(scenario, projectId){
			var additionalPath = "description";
			return this.put(scenario, {id: projectId}, additionalPath).then(function(response){
				return response;
			});
		};

		this.getProjectIdByScenarioId = function(scenarioId){
			return ProjectsService.getProjectIdByScenarioId(scenarioId).then(function(response){
				return response;
			});
		};

		this.getAll = function(){
			var projects = ProjectsService.getProjects(),
			promises = [],
			ids = [],
			results = [];

			angular.forEach(projects, function(v,k,o){
				ids.push(_.pick(v, 'id', 'title'));
			});

			angular.forEach(ids, function(v,k,o){
				promises.push({title: v.title, promise: this.get(v.id)});
			}, this);

			return $q.all(_.pluck(promises, "promise")).then(function(response){
				angular.forEach(response, function(v,k,o){
					if (v.length){
						results.push({title:promises[k].title, data: v});
					}
				});
				return results;
			});
		};

		// $rootScope.$on(EVENTS.editScenario, function($event, scenario){
		// 	self.getProjectIdByScenarioId(scenario.id).then(function(project){
		// 		console.info(scenario);
		// 		self.edit(scenario, project.uuid)
		// 	});
		// });

	}]);
