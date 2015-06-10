/* global _ */

'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('ProjectsService',  ["$rootScope", "ProjectsModel", "Model", "EVENTS", function ($rootScope, ProjectsModel, Model, EVENTS) {
		var MyProjectModel, myprojects, self = this,
			findMasterProject = function(projects) {
				return _.find(projects, function(project) {return project.isMaster;});
			};

		MyProjectModel = new Model();
		angular.extend(this, MyProjectModel.prototype);
		myprojects = new MyProjectModel(ProjectsModel);
		angular.extend(this, myprojects);

		// this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getProjectItemById = function(_id_){
			if (this.data.length === 0){
				return this.get().then(function(data){
					self.data = data;
					return self.getProjectItemById(_id_);
				});
				
			}
			var item = _.findWhere(this.data, {uuid:_id_});
			if (item) {
				return item;
			} else {
				console.info("The project id " + _id_ + " was NOT found!");
			}
		};

		this.getProjects = function(){
			return this.data;
		};

		this.rename = function(data){
			var obj = (_.pick(data, 'name', 'description', 'uuid'));
			if (typeof obj.description === "undefined"){
				obj.description = "";
			}
			this.put(obj);
		};

		this.getProjectIdByScenarioId = function(scenarioId){
			var params = {params: {scenarioId: scenarioId}};
			return this.resource.get({}, params).then(function(response){
				return response[0];
			});
		};

		this.getMasterProject = function() {
			if(self.data.length < 1) {
				return this.get().then(function(projects) {
					self.masterProject = findMasterProject(projects);
					return self.masterProject;
				});
			} else {
				var deferred = self.resource._q.defer();
				if(!self.masterProject) {
					self.masterProject = findMasterProject(self.data);
					deferred.resolve(self.masterProject);
					return deferred.promise;
				} else {
					deferred.resolve(self.masterProject);
					return deferred.promise;
				}
			}
		};

		$rootScope.$on(EVENTS.renameProject, function($event, data){
			self.rename(data);
		});

  }]);
