'use strict';

angular.module('ThreeSixtyOneView.directives')
  .directive('breadcrumb', function ($compile, $state, $stateParams, $sce, $interpolate, GotoService, ProjectsService, ScenarioService) {
	return {
		template: "<span ng-bind-html='breadcrumbs' ng-click='goto($event)'></span>",
		restrict: 'AE',
		link: function (scope) {
			var breadcrumbs, where, params;
			scope.goto = function(evt){
				if (evt.target.attributes.goto){
					where = evt.target.attributes.getNamedItem('goto').value;

					if (evt.target.attributes.getNamedItem('params')){
						params = evt.target.attributes.getNamedItem('params').value;
					}
					GotoService[where](params);
				}
			};

			scope.$on("$stateChangeSuccess", function(){
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
				}
			});
		},
		replace: true
	};
  });
