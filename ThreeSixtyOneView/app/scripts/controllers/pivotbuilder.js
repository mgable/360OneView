'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('PivotBuilderCtrl',
	['$scope', '$rootScope', 'EVENTS', '$timeout', '$q', 'ManageAnalysisViewsService', 'DialogService', 'PivotMetaService',
	function ($scope, $rootScope, EVENTS, $timeout, $q, ManageAnalysisViewsService, DialogService, PivotMetaService) {

	var init = function() {
		$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];
		$scope.saveAs = false;
		$scope.rename = false;

		$scope.dragOptions = {
			itemMoved: function() {
				// console.log(event);
				$scope.saveDraftView();
				$scope.applyView();
			},
			orderChanged: function() {
				// console.log(event);
				$scope.saveDraftView();
				$scope.applyView();
			},
			dragStart: function() {
				$scope.isDragging = true;
			},
			dragEnd: function() {
				$scope.isDragging = false;
			},
			containment: '#dragDropArea'
		};
	},	renameView = function(cubeId, view) { // rename the view
		ManageAnalysisViewsService.renameView(view.id, cubeId, view.name).then(function(response) {
			_.each($scope.viewsList, function(item) {
				if(item.id === response.id) {
					item.name = response.name;
				}
			});
		});
	};

	// delete an item from column/row
	$scope.deleteItem =  function(index, element) {
		$scope.added[$scope.viewData[element][index].level.label] = false;
		$scope.viewData[element].splice(index, 1);

		$scope.saveDraftView();
		$scope.applyView();
	};

	// add item to row/column
	$scope.addItem = function(item, element) {
		var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
		$scope.viewData[element].push(newItem);
		$scope.added[item.label] = true;

		$scope.saveDraftView();
		$scope.applyView();
	};

	// replace the draggable item on the screen
	$scope.replaceItem = function(selected, priorLabel, element) {
		$scope.added[priorLabel] = false;
		$scope.added[selected.label] = true;
		var match = _.find($scope.viewData[element], function(item) { return item.level.label === priorLabel; });
		if (match) {
			var newItem = {dimension:{id:selected.dimensionId},hierarchy:{id:-1},level:{id:selected.levelId, label:selected.label}};
            var index = _.indexOf($scope.viewData[element], match);
            $scope.viewData[element].splice(index, 1, newItem);
        }

		$scope.saveDraftView();
		$scope.applyView();
	};

	// open/dismiss filters selection modal
	$scope.filtersModal = function(category) {
		var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
			{cat: category, addedFilters: $scope.addedFilters, viewData: $scope.viewData.rows.concat($scope.viewData.columns), dimensions: $scope.dimensions},
			{windowSize: 'lg', windowClass: 'filtersSelectionModal'});

		dialog.result.then(function(data) {
			$scope.addedFilters = data;

			$scope.viewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.viewData.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.views.currentView);
			$scope.saveDraftView();
			$scope.applyView();
		});
	};

	// returns list of all the views in the current cube
	$scope.getViewsList = function() {
		return $scope.viewsList;
	};

	// get list of the dimensions in the current cube
	$scope.getDimensions = function() {
		return $scope.dimensions;
	};

	// open the modal for the list of all views
	$scope.openAllViewsModal = function() {
		var dialog = DialogService.openLightbox('views/modal/pivot_builder_all_views.tpl.html', 'pivotBuilderAllViewsCtrl',
			{viewsList: $scope.viewsList, selectedViewId: $scope.viewData.id, e2e: $scope.e2e},
			{windowSize: 'lg', windowClass: 'pivotBuilderAllViewsModal'});

		dialog.result.then(function(data) {
			$scope.loadView($scope.cubeId, data);
		});
	};

	// returns element titles in the view: rows and columns
	$scope.getPivotBuilderItems = function() {
		return $scope.pivotBuilderItems;
	};

	// returns items in a view element
	$scope.getViewData = function(element) {
		return $scope.viewData[element];
	};

	// reset the view to the last saved state
	$scope.revertView = function() {
		if($scope.draftView) {
			var originalViewName = $scope.viewData.name.substring(8);
			var originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;
			var draftViewId = $scope.viewData.id;

			// load view automatically deletes draft view if a non-draft is loaded
			$scope.loadView($scope.cubeId, originalViewId);
		}
	};

	// start save as process
	$scope.startSaveAs = function() {
		$scope.saveAsName = $scope.viewData.name;
		$scope.saveAs = true;
		$scope.rename = false;
	};

	// submit save as process
	$scope.submitSaveAs = function() {
		$scope.viewData.name = $scope.saveAsName;

		if($scope.rename) { // if submitting
			$scope.draftView = false;
			renameView($scope.cubeId, $scope.viewData);
		} else if (!$scope.rename) {
			$scope.viewData.id = null;
			$scope.createView($scope.cubeId, $scope.viewData, $scope.viewsList);
		}

		$scope.cancelSaveAs();
	};

	// cancel the save as process
	$scope.cancelSaveAs = function() {
		$scope.rename = false;
		$scope.saveAs = false;
	};

	// start the rename process
	$scope.startRename = function() {
		$scope.saveAsName = $scope.viewData.name;
		$scope.saveAs = true;
		$scope.rename = true;
	};

	// apply the changes in the pivot table
	$scope.applyView = function() {

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

	init();
}]).controller('pivotTableCtrl', ['$scope', 'pbData',
    function ($scope, pbData) {
        $scope.data = pbData.tableValues;
    }
]);
