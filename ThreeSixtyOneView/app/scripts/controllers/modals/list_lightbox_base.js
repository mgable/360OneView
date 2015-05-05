/* global _ */
'use strict';

angular.module('ThreeSixtyOneView')
.controller('ListLightboxBaseCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG",
function($scope, $controller, $modalInstance, CONFIG, data, MetaDataService) {
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG, data: {}}));

	$scope.list = [];
	$scope.isListLoaded = false;
	$scope.cancelButtonLabel = 'Cancel';
	$scope.submitButtonLabel = 'Replace';
	$scope.dateProperty = 'lastUpdatedOn';
	$scope.ownerProperty = 'lastUpdatedBy';

	$scope.getList = function() {
		return $scope.list;
	};

	// cancel the changes and dismiss the modal
	$scope.cancel = function() {
		$scope.fileList = [];
		$modalInstance.dismiss('canceled');
	};
}]);