'use strict';

angular.module('ThreeSixtyOneView')
.controller('SelectBaseScenarioCtrl', ['$scope', '$controller', '$modalInstance', 'CONFIG', 'data', 'ScenarioService', 'ManageTemplatesService',
function($scope, $controller, $modalInstance, CONFIG, data, ScenarioService, ManageTemplatesService) {
	angular.extend(this, $controller('ListLightboxBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var projects = [],
		templates = [],
		templateFilter = false,

		init = function() {
			$scope.isListLoaded = false;

			$scope.scenarioTypeItems = ['All Scenarios'];
			$scope.currentScenarioType = $scope.scenarioTypeItems[0];

			ScenarioService.getAll().then(function(_projects) {
				$scope.isListLoaded = true;
				projects = _projects;
			});

			ManageTemplatesService.getAll().then(function(_templates) {
				console.log(_templates);
				templates = _templates;
			});
		};

	$scope.changeScenarioType = function(scenarioType) {
		$scope.currentScenarioType = scenarioType;
	};

	$scope.getTemplates = function() {
		return templates;
	};

	$scope.changeTemplate = function(template) {
		if(template === 'ALL') {
			templateFilter = false;
		} else {
			templateFilter = template;
		}
	};

	$scope.getCurrentTemplate = function() {
		if(!templateFilter) {
			return {
				icon: '',
				text: 'All'
			};
		} else {
			return {
				icon: templateFilter.name[0].toUpperCase(),
				text: templateFilter.name
			};
		}
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