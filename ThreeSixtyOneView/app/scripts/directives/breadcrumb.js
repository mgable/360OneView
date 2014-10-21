'use strict';

angular.module('ThreeSixtyOneView')
  .directive('breadcrumb', function ($state, $stateParams, $sce, $interpolate, ProjectsService, ScenarioService) {
    return {
    	template: "<span ng-bind-html='breadcrumbs'></span>",
    	restrict: 'AE',
    	link: function (scope, element, attrs) {
	      	scope.$on("$stateChangeSuccess", function(){
	      		var breadcrumbs;
	            scope.project = $stateParams.projectId ? ProjectsService.getProjectItemById($stateParams.projectId) : "";

	            if ($stateParams.scenarioId){
	                 ScenarioService.get($stateParams.projectId,$stateParams.scenarioId).then(function(response){
	                    scope.scenario = response;
	                    breadcrumbs = $sce.trustAsHtml($interpolate($state.current.breadcrumb)(scope));
	                    scope.breadcrumbs = breadcrumbs;
	                 });
	            } else {
	                breadcrumbs = $sce.trustAsHtml($interpolate($state.current.breadcrumb)(scope));
	                scope.breadcrumbs = breadcrumbs;
	            };
	        });
      	}
    };
  });
