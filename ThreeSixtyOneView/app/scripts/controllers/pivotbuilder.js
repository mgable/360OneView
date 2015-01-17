'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('PivotBuilderCtrl',
	['$scope', '$rootScope', 'EVENTS', '$timeout', '$q', 'PivotViewService', 'DialogService', 'PivotMetaService',
	function ($scope, $rootScope, EVENTS, $timeout, $q, PivotViewService, DialogService, PivotMetaService) {

	var init = function() {
		$scope.tabClosed = true;

		$scope.saveAs = false;
		$scope.rename = false;
		$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];

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
				$scope.dragging = true;
			},
			dragEnd: function() {
				$scope.dragging = false;
			},
			containment: '#dragDropArea'
		};
	},	deleteView = function(cubeId, viewId) { // delete a view
		PivotViewService.deleteView(viewId, cubeId).then(function() {
			$scope.viewsList = _.reject($scope.viewsList, function(view) { return view.id === viewId; });
		});
	},	updateView = function(cubeId, view) { // save the view
		_.each(view.filters, function(filter) {
			filter.id = 0;
		});
		return PivotViewService.updateView(view, cubeId).then(function(response) {
			return response;
		});
	},	renameView = function(cubeId, view) { // rename the view
		PivotViewService.renameView(view.id, cubeId, view.name).then(function(response) {
			_.each($scope.viewsList, function(item) {
				if(item.id === response.id) {
					item.name = response.name;
				}
			});
		});
	},	createView = function(cubeId, view, viewList) { // create a new view
		var i;
		$scope.viewsList = viewList;
		// remove conflicting elements from the view
		view.id = null;
		for(i = 0; i < view.filters.length; i++) {
			view.filters[i].id = null;
		}

		return PivotViewService.createView(view, cubeId).then(function(view) {
			$scope.viewData = angular.copy(view);
			$scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
			$scope.viewsList.unshift(view);
			$scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
			return view;
		});
	},	updateFilters = function() { // update view filters based on the user selections
		var i, j, filters = [], newFilter, values = {}, dimensionId;

		for(i = 0; i < $scope.dimensions.length; i++) {
			dimensionId = $scope.dimensions[i].id;

			newFilter = {};
			newFilter.scope = $scope.addedFilters[$scope.dimensions[i].label].scope;
			newFilter.id = $scope.viewData.filters[i].id;
			newFilter.value = {};
			newFilter.value.specification = {};

			values = PivotMetaService.getCategorizeValues($scope.dimensions[i], $scope.addedFilters[$scope.dimensions[i].label]);
			$scope.categorizedValue[i] = values;

			if(values.selected === values.total) {
				newFilter.value.specification.type = 'All';
			} else {
				newFilter.value.specification.type = 'Absolute';
				newFilter.value.specification.members = [];
				for(j = 0; j < values.label.length; j++) {
					newFilter.value.specification.members.push({id: $scope.membersList[dimensionId][values.label[j]].id});
				}
			}

			filters.push(newFilter);
		}

		$scope.viewData.filters = filters;
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

			updateFilters();
			$scope.saveDraftView();
			$scope.applyView();
		});
	};

	$scope.openAllViewsModal = function() {
		var dialog = DialogService.openLightbox('views/modal/pivot_builder_all_views.tpl.html', 'pivotBuilderAllViewsCtrl',
			{viewsList: $scope.viewsList, selectedViewId: $scope.viewData.id},
			{windowSize: 'lg', windowClass: 'pivotBuilderAllViewsModal'});

		dialog.result.then(function(data) {
			$scope.loadView($scope.cubeId, data);
		});
	};

	// reset the view to the last saved state
	$scope.resetView = function() {
		if($scope.draftView) {
			var originalViewName = $scope.viewData.name.substring(8);
			var originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;
			var draftViewId = $scope.viewData.id;

			$scope.loadView($scope.cubeId, originalViewId);
			deleteView($scope.cubeId, draftViewId);
			$scope.draftView = false;
		}
	};

	// save the draft view
	$scope.saveDraftView = function() {
		if(!$scope.draftView) {
			$scope.draftView = true;
			var draftView = angular.copy($scope.viewData);
			draftView.name = 'Draft - ' + draftView.name;
			createView($scope.cubeId, draftView, $scope.viewsList).then(function() {
				$scope.loadPivotTable();
			});
		} else {
			updateView($scope.cubeId, $scope.viewData).then(function() {
				$scope.loadPivotTable();
			});
		}
	};

	// save the changes in the current view
	$scope.saveView = function() {
		if($scope.draftView) {
			var originalViewName = $scope.viewData.name.substring(8);
			var originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;
			var draftViewId = $scope.viewData.id;

			$scope.viewData.name = originalViewName;
			$scope.viewData.id = originalViewId;
			updateView($scope.cubeId, $scope.viewData).then(function(view) {
				$scope.viewData = view;
				$scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
			});
			deleteView($scope.cubeId, draftViewId);
			$scope.draftView = false;
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
			createView($scope.cubeId, $scope.viewData, $scope.viewsList);
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
		// var numCols = $scope.pbData.viewData.columns.length;
		// var numRows = $scope.pbData.viewData.rows.length;
		// var i = 0,
		// 	j = 0;

		// var category = [],
		// 	item = [];

		// var totalColCount = 1;
		// var pivotCols = [];
		// var colCounter = [];

		// for(i = 0; i < numCols; i++) {
		// 	category = [];
		// 	for(j = 0; j < pbData.itemsList.length; j++) {
		// 		if(pbData.itemsList[j].label === $scope.pbData.viewData.columns[i].category) {
		// 			category.push(pbData.itemsList[j]);
		// 			break;
		// 		}
		// 	}

		// 	item = [];
		// 	for(j = 0; j < category[0].members.length; j++) {
		// 		if(category[0].members[j].label === $scope.pbData.viewData.columns[i].name) {
		// 			item.push(category[0].members[j]);
		// 			break;
		// 		}
		// 	}

		// 	totalColCount *= item[0].members.length;
		// 	pivotCols[i] = [];
		// 	for(j = 0; j < item[0].members.length; j++) {
		// 		pivotCols[i][j] = item[0].members[j].label;
		// 	}

		// 	colCounter[i] = 0;
		// }

		// var totalRowCount = 1;
		// var pivotRows = [];
		// var rowCounter = [];

		// for(i = 0; i < numRows; i++) {
		// 	category = [];
		// 	for(j = 0; j < pbData.itemsList.length; j++) {
		// 		if(pbData.itemsList[j].label === $scope.pbData.viewData.rows[i].category) {
		// 			category.push(pbData.itemsList[j]);
		// 			break;
		// 		}
		// 	}

		// 	item = [];
		// 	for(j = 0; j < category[0].members.length; j++) {
		// 		if(category[0].members[j].label === $scope.pbData.viewData.rows[i].name) {
		// 			item.push(category[0].members[j]);
		// 			break;
		// 		}
		// 	}

		// 	totalRowCount *= item[0].members.length;
		// 	pivotRows[i] = [];
		// 	for(j = 0; j < item[0].members.length; j++) {
		// 		pivotRows[i][j] = item[0].members[j].label;
		// 	}

		// 	rowCounter[i] = 0;
		// }

		// $scope.pivotTableData = [];

		// for(i = 0; i < numCols; i++) {
		// 	$scope.pivotTableData[i] = {};
		// 	for (j = 0; j < numRows; j++) {
		// 		$scope.pivotTableData[i][j] = '';
		// 	}
		// }

		// for(i = 0; i < numRows; i++) {
		// 	$scope.pivotTableData[numCols - 1][i] = $scope.pbData.viewData.rows[i].name;
		// }

		// for(i = 0; i < totalColCount; i++) {

		// 	for(j = 0; j < numCols; j++) {
		// 		$scope.pivotTableData[j][i + numRows] = pivotCols[j][colCounter[j]];
		// 	}

		// 	colCounter[numCols - 1]++;
		// 	for(j = numCols - 1; j >= 0; j--) {
		// 		if(colCounter[j] === pivotCols[j].length) {
		// 			colCounter[j] = 0;
		// 			colCounter[j - 1]++;
		// 		}
		// 	}
		// }

		// for(i = 0; i < totalRowCount; i++) {
		// 	$scope.pivotTableData[i + numCols] = {};

		// 	for(j = 0; j < numRows; j++) {
		// 		$scope.pivotTableData[i + numCols][j] = pivotRows[j][rowCounter[j]];
		// 	}

		// 	rowCounter[numRows - 1]++;
		// 	for(j = numRows - 1; j >= 0; j--) {
		// 		if(rowCounter[j] === pivotRows[j].length) {
		// 			rowCounter[j] = 0;
		// 			rowCounter[j - 1]++;
		// 		}
		// 	}
		// }

		// // $scope.spread.sheet.setDataSource($scope.pivotTableData);

		// $scope.spread.updateSheet($scope.pivotTableData, numCols, numRows, totalColCount, totalRowCount);
		// $scope.heightChanged();


		// // $scope.spread.sheet.addSpan(0,0,numCols,numRows);
		// // $scope.spread.sheet.setFrozenRowCount(numCols);
		// // $scope.spread.sheet.setFrozenColumnCount(numRows);
	};

	// show table/filters section and update height for pivot table
	$scope.showTable = function(filters){
		$scope.filterSection = filters;
		$scope.heightChanged();
	};

	// get height of the pivot table builder and broadcast is as an event for adjusting pivot table height
	$scope.heightChanged = function() {
		$timeout(function() {
			$scope.pivotBuilderHeight = angular.element.find('#pivotBuilder')[0].offsetHeight;
			$rootScope.$broadcast(EVENTS.heightChanged, $scope.pivotBuilderHeight);
        }, 400);
	};

	// load a view from the backend
	$scope.loadView = function(cubeId, viewId) {
		PivotViewService.getView(viewId, cubeId).then(function(view) {
			// remove the draft view if one exists and is not selected
			if($scope.draftView) {
				var draftId;

				_.each($scope.viewsList, function(listItem) {
					if(listItem.name.substring(0, 8) === 'Draft - ') {
						draftId = listItem.id;
					}
				});

				if(viewId !== draftId) {
					deleteView($scope.cubeId, draftId);
					$scope.draftView = false;
				}
			}

			$scope.views.currentView = view;
			$scope.viewData = view;
			$scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
			$scope.membersList = PivotMetaService.generateMembersList($scope.dimensions);
			$scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, view);
		});
	};

	init();
}]).controller('pivotTableCtrl', ['$scope', 'pbData',
    function ($scope, pbData) {
        $scope.data = pbData.tableValues;
    }
]);
