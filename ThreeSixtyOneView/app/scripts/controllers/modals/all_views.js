/* global _ */
'use strict';

angular.module('ThreeSixtyOneView')
.controller('AllViewsCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data",
function($scope, $controller, $modalInstance, CONFIG, data) {
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.e2e = data.e2e;

		$scope.subtitle = 'Select A ' + (data.subTitle || 'View');
		$scope.isDropdownHidden = true;
		$scope.cancelButtonLabel = 'Cancel';
		$scope.submitButtonLabel = 'Replace';
		$scope.dateProperty = 'createdOn';
		$scope.ownerProperty = 'createdBy';
		$scope.isListLoaded = true;

		$scope.currentItem = {
			id: data.selectedViewId
		};
	},
	viewsList = data.viewsList;

	$scope.getList = function(){
		return viewsList;
	};

	// cancel the changes and dismiss the modal
	$scope.cancel = function() {
		viewsList = [];
		$modalInstance.dismiss('canceled');
	};

	// pass back the selected file and dismiss the modal
	$scope.submit = function() {
		var newViewId = $scope.currentItem.id;
		$modalInstance.close(newViewId);
	};

	init();
}]);