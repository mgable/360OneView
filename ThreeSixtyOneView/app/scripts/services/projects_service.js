/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
	.service('ProjectsService',  ["$rootScope", "ProjectsModel", "Model", "EVENTS", function ($rootScope, ProjectsModel, Model, EVENTS) {
		var projects = [], MyProjectModel, myprojects, self = this;

		MyProjectModel = new Model();
        angular.extend(this, MyProjectModel.prototype);
        myprojects = new MyProjectModel(ProjectsModel);
        angular.extend(this, myprojects);

        //this.config = this.makeConfig(this, this.responseTranslator, this.requestTranslator);
        this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getProjectIDByTitle = function(_title_){
			var item = _.findWhere(this.data, {title:_title_});
			if (item) {
				return item.id;
			} else {
				console.error("The project named " + _title_ + " was NOT found!");
			}
		};

		this.getProjectTitleById = function(_id_){
			var item = _.findWhere(this.data, {id:_id_});
			if (item) {
				return item.title;
			} else {
				console.error("The project id " + _id_ + " was NOT found!");
			}
		};

		this.getProjectItemById = function(_id_){
			var item = _.findWhere(this.data, {id:_id_});
			if (item) {
				return item;
			} else {
				console.error("The project id " + _id_ + " was NOT found!");
			}
		};

		// this.setProjects = function(_projects_){
		// 	projects = _projects_;
		// };

		this.getProjects = function(){
			//return projects;
			return this.data;
		};

		$rootScope.$on(EVENTS.renameProject, function($event, data){
			self.rename(data);
		});

		$rootScope.$on(EVENTS.createProject, function($event, data){
			self.create(data);
		});
  }]);
