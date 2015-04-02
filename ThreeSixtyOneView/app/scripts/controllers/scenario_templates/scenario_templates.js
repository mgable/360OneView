'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesCtrl',['$scope', '$state', 'DialogService', 'CONFIG',
	function ($scope, $state, DialogService, CONFIG) {
		var init = function() {
			$scope.isFlipbookVisible = false;
			$scope.currentType = _.find(CONFIG.view.ScenarioTemplates.types, function(type) {
				return type.name === $state.params.type;
			});
			//CONFIG.view.ScenarioTemplates.types[$state.params.type];
			if(typeof $scope.currentType === 'undefined') {
				openModulePickDialog();
			} else {
				initializeTemplate($scope.currentType);
				$scope.isFlipbookVisible = true;
			}
		}, openModulePickDialog = function() {
			var modulePickDialog = DialogService.openLightbox('views/modal/module_pick.tpl.html', 'ModulePickCtrl',
				{modules: CONFIG.view.ScenarioTemplates.types, e2e: $scope.e2e},
				{windowSize: 'lg', windowClass: 'module_pick'});

			modulePickDialog.result.then(function(data) {
				console.log(data);
			});
		}, initializeTemplate = function(type) {
			$scope.template = {
				name: '',
				description: '',
				cubes: []
			};

			$scope.defaultView = {};
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
