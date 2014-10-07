/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
	.service('ProjectsService',  function () {
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
  });
