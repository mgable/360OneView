'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesCtrl',['$scope', '$state', 'DialogService', 'CONFIG',
	function ($scope, $state, DialogService, CONFIG) {
		var init = function() {
			$scope.currentType = _.find(CONFIG.view.ScenarioTemplates.types, function(type) {
				return type.name === $state.params.type;
			});

			if(typeof $scope.currentType === 'undefined') {
				// $scope.openModulePickDialog();
			} else {
				initializeTemplate($scope.currentType);
				openScenarioTemplatesCreateModal($scope.currentType);
			}
		}, initializeTemplate = function(type) {
			$scope.template = {
				name: '',
				description: '',
				cubes: []
			};

			$scope.defaultView = {};
		}, openScenarioTemplatesCreateModal = function(type) {
			var dialog = DialogService.openLightbox('views/modal/scenario_templates.tpl.html', 'ScenarioTemplatesCreateCtrl',
				{templateType: type},
				{windowSize: 'lg', windowClass: 'scenario_templates'});

			dialog.result.then(function(data) {
				console.log(data);
			});
		};

		$scope.openModulePickDialog = function() {
			var modulePickDialog = DialogService.openLightbox('views/modal/module_pick.tpl.html', 'ModulePickCtrl',
				{modules: CONFIG.view.ScenarioTemplates.types, e2e: $scope.e2e},
				{windowSize: 'lg', windowClass: 'module_pick'});

			modulePickDialog.result.then(function(data) {
				openScenarioTemplatesCreateModal(data.selectedModule);
			});
		};

		$scope.setDefaultView = function(view) {
			$scope.defaultView = view;
		};

		$scope.createTemplate = function() {
			console.log('create template');
			console.log($scope.template);
			console.log('create default view');
			console.log($scope.defaultView);
		};

		init();
	}]);
