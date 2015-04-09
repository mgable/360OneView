'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesCreateCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "EVENTS", "data", 'ManageTemplatesService', 'DimensionService', function($scope, $controller, $modalInstance, CONFIG, EVENTS, data, ManageTemplatesService, DimensionService) {
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.CONFIG = CONFIG;
		$scope.currentType = data.templateType;
		$scope.scenarioTemplates = data.scenarioTemplates;

		if(!$scope.scenarioTemplates) {
			ManageTemplatesService.getAll().then(function(response) {
				$scope.scenarioTemplates = response;
			});
		}

		initializeTemplate($scope.currentType);
	}, initializeTemplate = function(type) {
		$scope.template = {
			name: '',
			description: '',
			cubes: []
		};

		$scope.timeGranularity = '';
		$scope.spendDimensionsLabels = '';
		$scope.kpiDimensionsLabels = '';

		$scope.performancePeriod = {
			from: null,
			to: null
		};

		$scope.defaultView = {};
	};

	$scope.setTimeGranularity = function(time) {
		$scope.timeGranularity = time;
	};

	$scope.setDefaultView = function(view) {
		$scope.defaultView = view;
	};

	$scope.setPerformancePeriod = function(fromDate, toDate) {
		$scope.performancePeriod.from = fromDate;
		$scope.performancePeriod.to = toDate;
	};

	$scope.setDimensionsLabel = function(dimensions, type) {
		$scope[type + 'DimensionsLabel'] = DimensionService.getDimensionsLabel(dimensions);
	}

	$scope.cancel = function() {
		$modalInstance.dismiss();
	};

	// pass back the selected file and dismiss the modal
	$scope.submit = function() {
		$modalInstance.close({response:'response'});
	};

	$scope.$on(EVENTS.scenarioTemplatesAdvance, function(evt, data){
		$scope.enableNext = data;
	});

	init();
}]);