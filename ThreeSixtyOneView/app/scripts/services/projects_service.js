/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
	.service('ProjectsService',  ["$rootScope", "ProjectsModel", function ($rootScope, ProjectsModel) {
		var projects = [];

		this.getProjectIDByTitle = function(_title_){
			var item = _.findWhere(projects, {title:_title_});
			if (item) {
				return item.id;
			} else {
				console.error("The project named " + _title_ + " was NOT found!");
			}
		};

		this.setProjects = function(_projects_){
			projects = _projects_;
		};

		this.getProjects = function(){
			return projects;
		};

		$rootScope.$on("project:rename", function($event, data){
			ProjectsModel.rename(data);
		});

		$rootScope.$on("project:create", function($event, data){
			ProjectsModel.create(data);
		});
  }]);
