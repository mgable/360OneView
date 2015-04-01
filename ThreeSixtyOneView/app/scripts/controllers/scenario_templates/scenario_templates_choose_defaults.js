'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ScenarioTemplatesCtrl
 * @description
 * # ScenarioTemplatesCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesChooseDefaultsCtrl', ['$scope', 'PivotMetaService', 'PivotViewService', 'datepickerConfig', 'MetaDataService', 'DialogService',
	function ($scope, PivotMetaService, PivotViewService, datepickerConfig, MetaDataService, DialogService) {

	var init = function() {
			$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];
			$scope.dimensions = [];
			$scope.viewData = {};
			MetaDataService.buildDimensionsTree(1).then(function(dimensions) {
				$scope.dimensions = dimensions;
				$scope.viewData = PivotMetaService.formEmptyView(dimensions, {label: ''});
				$scope.added = PivotMetaService.setUpAddedLevels($scope.viewData.rows.concat($scope.viewData.columns));
				$scope.addedFilters = PivotMetaService.getAddedFilters($scope.viewData.filters, dimensions);
				$scope.membersList = PivotMetaService.generateMembersList(dimensions);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, dimensions, $scope.viewData);
				determineTimeDisability($scope.added);
			});

			$scope.dragOptions = {
				itemMoved: function() {
					// $scope.saveDraftView();
				},
				orderChanged: function() {
					// $scope.saveDraftView();
				},
				dragStart: function() {
					$scope.isDragging = true;
				},
				dragEnd: function() {
					$scope.isDragging = false;
				},
				containment: '#dragDropArea'
			};

			initDatePicker();
		},
		initDatePicker = function() {
			$scope.dateFormat = 'yyyy-MM-dd Week (ww)';
			$scope.fromDate = new Date();
			$scope.toDate = new Date();

			// datepicker options
			datepickerConfig.minDate = '2014-01-02';
			datepickerConfig.maxDate = '2016-01-01';
			datepickerConfig.startingDay = 1;
		},
		determineTimeDisability = function(added) {
			$scope.timeDisabled = PivotMetaService.determineTimeDisability($scope.dimensions, added);
		};

	// returns element titles in the view: rows and columns
	$scope.getPivotBuilderItems = function() {
		return $scope.pivotBuilderItems;
	};

	$scope.getFormattedDate = function(date) {
		return $filter('date')(date.getTime(),'yyyy-MM-dd');
	};

	$scope.getViewData = function(element) {
		return $scope.viewData[element];
	};

	$scope.getDimensions = function() {
		return $scope.dimensions;
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
			$scope.viewData.filters = PivotMetaService.updateFilters($scope.dimensions, newFilterData, $scope.membersList, $scope.viewData.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure(newFilterData, $scope.dimensions, $scope.viewData);
		};

		DialogService.filtersModal(category, $scope.addedFilters, $scope.viewData.rows.concat($scope.viewData.columns), $scope.dimensions, filtersModalCallback);
	};

	$scope.$on(EVENTS.moveForward, function() {
		console.log('ScenarioTemplatesChooseDefaultsCtrl');
	});

	init();
}]);
