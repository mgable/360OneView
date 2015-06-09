'use strict';

angular.module('ThreeSixtyOneView')
.controller('ChooseBaseScenarioCtrl', ['$scope', 'DialogService',
function ($scope, DialogService) {
	var init = function init() {};

	$scope.openAllViewsModal = function() {
		var dialog = DialogService.openLightbox('views/modal/select_base_scenario.tpl.html', 'AllViewsCtrl',
			{currentBaseScenario: $scope.getBaseScenario(), e2e: $scope.e2e},
			{windowSize: 'lg', windowClass: 'list-lightbox'});

		dialog.result.then(function(data) {
			console.log(data);
		});
	};

	init();
}]);
