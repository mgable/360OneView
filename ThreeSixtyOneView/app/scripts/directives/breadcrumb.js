'use strict';

angular.module('ThreeSixtyOneView.directives')
.directive('breadcrumb', function ($compile, $state, $stateParams, $sce, $interpolate, GotoService, ProjectsService, ScenarioService) {
	return {
		template: "<ol class='breadcrumb' ng-bind-html='breadcrumbs' ng-click='goto($event)'></ol>",
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
					ScenarioService.get($stateParams.projectId).then(function(scenarios){
						scope.scenario = ScenarioService.find(scenarios, $stateParams.scenarioId);
						breadcrumbs = $sce.trustAsHtml($interpolate($state.current.breadcrumb)(scope));
						scope.breadcrumbs = breadcrumbs;
					});
				} else {
					console.info($state.current);
					breadcrumbs = $sce.trustAsHtml($interpolate($state.current.breadcrumb)(scope));
					scope.breadcrumbs = breadcrumbs;
				}
			});
		},
		replace: true
	};
});
