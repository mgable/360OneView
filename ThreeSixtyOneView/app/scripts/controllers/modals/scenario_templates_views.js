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
			console.log(baseScenario);
			$scope.baseScenario = baseScenario;
				ManageTemplatesService.get(baseScenario.template.id, false).then(function(baseTemplate) {
				console.log(baseTemplate);
				$scope.baseTemplate = baseTemplate;
				$scope.template.source.id = baseTemplate.id;
			});
		});

		initializeTemplate($scope.templateType);
	}, initializeTemplate = function(type) {
		$scope.template = {
			name: 'testbk8',
			description: 'temp',
			type: $scope.templateType.label,
			source: {},
			dimensions: [],
			kpis: []
		};
		
		// ManageTemplatesService.create($scope.template).then(function(response) {
		// 	console.log(response);
		// });

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

	$scope.$on(EVENTS.flipbookAllowAdvance, function(evt, data){
		$scope.enableNext = data;
	});

	init();
}]);