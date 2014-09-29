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
				console.error("No project named " + _title_ + " was found!");
			}
		};

		this.setProjects = function(_projects_){
			projects = _projects_.data;
		};
  });
