'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesCtrl',['$scope', '$state', 'DialogService', 'CONFIG',
	function ($scope, $state, DialogService, CONFIG) {
		var init = function() {
			$scope.isFlipbookVisible = false;
			$scope.type = CONFIG.view.ScenarioTemplates.types[$state.params.type];
			if(typeof $scope.type === 'undefined') {
				openModulePickDialog();
			} else {
				$scope.isFlipbookVisible = true;
			}
		}, openModulePickDialog = function() {
			var modulePickDialog = DialogService.openLightbox('views/modal/module_pick.tpl.html', 'ModulePickCtrl',
				{modules: CONFIG.view.ScenarioTemplates.types, e2e: $scope.e2e},
				{windowSize: 'lg', windowClass: 'module_pick'});

			modulePickDialog.result.then(function(data) {
				console.log(data);
			});
		};

		init();
	}]);
