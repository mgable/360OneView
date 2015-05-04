'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ScenarioTemplatesCtrl
 * @description
 * # ScenarioTemplatesCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesChooseDefaultsCtrl', ['$scope', 'PivotMetaService', 'PivotViewService', 'datepickerConfig', 'MetaDataService', 'DialogService', 'ManageScenariosService', 'EVENTS',
	function ($scope, PivotMetaService, PivotViewService, datepickerConfig, MetaDataService, DialogService, ManageScenariosService, EVENTS) {

	var init = function() {
			if(!$scope.spendCubeLoading) {
				$scope.spendCube = $scope.getSpendCube();
				initializeDefaultView();
				$scope.spendCubeLoaded = true;
			} else {
				$scope.spendCubeLoaded = false;
				$scope.spendCube = [];
			}
			$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];
			$scope.modelingPeriod = [];

			$scope.dragOptions = {
				itemMoved: function() {
				},
				orderChanged: function() {
				},
				dragStart: function() {
					$scope.isDragging = true;
				},
				dragEnd: function() {
					$scope.isDragging = false;
				},
				containment: '#dragDropArea'
			};

			setModelingPeriod();
		},
		determineTimeDisability = function(added) {
			$scope.timeDisabled = PivotMetaService.determineTimeDisability($scope.spendCube, added);
		},
		initializeDefaultView = function() {
			$scope.viewData = $scope.getDefaultView();
			if(!$scope.viewData.rows) {
				$scope.viewData = PivotMetaService.formEmptyView($scope.spendCube, {label: 'Touchpoint'});
			}
			
			$scope.added = PivotMetaService.setUpAddedLevels($scope.viewData.rows.concat($scope.viewData.columns));
			$scope.addedFilters = PivotMetaService.getAddedFilters($scope.viewData.filters, $scope.spendCube);
			$scope.membersList = PivotMetaService.generateMembersList($scope.spendCube);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.spendCube, $scope.viewData);
			determineTimeDisability($scope.added);
		},
		setModelingPeriod = function() {
			if($scope.template.type === 'Action') {
				ManageScenariosService.getModelingPeriod($scope.getTimeGranularityInfo().id).then(function(period) {
					$scope.modelingPeriod = period;
					$scope.fromDate = period[0];
					$scope.toDate = period[period.length - 1];
				});
			}
		};

	// returns element titles in the view: rows and columns
	$scope.getPivotBuilderItems = function() {
		return $scope.pivotBuilderItems;
	};

	$scope.getViewData = function(element) {
		return $scope.viewData[element];
	};

	$scope.getDimensions = function() {
		return $scope.spendCube;
	};

	$scope.deleteItem =  function(index, element) {
		PivotViewService.deleteItem($scope.viewData, $scope.added, index, element, [determineTimeDisability]);
	};

	$scope.addItem = function(item, element) {
		PivotViewService.addItem($scope.viewData, $scope.added, item, element, [determineTimeDisability]);
	};

	$scope.replaceItem = function(selected, priorLabel, element) {
		PivotViewService.replaceItem($scope.viewData, $scope.added, selected, priorLabel, element, [determineTimeDisability]);
	};

	$scope.filtersModal = function(category) {
		var filtersModalCallback = function(newFilterData) {
			$scope.addedFilters = newFilterData;
			$scope.viewData.filters = PivotMetaService.updateFilters($scope.spendCube, newFilterData, $scope.membersList, $scope.viewData.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure(newFilterData, $scope.spendCube, $scope.viewData);
		};

		DialogService.filtersModal(category, $scope.addedFilters, $scope.viewData.rows.concat($scope.viewData.columns), $scope.spendCube, filtersModalCallback);
	};

	$scope.isDatePickerVisible = function() {
		return $scope.templateType.label === 'Action';
	};

	$scope.setFromDate = function(period) {
		$scope.fromDate = period;
	};

	$scope.setToDate = function(period) {
		$scope.toDate = period;
	};

	$scope.$on(EVENTS.flipbookAdvance, function() {
		$scope.setDefaultView($scope.viewData);
		$scope.setPerformancePeriod($scope.fromDate, $scope.toDate);
	});

	$scope.$on(EVENTS.spendCubeIdLoaded, function(event, spendCube) {
		$scope.spendCube = spendCube;
		initializeDefaultView();
		$scope.spendCubeLoaded = true;
	});

	init();
}]);
