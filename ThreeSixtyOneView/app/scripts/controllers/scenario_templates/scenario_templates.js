'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesCtrl',['$scope', '$state', 'DialogService', 'CONFIG', 'ManageTemplatesService', 'ProjectsService',
	function ($scope, $state, DialogService, CONFIG, ManageTemplatesService, ProjectsService) {
		var masterProject,
			init = function() {
				$scope.onboardingState = false;
				ManageTemplatesService.getAll().then(function(response) {
					$scope.scenarioTemplates = response;
					startWorkflow();
				});
				ProjectsService.getMasterProject().then(function(response) {
					masterProject = response;
				});
				$scope.templateType = _.find(CONFIG.view.ScenarioTemplates.types, function(type) {
					return type.name === $state.params.type;
				});
			}, openScenarioTemplatesCreateModal = function(type, templates) {
				var scenarioTemplates = templates,
					dialog = DialogService.openLightbox('views/modal/scenario_templates.tpl.html', 'ScenarioTemplatesViewsCtrl',
						{templateType: type, scenarioTemplates: $scope.scenarioTemplates},
						{windowSize: 'lg', windowClass: 'scenario_templates'}
					);

				dialog.result.then(function(data) {
					createTemplate(data);
				}, function() {
					if(!$scope.onboardingState) {
						gotoProject(masterProject.uuid);
					}
				});
			}, createTemplate = function(data) {
				console.log('create template');
				console.log('create default view');
				console.log(data);
			}, gotoProject = function(uuid) {
				$state.go('Dashboard', {projectId: uuid});
			}, startWorkflow = function() {
				if(typeof $scope.templateType !== 'undefined') {
					openScenarioTemplatesCreateModal($scope.templateType);
				} else if($scope.scenarioTemplates.length === 0) {
					$scope.onboardingState = true;
				} else {
					$scope.openModulePickDialog();
				}
			};

		$scope.openModulePickDialog = function() {
			var modulePickDialog = DialogService.openLightbox('views/modal/select_module.tpl.html', 'SelectModuleCtrl',
				{modules: CONFIG.view.ScenarioTemplates.types, e2e: $scope.e2e},
				{windowSize: 'lg', windowClass: 'module_pick'});

			modulePickDialog.result.then(function(data) {
				openScenarioTemplatesCreateModal(data.selectedModule);
			}, function() {
				if(!$scope.onboardingState) {
					gotoProject(masterProject.uuid);
				}
			});
		};

		init();
	}]);
