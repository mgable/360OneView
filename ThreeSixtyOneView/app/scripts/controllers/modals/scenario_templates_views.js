'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesViewsCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "EVENTS", "data", 'ManageTemplatesService', 'DimensionService', 'ManageScenariosService',
	function($scope, $controller, $modalInstance, CONFIG, EVENTS, data, ManageTemplatesService, DimensionService, ManageScenariosService) {
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.CONFIG = CONFIG;
		// this sets the following
		// $scope.templateType, $scope.scenarioTemplates
		angular.extend($scope, data);

		ManageScenariosService.getBase($scope.templateType.label).then(function(baseScenario) {
			$scope.baseScenario = baseScenario;
				ManageTemplatesService.get(baseScenario.template.id, false).then(function(baseTemplate) {
				$scope.baseTemplate = baseTemplate;
				$scope.template.source.id = baseTemplate.id;
				$scope.dimensionsList = baseTemplate.dimensions;
				$scope.kpisList = baseTemplate.kpis;
			});
		});

		initializeTemplate($scope.templateType);
	}, initializeTemplate = function(type) {
		$scope.template = {
			name: '',
			description: '',
			type: $scope.templateType.label,
			source: {},
			dimensions: [],
			kpis: []
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

	$scope.createDraftTemplate = function() {
		if(typeof $scope.template.id === 'undefined') {
			ManageTemplatesService.create($scope.template).then(function(response) {
				$scope.template.id = response.id;
			});
		}
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
		console.log($scope.template);
		ManageTemplatesService.update($scope.template, true).then(function(response) {
			console.log(response);
			$modalInstance.close({response: response});
		});
	};

	$scope.$on(EVENTS.flipbookAllowAdvance, function(evt, data){
		$scope.enableNext = data;
	});

	init();
}]);