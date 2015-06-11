'use strict';

angular.module('ThreeSixtyOneView')
.controller('ChooseBaseScenarioCtrl', ['$scope', 'DialogService',
function ($scope, DialogService) {
	var init = function init() {};

	$scope.openAllViewsModal = function() {
		var dialog = DialogService.openLightbox('views/modal/select_base_scenario.tpl.html', 'SelectBaseScenarioCtrl',
			{currentBaseScenario: $scope.getBaseScenario(), e2e: $scope.e2e},
			{windowSize: 'lg', windowClass: 'base-scenario-modal'});

		dialog.result.then(function(data) {
			console.log(data);
		});
	};

	init();
}]);
