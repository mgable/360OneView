'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('PivotBuilderCtrl',
	['$scope', '$rootScope', 'EVENTS', '$timeout', '$q', 'PivotViewService', 'CubeService', 'DialogService', 'PivotIntermediatesService',
	function ($scope, $rootScope, EVENTS, $timeout, $q, PivotViewService, CubeService, DialogService, PivotIntermediatesService) {

	var init = function() {
		$scope.pbShow = false;
		$scope.draftView = false;

		// Rest APIs
		// $scope.viewData = $scope.views.currentView;
		$scope.viewName = $scope.views.currentView.name;
		// $scope.viewsList = $scope.views.views;

		// CubeService.getCubeAnalysisElements(2).then(function(response) {});

		$scope.saveAs = false;
		$scope.rename = false;

		$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];

		$scope.add = {selected: ''};
		$scope.added = {};

		$scope.added = setUpAddedLevels($scope.views.currentView);
		$scope.addedFilters = {};
		$scope.categorizedValue = [];
		$scope.filterSearch = {label: ''};

		// load cube dimensions initially and after scenario element change
		var initModel = function(cubeId, label, fnLoadView, fnCreateInitialView, scoptCubeId) {
			$scope.draftView = false;
			CubeService.buildDimensionsTree(cubeId).then(function(dimensions) {
				PivotViewService.getViewsList(cubeId).then(function(list) {
					if(list.length < 1) {
						// create an empty initial view if there are no views in the selected cube
						var i, newView = {
							name: 'Default ' + label + ' view',
							isDefault: true,
							columns: [],
							rows: [],
							filters: []
						};

						for(i = 0; i < dimensions.length; i++) {
							newView.filters.push({
								scope: {
									dimension: {id: dimensions[i].id},
									hierarchy: {id: dimensions[i].members[0].hierarchyId},
									level: {id: dimensions[i].members[0].levelId}
								},
								value: {
									specification: {type: 'All'}
								}
							});
						}

						fnCreateInitialView(cubeId, newView, list);
					} else {
						var draftView = false,
							defaultView = false;

						// check for draft or default views
						_.each(list, function(item) {
							if(item.name.substring(0, 8) === 'Draft - ') {
								draftView = item;
							} else if(item.isDefault) {
								defaultView = item;
							}
						});

						// load the proper view
						var cId = (!!draftView || !!defaultView) ? scoptCubeId : cubeId;
						var vId = !!draftView ? draftView.id : !!defaultView ? defaultView.id : list[0].id;
						fnLoadView(cId, vId, dimensions, list);
					}
				});
			});
		}

		$scope.$on(EVENTS.selectScenarioElement, function(evt, element) {
			$scope.cubeId = element.cubeMeta.id;
			initModel(element.cubeMeta.id, element.cubeMeta.label, $scope.loadView, createView, $scope.cubeId);
		});

		initModel($scope.selectedScenarioElement.cubeMeta.id, $scope.selectedScenarioElement.cubeMeta.label, $scope.loadView, createView, $scope.cubeId);
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

		// $scope.identity = angular.identity();
	};

	// delete an item from column/row
	$scope.deleteItem =  function(index, element) {
		$scope.added[$scope.viewData[element][index].level.label] = false;
		$scope.viewData[element].splice(index, 1);

		$scope.saveDraftView();
		$scope.applyView();
	};

	// check for changes in the pivot builder data
	$scope.changeMade = function() {
		return $scope.viewName.substring(0,8) === 'Draft - ';
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
		var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
			{cat: category, addedFilters: $scope.addedFilters, viewData: $scope.viewData.rows.concat($scope.viewData.columns), dimensions: $scope.dimensions},
			{windowSize: 'lg', windowClass: 'filtersSelectionModal'});

		dialog.result.then(function(data) {
			$scope.addedFilters = data;

			$scope.updateFilters();
			$scope.saveDraftView();
			$scope.applyView();
		});
	};

	// update view filters based on the user selections
	$scope.updateFilters = function() {
		var i, j, filters = [], newFilter, values = {}, dimensionId;

		for(i = 0; i < $scope.dimensions.length; i++) {
			dimensionId = $scope.dimensions[i].id;

			newFilter = {};
			newFilter.scope = $scope.addedFilters[$scope.dimensions[i].label].scope;
			newFilter.id = $scope.viewData.filters[i].id;
			newFilter.value = {};
			newFilter.value.specification = {};

			values = PivotIntermediatesService.getCategorizeValues($scope.dimensions[i], $scope.addedFilters[$scope.dimensions[i].label]);
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

	// reset the view to the last saved state
	$scope.resetView = function() {
		if($scope.draftView) {
			var originalViewName = $scope.viewName.substring(8);
			var originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;
			var draftViewId = $scope.viewData.id;

			$scope.loadView($scope.cubeId, originalViewId, $scope.dimensions);
			$scope.deleteView($scope.cubeId, draftViewId);
			$scope.draftView = false;
		}
	};

	// save the draft view
	$scope.saveDraftView = function() {
		if(!$scope.draftView) {
			$scope.draftView = true;
			var draftView = angular.copy($scope.viewData);
			draftView.name = 'Draft - ' + draftView.name;
			createView($scope.cubeId, draftView, $scope.viewsList);
		} else {
			$scope.updateView($scope.cubeId, $scope.viewData);
		}
	};

	// save the changes in the current view
	$scope.saveView = function() {
		if($scope.draftView) {
			var originalViewName = $scope.viewName.substring(8);
			var originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;
			var draftViewId = $scope.viewData.id;

			$scope.viewData.name = originalViewName;
			$scope.viewData.id = originalViewId;
			$scope.updateView($scope.cubeId, $scope.viewData).then(function(view) {
				$scope.viewData = view;
				$scope.viewName = view.name;
				$scope.added = setUpAddedLevels(view);
			});
			$scope.deleteView($scope.cubeId, draftViewId);
			$scope.draftView = false;
		}
	};

	// start save as process
	$scope.startSaveAs = function(rename) {
		$scope.saveAsName = $scope.viewName;
		$scope.saveAs = true;
		$scope.rename = rename;
	};

	// handle keyboard actions in the rename process
	$scope.renameAction = function (event) {
		if(event.keyCode === 13) {
			$scope.finishSaveAs(true);
		} else if(event.keyCode === 27) {
			$scope.finishSaveAs(false);
		}
	};

	// finish save as process
	$scope.finishSaveAs = function(save) {
		if(save && $scope.rename) {
			var i;

			$scope.viewName = $scope.saveAsName;
			$scope.draftView = false;
			
			$scope.viewData.name = $scope.saveAsName;
			for(i = 0; i < $scope.viewsList.length; i++) {
				if($scope.viewsList[i].id === $scope.viewData.id) {
					// $scope.viewsList[i].name = $scope.saveAsName;
				}
			}

			$scope.renameView($scope.viewData);

			$scope.viewRecentViews = false;
		} else if (save && !$scope.rename) {
			$scope.viewData.name = $scope.saveAsName;
			$scope.viewData.id = null;
			createView($scope.cubeId, $scope.viewData, $scope.viewsList);
		}

		$scope.saveAs = false;
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
	$scope.loadView = function(cubeId, viewId, dimensions, viewList) {

		PivotViewService.getView(viewId, cubeId).then(function(view) {
			if(viewList) {
				$scope.viewsList = viewList;
				var foundView = _.find(viewList, function(view){ return view.id == viewId; });
				if (foundView) {
					$scope.draftView = foundView.name.substring(0, 8) === 'Draft - ';
				}
			}
			// remove the draft view if one exists and is not selected
			if($scope.draftView) {
				var draftId;

				_.each($scope.viewsList, function(listItem) {
					if(listItem.name.substring(0, 8) === 'Draft - ') {
						draftId = listItem.id;
					}
				});

				if(viewId !== draftId) {
					console.log(draftId);
					$scope.deleteView($scope.cubeId, draftId);
					$scope.draftView = false;
				}
			}

			$scope.views.currentView = view;
			$scope.viewData = view;
			$scope.viewName = view.name;
			$scope.added = setUpAddedLevels(view);
			if (dimensions) {
				$scope.dimensions = dimensions;
			}
			
			$scope.membersList = PivotIntermediatesService.generateMembersList($scope.dimensions);
			$scope.addedFilters = PivotIntermediatesService.getAddedFilters(view.filters, $scope.dimensions);
			$scope.categorizedValue = PivotIntermediatesService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, view);
		});
	};

	// delete a view
	$scope.deleteView = function(cubeId, viewId) {
		PivotViewService.deleteView(viewId, cubeId).then(function() {
			$scope.viewsList = _.reject($scope.viewsList, function(view) { return view.id === viewId; });
		});
	};

	// save the view
	$scope.updateView = function(cubeId, view) {
		_.each(view.filters, function(filter) {
			filter.id = 0;
		});
		return PivotViewService.updateView(view, cubeId).then(function(response) {
			return response;
		});
	};

	// rename the view
	$scope.renameView = function(cubeId, view) {
		PivotViewService.renameView(view.id, cubeId, view.name);
	};

	// create a new view
	var createView = function(cubeId, view, viewList) {
		var i;
		$scope.viewsList = viewList;
		// remove conflicting elements from the view
		view.id = null;
		for(i = 0; i < view.filters.length; i++) {
			view.filters[i].id = null;
		}

		PivotViewService.createView(view, cubeId).then(function(view) {
			$scope.viewData = view;
			$scope.viewName = view.name;
			$scope.added = setUpAddedLevels(view);
			$scope.viewsList.unshift(view);
			$scope.addedFilters = PivotIntermediatesService.getAddedFilters(view.filters, $scope.dimensions);
		});
	};

	// set up added levels
	var setUpAddedLevels = function(view) {
		var i;
		var added = {};

		for(i = 0; i < view.columns.length; i++) {
			added[view.columns[i].level.label] = true;
		}
		for(i = 0; i < view.rows.length; i++) {
			added[view.rows[i].level.label] = true;
		}
		return added;
	};

	init();
}]).controller('pivotTableCtrl', ['$scope', 'pbData',
    function ($scope, pbData) {
        $scope.data = pbData.tableValues;
    }
]);
