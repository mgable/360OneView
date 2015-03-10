'use strict';

/**
* @ngdoc function
* @name ThreeSixtyOneView.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the ThreeSixtyOneView
*/
angular.module('ThreeSixtyOneView')
	.controller('PivotBuilderCtrl', ['$scope', '$rootScope', 'EVENTS', '$timeout', 'DialogService', function ($scope, $rootScope, EVENTS, $timeout, DialogService) {
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
			$scope.added[$scope.viewData[element][index].level.label] = false;
			$scope.viewData[element].splice(index, 1);
			$scope.determineTimeDisability($scope.added);
			$scope.saveDraftView();
		};

		$scope.addItem = function(item, element) {
			var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
			$scope.viewData[element].push(newItem);
			$scope.added[item.label] = true;
			$scope.determineTimeDisability($scope.added);
			$scope.saveDraftView();
		};

		$scope.replaceItem = function(selected, priorLabel, element) {
			var match, newItem, index;
			$scope.added[priorLabel] = false;
			$scope.added[selected.label] = true;
			$scope.determineTimeDisability($scope.added);
			match = _.find($scope.viewData[element], function(item) { return item.level.label === priorLabel; });
			if (match) {
				newItem = {dimension:{id:selected.dimensionId},hierarchy:{id:-1},level:{id:selected.levelId, label:selected.label}};
	            index = _.indexOf($scope.viewData[element], match);
	            $scope.viewData[element].splice(index, 1, newItem);
	        }

			$scope.saveDraftView();
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
			var dialog = DialogService.openLightbox('views/modal/all_views.tpl.html', 'AllViewsCtrl',
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
			if (evt){
				evt.stopPropagation();
			}
			$scope.viewData.name = $scope.saveAsName;

			if (rename) {
				if ($scope.isViewDraft()) {
					$scope.isViewDraft(false);
				}
				$scope.renameView($scope.cubeId, $scope.viewData);
			} else if (!rename) {
				if ($scope.isViewDraft()) {
					$scope.deleteView($scope.cubeId, $scope.viewData.id);
				}
				$scope.createView($scope.cubeId, $scope.viewData);
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
			$scope.heightChanged();
		};

		// get height of the pivot table builder and broadcast is as an event for adjusting pivot table height
		$scope.heightChanged = function() {
			$timeout(function() {
				$scope.pivotBuilderHeight = angular.element.find('#pivotBuilder')[0].offsetHeight;
				$rootScope.$broadcast(EVENTS.heightChanged, $scope.pivotBuilderHeight);
	        }, 400);
		};

		$scope.$on(EVENTS.tabClosed, function(){
			$scope.$apply($scope.cancelSaveAs);
		});

		$scope.$on(EVENTS.pivotViewChange, function(){
			$scope.cancelSaveAs();
		});

		init();
	}]);