'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesCtrl',['$scope', '$state', 'DialogService', 'CONFIG', 'ManageTemplatesService', 'ProjectsService',
	function ($scope, $state, DialogService, CONFIG, ManageTemplatesService, ProjectsService) {
		var masterProject,
			init = function() {
				$scope.onboardingState = false;
				ManageTemplatesService.getAll().then(function(response) {
					$scope.scenarioTemplates = response;
					if(response.length === 0) {
						$scope.onboardingState = true;
					} else {
						$scope.openModulePickDialog();
					}
				});
				ProjectsService.get().then(function(response) {
					masterProject = _.find(response, function(elem){return elem.isMaster;});
				});
				$scope.currentType = _.find(CONFIG.view.ScenarioTemplates.types, function(type) {
					return type.name === $state.params.type;
				});

				if(typeof $scope.currentType !== 'undefined') {
					openScenarioTemplatesCreateModal($scope.currentType);
				}
			}, openScenarioTemplatesCreateModal = function(type, templates) {
				var scenarioTemplates = templates,
					dialog = DialogService.openLightbox('views/modal/scenario_templates.tpl.html', 'ScenarioTemplatesCreateCtrl',
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
			};

		$scope.openModulePickDialog = function() {
			var modulePickDialog = DialogService.openLightbox('views/modal/module_pick.tpl.html', 'ModulePickCtrl',
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

$scope.enableNext = true;

		init();
	}]);
