/* global _ */
'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioAnalysisElementFilesCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data", "MetaDataService",
function($scope, $controller, $modalInstance, CONFIG, data, MetaDataService) {        
	angular.extend(this, $controller('ListLightboxBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.selectedScenarioElement = data.selectedScenarioElement;
		$scope.currentItem = {id: data.selectedScenarioElement.id};
		$scope.e2e = data.e2e;

		$scope.testHandleName = 'analysisElementReplace';
		$scope.title = $scope.selectedScenarioElement.cubeMeta.label;
		$scope.subtitle = 'Select A New File';
		$scope.isDropdownHidden = true;

		MetaDataService.getCubeAnalysisElements($scope.selectedScenarioElement.cubeMeta.id).then(function(response) {
			$scope.list = response;
			$scope.isListLoaded = true;
		});
	};

	// pass back the selected file and dismiss the modal
	$scope.submit = function() {
		var newFile = _.find($scope.list, function(file) {
			return file.id === $scope.currentItem.id;
		});
		$modalInstance.close(newFile);
	};

	init();
}]);