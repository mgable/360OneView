'use strict';

angular.module('ThreeSixtyOneView')
.controller('SelectBaseScenarioCtrl', ['$scope', '$controller', '$modalInstance', 'CONFIG', 'data', 'ScenarioService', 'ManageTemplatesService',
function($scope, $controller, $modalInstance, CONFIG, data, ScenarioService, ManageTemplatesService) {
	angular.extend(this, $controller('ListLightboxBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var projects = [],
		templates = [],
		templateFilter = false,
		projectCollapsed = {},

		findScenarioProject = function findScenarioProject(_projects, _scenario) {
			_projects.forEach(function(project) {
				project.data.forEach(function(scenario) {
					if(scenario.id === _scenario.id) {
						projectCollapsed[project.name] = true;
					}
				});
			});
		},

		init = function init() {
			$scope.selectedScenario = data.currentBaseScenario;

			$scope.isListLoaded = false;

			$scope.scenarioTypeItems = ['All Scenarios'];
			$scope.currentScenarioType = $scope.scenarioTypeItems[0];

			ScenarioService.getAll().then(function(_projects) {
				$scope.isListLoaded = true;
				projects = _projects;
				findScenarioProject(_projects, $scope.selectedScenario);
			});

			ManageTemplatesService.getAll().then(function(_templates) {
				templates = _templates;
			});
		};

	$scope.changeScenarioType = function(scenarioType) {
		$scope.currentScenarioType = scenarioType;
	};

	$scope.getTemplates = function() {
		return templates;
	};

	$scope.getTemplateIcon = function(template) {
		return template.name[0].toUpperCase();
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
				isIconVisible: false,
				text: 'All'
			};
		} else {
			return {
				icon: templateFilter.name[0].toUpperCase(),
				isIconVisible: true,
				text: templateFilter.name
			};
		}
	};

	$scope.getProjects = function() {
		return projects;
	};

	$scope.isProjectExpanded = function(project) {
		return projectCollapsed[project.name];
	};

	$scope.toggleProject = function(project) {
		projectCollapsed[project.name] = !projectCollapsed[project.name];
	};

	$scope.getScenarios = function(project) {
		return project.data;
	};

	$scope.getScenarioType = function(scenario) {
		return scenario.type[0];
	};

	$scope.selectScenario = function(scenario) {
		console.log(scenario);
		console.log($scope.selectedScenario);
		$scope.selectedScenario = scenario;
	};

	// pass back the selected base scenario and dismiss the modal
	$scope.submit = function() {
		var selectedBaseScenario = {};
		$modalInstance.close(selectedBaseScenario);
	};

	init();
}]);