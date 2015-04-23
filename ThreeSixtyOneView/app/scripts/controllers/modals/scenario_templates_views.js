'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesViewsCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "EVENTS", "data", 'ManageTemplatesService', 'DimensionService', 'ManageScenariosService', 'PivotMetaService',
	function($scope, $controller, $modalInstance, CONFIG, EVENTS, data, ManageTemplatesService, DimensionService, ManageScenariosService, PivotMetaService) {
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.CONFIG = CONFIG;
		// this sets the following
		// $scope.templateType, $scope.scenarioTemplates
		angular.extend($scope, data);
		$scope.dimensions = [];

		ManageScenariosService.getBase($scope.templateType.label).then(function(baseScenario) {
			$scope.baseScenario = baseScenario;
			ManageTemplatesService.get(baseScenario.template.id, false).then(function(baseTemplate) {
				$scope.baseTemplate = baseTemplate;
				$scope.template.source.id = baseTemplate.id;
				$scope.dimensionsList = baseTemplate.dimensions;
				$scope.kpisList = baseTemplate.kpis;
				DimensionService.getDimensions(baseScenario.template.id);
				// ManageTemplatesService.buildDimensionsTree(baseScenario.template.id).then(function(dimensions) {
				// 	$scope.dimensions = dimensions;
				// 	console.log('scope dimensions:', $scope.dimensions);
				// 	// $scope.viewData = PivotMetaService.formEmptyView(dimensions, {label: 'Touchpoint'});
				// });
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

		$scope.dimensionsIsLoaded = false;
		$scope.timeGranularity = false;
		$scope.spendDimensionsLabels = '';
		$scope.kpiDimensionsLabels = '';

		$scope.performancePeriod = {
			from: null,
			to: null
		};

		$scope.addedDimensionMembers = false;
		$scope.defaultView = {};
	};

	$scope.createDraftTemplate = function() {
		if(typeof $scope.template.id === 'undefined') {
			ManageTemplatesService.create($scope.template).then(function(response) {
				$scope.template.id = response.id;
			});
		}
	};

	$scope.getTimeGranularity = function() {
		return $scope.timeGranularity;
	};

	$scope.setTimeGranularity = function(time) {
		$scope.timeGranularity = time;
	};

	$scope.getAddedDimensionMembers = function() {
		return $scope.addedDimensionMembers;
	};

	$scope.setAddedDimensionMembers = function(addedMembers) {
		$scope.addedDimensionMembers = addedMembers;
	};

	$scope.getDefaultView = function() {
		return $scope.defaultView;
	}

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
		if(!!$scope.template.id) {
			ManageTemplatesService.delete($scope.template.id);
		}
		$modalInstance.dismiss();
	};

	// pass back the selected file and dismiss the modal
	$scope.submit = function() {
		ManageTemplatesService.update($scope.template, true).then(function(templateResponse) {
			// ManageTemplatesService.createView($scope.template.id, $scope.viewData).then(function(viewResponse) {
			// 	console.log(templateResponse);
			// 	console.log(viewResponse);
			// });
			$modalInstance.close(templateResponse);
		});
	};

    $scope.$on(EVENTS.selectTime, function(evt, data) {
        $scope.timeGranularity = data;
    });

    $scope.$on(EVENTS.dimensionsIsLoaded, function(evt, data) {
        $scope.dimensionsIsLoaded = true;
        $scope.dimensions = data;
    });

	$scope.$on(EVENTS.flipbookAllowAdvance, function(evt, data){
		$scope.enableNext = data;
	});

	init();
}]);