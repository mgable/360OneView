'use strict';

/**
* @ngdoc function
* @name ThreeSixtyOneView.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the ThreeSixtyOneView
*/
angular.module('ThreeSixtyOneView')
	.controller('PivotBuilderCtrl', ['$scope', '$rootScope', 'EVENTS', 'DialogService', 'ManageAnalysisViewsService', 'PivotViewService',
		function ($scope, $rootScope, EVENTS, DialogService, ManageAnalysisViewsService, PivotViewService) {
	var init = function() {
			$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];
			$scope.saveAs = false;

			// loads the pivot table after page was initially loaded from the results tab
			if(!!$scope.viewData.id && $scope.pivotTableData === '') {
				$scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
			}

			$scope.dragOptions = {
				itemMoved: function() {
					$scope.saveDraftView();
				},
				orderChanged: function() {
					$scope.saveDraftView();
				},
				dragStart: function() {
					$scope.isDragging = true;
				},
				dragEnd: function() {
					$scope.isDragging = false;
				},
				containment: '#dragDropArea'
			};
		},
		rename = false;

		// $added contains added levels in rows/columns and is coming from parent controller
		$scope.deleteItem =  function(index, element) {
			PivotViewService.deleteItem($scope.viewData, $scope.added, index, element,
				[$scope.determineTimeDisability, $scope.saveDraftView, $scope.lockVariableDimension]);
		};

		$scope.addItem = function(item, element) {
			PivotViewService.addItem($scope.viewData, $scope.added, item, element,
				[$scope.determineTimeDisability, $scope.saveDraftView, $scope.lockVariableDimension]);
		};

		$scope.replaceItem = function(selected, priorLabel, element) {
			PivotViewService.replaceItem($scope.viewData, $scope.added, selected, priorLabel, element,
				[$scope.determineTimeDisability, $scope.saveDraftView, $scope.lockVariableDimension]);
		};

		// open/dismiss filters selection modal
		$scope.filtersModal = function(category) {
			var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
				{dimension: category, addedFilters: $scope.addedFilters, viewData: $scope.viewData.rows.concat($scope.viewData.columns), dimensions: $scope.dimensions},
				{windowSize: 'lg', windowClass: 'filters-modal'});

			dialog.result.then(function(data) {
				$scope.updateFilterValues(data);
				$scope.saveDraftView();
			});
		};

		// returns list of all the views in the current cube
		$scope.getViewsList = function() {
			return $scope.viewsList;
		};

		$scope.getDimensions = function() {
			return $scope.dimensions;
		};

		$scope.openAllViewsModal = function() {
			var dialog = DialogService.openLightbox('views/modal/ms_list_lightbox.tpl.html', 'AllViewsCtrl',
				{viewsList: $scope.viewsList, selectedViewId: $scope.viewData.id, e2e: $scope.e2e},
				{windowSize: 'lg', windowClass: 'list-lightbox'});

			dialog.result.then(function(data) {
				$scope.loadView($scope.cubeId, data);
			});
		};

		// returns element titles in the view: rows and columns
		$scope.getPivotBuilderItems = function() {
			return $scope.pivotBuilderItems;
		};

		$scope.getViewData = function(element) {
			return $scope.viewData[element];
		};

		// reset the view to the last saved state
		$scope.revertView = function() {
			var originalViewName, originalViewId;
			if($scope.isViewDraft()) {
				originalViewName = $scope.viewData.name.substring(8);
				originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;

				// load view automatically deletes draft view if a non-draft is loaded
				$scope.loadView($scope.cubeId, originalViewId);
			}
		};

		$scope.startSaveAs = function(name) {
			$scope.saveAsName = name;
			$scope.saveAs = true;
			rename = false;
		};

		$scope.submitSaveAs = function(evt) {
			var oldViewId = $scope.viewData.id,
				newView;

			if (evt){
				evt.stopPropagation();
			}

			if (rename) {
				$scope.viewData.name = $scope.saveAsName;
				if ($scope.isViewDraft()) {
					$scope.isViewDraft(false);
				}
				$scope.renameView($scope.cubeId, $scope.viewData);
			} else if (!rename) {
				newView = angular.copy($scope.viewData);
				newView.name = $scope.saveAsName;
				newView.isDraft = false;
				if ($scope.isViewDraft()) {
					$scope.deleteView($scope.cubeId, $scope.viewData.id);
				} else {
					ManageAnalysisViewsService.defaultView($scope.cubeId, oldViewId, false);
				}
				$scope.createView($scope.cubeId, newView);
			}

			$scope.cancelSaveAs();
		};

		$scope.cancelSaveAs = function(evt) {
			if (evt && evt.stopPropagation){
				evt.stopPropagation();
			}
			rename = false;
			$scope.saveAs = false;
		};

		$scope.startRename = function() {
			$scope.saveAsName = $scope.viewData.name;
			$scope.saveAs = true;
			rename = true;
		};

		// show table/filters section and update height for pivot table
		$scope.showTable = function(filtersVisible){
			$scope.isFiltersVisible = filtersVisible;
		};

		$scope.$on(EVENTS.tabClosed, function(){
			$scope.$apply($scope.cancelSaveAs);
		});

		$scope.$on(EVENTS.pivotViewChange, function(){
			$scope.cancelSaveAs();
		});

		init();
	}]);