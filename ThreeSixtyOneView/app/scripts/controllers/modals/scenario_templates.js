'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesCreateCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data",
function($scope, $controller, $modalInstance, CONFIG, data) {
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.CONFIG = CONFIG;
		$scope.currentType = data.templateType;
	};

	// pass back the selected file and dismiss the modal
	$scope.submit = function() {
		$modalInstance.close({response:'response'});
	};

	init();
}]);