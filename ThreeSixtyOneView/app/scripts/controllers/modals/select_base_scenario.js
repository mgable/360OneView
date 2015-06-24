'use strict';

angular.module('ThreeSixtyOneView')
.controller('SelectBaseScenarioCtrl', ['$scope', '$controller', '$modalInstance', 'CONFIG', 'data', 'ScenarioService', 'ManageTemplatesService',
function($scope, $controller, $modalInstance, CONFIG, data, ScenarioService, ManageTemplatesService) {
	angular.extend(this, $controller('ListLightboxBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var projects = [],
		filteredProjects =[],
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
			$scope.searchTerm = '';

			$scope.scenarioTypeItems = ['All Scenarios'];
			$scope.currentScenarioType = $scope.scenarioTypeItems[0];

			ScenarioService.getAll().then(function(_projects) {
				$scope.isListLoaded = true;
				projects = _projects;
				filteredProjects = _projects;
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

		$scope.filterProjects($scope.searchTerm);
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

	$scope.filterProjects = function(searchTerm) {
		var output = [],
			filteredProject,
			projectNameMatch = false;

		if(searchTerm || templateFilter) {
			projects.forEach(function(project) {
				projectNameMatch = false;

				filteredProject = {
					name: project.name,
					data: []
				};

				// if project name matches the search term
				if(project.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
					projectNameMatch = true;
				}

				project.data.forEach(function(scenario) {
					if(scenario.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || projectNameMatch) {
						if(!templateFilter || templateFilter.id === scenario.template.id) {
							filteredProject.data.push(scenario);
						}
					}
				});

				if(filteredProject.data.length > 0) {
					output.push(filteredProject);
				}
			});
		} else {
			output = projects;
		}

		filteredProjects = output;
	};

	$scope.getProjects = function() {
		return filteredProjects;
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
		$scope.selectedScenario = scenario;
	};

	// pass back the selected base scenario and dismiss the modal
	$scope.submit = function() {
		$modalInstance.close($scope.selectedScenario);
	};

	init();
}]);