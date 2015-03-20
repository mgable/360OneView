/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
	.controller('ScenarioAnalysisElementFilesCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data", "MetaDataService",
	function($scope, $controller, $modalInstance, CONFIG, data, MetaDataService) {        
		angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG}));

		var init = function() {
			$scope.fileList = [];

			$scope.elementTypeItems = ['All', 'By Me', 'Favorite'];
			$scope.currentElementType = 0;

			$scope.selectedScenarioElement = data.selectedScenarioElement;
			$scope.currentItem = {id: data.selectedScenarioElement.id};
			$scope.e2e = data.e2e;

			$scope.testHandleName = 'analysisElementReplace';
			$scope.title = $scope.selectedScenarioElement.cubeMeta.label;
			$scope.subtitle = 'Select A New File';
			$scope.isDropdownHidden = true;
			$scope.cancelButtonLabel = 'Cancel';
			$scope.submitButtonLabel = 'Replace';
			$scope.dateProperty = 'lastUpdatedOn';
			$scope.ownerProperty = 'lastUpdatedBy';

			$scope.isListLoaded = false;

			MetaDataService.getCubeAnalysisElements($scope.selectedScenarioElement.cubeMeta.id).then(function(response) {
				$scope.fileList = response;
				$scope.isListLoaded = true;
			});
		};

		$scope.getList = function() {
			return $scope.fileList;
		};

		// change element type
		$scope.changeElementType = function(type) {
			$scope.currentElementType = type;
		};

		// cancel the changes and dismiss the modal
		$scope.cancel = function() {
			$scope.fileList = [];
			$modalInstance.dismiss('canceled');
		};

		// pass back the selected file and dismiss the modal
		$scope.submit = function() {
			var newFile = _.find($scope.fileList, function(file) {
				return file.id === $scope.currentItem.id;
			});
			$modalInstance.close(newFile);
		};

		init();
	}]);