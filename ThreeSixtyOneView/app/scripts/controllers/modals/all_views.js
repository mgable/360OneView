/* global _ */
'use strict';

angular.module('ThreeSixtyOneView')
.controller('AllViewsCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data",
function($scope, $controller, $modalInstance, CONFIG, data) {
	angular.extend(this, $controller('ListLightboxBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.list = data.viewsList;
		$scope.e2e = data.e2e;

		$scope.subtitle = 'Select A ' + (data.subTitle || 'View');
		$scope.isDropdownHidden = true;
		$scope.dateProperty = 'createdOn';
		$scope.ownerProperty = 'createdBy';
		$scope.isListLoaded = true;

		$scope.currentItem = {
			id: data.selectedViewId
		};
	};

	// pass back the selected file and dismiss the modal
	$scope.submit = function() {
		var newViewId = $scope.currentItem.id;
		$modalInstance.close(newViewId);
	};

	init();
}]);