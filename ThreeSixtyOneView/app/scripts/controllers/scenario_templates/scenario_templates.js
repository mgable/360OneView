'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesCtrl',['$scope', '$state', 'DialogService', 'CONFIG',
	function ($scope, $state, DialogService, CONFIG) {
		var init = function() {
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
			});
		}, createTemplate = function(data) {
			console.log('create template');
			console.log('create default view');
			console.log(data);
		};

		$scope.openModulePickDialog = function() {
			var modulePickDialog = DialogService.openLightbox('views/modal/module_pick.tpl.html', 'ModulePickCtrl',
				{modules: CONFIG.view.ScenarioTemplates.types, e2e: $scope.e2e},
				{windowSize: 'lg', windowClass: 'module_pick'});

			modulePickDialog.result.then(function(data) {
				openScenarioTemplatesCreateModal(data.selectedModule);
			});
		};



		init();
	}]);
