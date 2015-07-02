/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
.controller('OptimizationScenarioCreateCtrl', ['$scope', '$modalInstance', '$controller', '$state', 'data', 'ScenarioService', 'ProjectsService', 'DialogService',
	function($scope, $modalInstance, $controller, $state, data, ScenarioService, ProjectsService, DialogService) {
	
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data}));

	var projects = [],
		baseScenario,

		init = function init() {
			// get all the projects
			projects = ProjectsService.getProjects();

			$scope.parentProject = data.project;

			// this is temporary for now, should be fetched via the proper api
			$scope.types = [
				{label: 'Fixed Budget', disabled: false},
				{label: 'Target', disabled: true},
				{label: 'Profit', disabled: true}
			];
			$scope.selectedType = $scope.types[0].label;

			$scope.newScenario = {
				name: '',
				description: '',
				prediction: {
					type: 'Optimization'
				},
				type: '',
				isPlanOfRecord: false,
				referenceScenario: {},
				template: {}
			};

			// get all scenario for the base scenario functionality
			if(ProjectsService.getProjects().length === 0) {
				ProjectsService.get().then(function() {
					getAllScenarios();
				});
			} else {
				getAllScenarios();
			}
		},
		getAllScenarios = function getAllScenarios() {
			ScenarioService.getAll().then(function(_projects) {
				var masterProject = getMasterProject(_projects);
				// by default, make the last scenario in master project the base scenario
				setBaseScenario(masterProject.data[masterProject.data.length  - 1]);
			});
		},
		getMasterProject = function getMasterProject(_projects) {
			return _.findWhere(_projects, {'isMaster': true});
		},
		setBaseScenario = function setBaseScenario(_baseScenario) {
			baseScenario = _baseScenario;

			$scope.newScenario.type = _baseScenario.type;

			$scope.newScenario.referenceScenario = {
				id: _baseScenario.id,
				name: _baseScenario.name,
				type: _baseScenario.type
			};

			$scope.newScenario.template = {
				id: _baseScenario.template.id,
				name: _baseScenario.template.name,
				type: _baseScenario.template.type
			};
		};

	$scope.openBaseScenarioModal = function openBaseScenarioModal() {
		var dialog = DialogService.openLightbox('views/modal/select_base_scenario.tpl.html', 'SelectBaseScenarioCtrl',
			{currentBaseScenario: baseScenario, e2e: $scope.e2e},
			{windowSize: 'lg', windowClass: 'base-scenario-modal'});

		dialog.result.then(function(data) {
			baseScenario = data;
			setBaseScenario(data);
		});
	};

	$scope.getProjects = function getProjects() {
		return _.reject(projects, function(project) {return project.isMaster;});
	};

	$scope.changeProject = function changeProject(project) {
		$scope.parentProject = project;
	};

	$scope.submit = function submit(scenario){
		ScenarioService.setTemporaryScenario($scope.parentProject, $scope.newScenario, baseScenario, $scope.selectedType);
		$state.go('CreateRecommendation', {projectId: $scope.parentProject.uuid});
		$scope.close();
	};

	init();
}]);