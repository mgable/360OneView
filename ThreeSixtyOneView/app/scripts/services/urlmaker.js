'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('Urlmaker', ["$location", function($location) {
		this.gotoView = function(type){
			var args =  Array.prototype.slice.call(arguments, 1);
			switch(type){
				case "dashboard" : makeDashboardUrl.apply(this, args); break;
				case "projects" : makeProjectUrl.apply(this, args); break;
				case "scenarioEdit": makeScenarioEditURL.apply(this, args);break;
				case "scenarioCreate": makeScenarioCreateUrl.apply(this, args); break;
			}
		};

		var makeDashboardUrl = function(name){
			var url = "/dashboard/" + name;
			$location.path(url);
		};

		var makeProjectUrl = function(){
			var url = "/projects";
			$location.path(url);
		};

		var makeScenarioEditURL = function(project, scenario){
			var url = "/scenarioEdit/"+ project + "/" + scenario;
			$location.path(url);
		};

		var makeScenarioCreateUrl = function(project){
			var url = "/scenarioCreate/" + project;
			$location.path(url);
		};
	}]);
