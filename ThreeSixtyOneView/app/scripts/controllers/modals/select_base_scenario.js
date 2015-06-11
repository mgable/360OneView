'use strict';

angular.module('ThreeSixtyOneView')
.controller('SelectBaseScenarioCtrl', ['$scope', '$controller', '$modalInstance', 'CONFIG', 'data', 'ScenarioService',
function($scope, $controller, $modalInstance, CONFIG, data, ScenarioService) {
	angular.extend(this, $controller('ListLightboxBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var projects = [],

		init = function() {
			$scope.isListLoaded = false;

			$scope.scenarioTypeItems = ['All Scenarios'];
			$scope.currentScenarioType = $scope.scenarioTypeItems[0];
			$scope.templateTypeItems = CONFIG.view.ScenarioTemplates.types;
			$scope.currentTemplateType = $scope.templateTypeItems[0];

			ScenarioService.getAll().then(function(_projects) {
				$scope.isListLoaded = true;
				projects = _projects;
			});
		};

	$scope.changeScenarioType = function(scenarioType) {
		$scope.currentScenarioType = scenarioType;
	};

	$scope.changeTemplateType = function(index) {
		$scope.currentTemplateType = $scope.templateTypeItems[index];
	};

	$scope.getProjects = function() {
		return projects;
	};

	$scope.getScenarios = function(project) {
		return project.data;
	};

	$scope.getScenarioType = function(scenario) {
		return scenario.type[0];
	};

	// pass back the selected base scenario and dismiss the modal
	$scope.submit = function() {
		var selectedBaseScenario = {};
		$modalInstance.close(selectedBaseScenario);
	};

	init();
}]);