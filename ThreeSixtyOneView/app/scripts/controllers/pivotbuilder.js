'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('PivotBuilderCtrl', 
	['$scope', '$rootScope', 'EVENTS', '$timeout', '$q', 'pbData', 'ptData', 'PivotViewService', 'CubeService', 'DialogService', 'PivotIntermediatesService',
	function ($scope, $rootScope, EVENTS, $timeout, $q, pbData, ptData, PivotViewService, CubeService, DialogService, PivotIntermediatesService) {

	var init = function() {
		$scope.pbShow = false;
		$scope.pbData = angular.copy(pbData);
		$scope.draftView = false;

		// Rest APIs
		$scope.viewData = $scope.views.currentView;
		$scope.viewName = $scope.views.currentView.name;
		$scope.viewsList = $scope.views.views;
		var draftViewExists = _.find($scope.viewsList, function(view) {return view.name.substring(0, 8) === 'Draft - ';});
		if(!!draftViewExists) {
			$scope.loadView($scope.cubeId, draftViewExists.id);
			$scope.draftView = true;
		} else {
			$scope.loadView($scope.cubeId, $scope.viewsList[0].id);
		}

		$scope.$on(EVENTS.selectScenarioElement, function(evt, element) {
			$scope.cubeId = element.cubeMeta.id;
			loadCube(element.cubeMeta.id, element.cubeMeta.label);
		});

		$scope.saveAs = false;
		$scope.rename = false;

		$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];

		$scope.add = {selected: ''};
		$scope.added = {};

		$scope.setUpAddedLevels($scope.views.currentView);
		$scope.addedFilters = {};
		$scope.filterSearch = {label: ''};

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

			$scope.loadView($scope.cubeId, originalViewId);
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
			$scope.createView($scope.cubeId, draftView);
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
				$scope.setUpAddedLevels(view);
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
			$scope.createView($scope.cubeId, $scope.viewData);
		}

		$scope.saveAs = false;
	};

	// apply the changes in the pivot table
	$scope.applyView = function() {
		var numCols = $scope.pbData.viewData.columns.length;
		var numRows = $scope.pbData.viewData.rows.length;
		var i = 0,
			j = 0;

		var category = [],
			item = [];

		var totalColCount = 1;
		var pivotCols = [];
		var colCounter = [];

		for(i = 0; i < numCols; i++) {
			category = [];
			for(j = 0; j < pbData.itemsList.length; j++) {
				if(pbData.itemsList[j].label === $scope.pbData.viewData.columns[i].category) {
					category.push(pbData.itemsList[j]);
					break;
				}
			}

			item = [];
			for(j = 0; j < category[0].members.length; j++) {
				if(category[0].members[j].label === $scope.pbData.viewData.columns[i].name) {
					item.push(category[0].members[j]);
					break;
				}
			}

			totalColCount *= item[0].members.length;
			pivotCols[i] = [];
			for(j = 0; j < item[0].members.length; j++) {
				pivotCols[i][j] = item[0].members[j].label;
			}

			colCounter[i] = 0;
		}

		var totalRowCount = 1;
		var pivotRows = [];
		var rowCounter = [];

		for(i = 0; i < numRows; i++) {
			category = [];
			for(j = 0; j < pbData.itemsList.length; j++) {
				if(pbData.itemsList[j].label === $scope.pbData.viewData.rows[i].category) {
					category.push(pbData.itemsList[j]);
					break;
				}
			}

			item = [];
			for(j = 0; j < category[0].members.length; j++) {
				if(category[0].members[j].label === $scope.pbData.viewData.rows[i].name) {
					item.push(category[0].members[j]);
					break;
				}
			}

			totalRowCount *= item[0].members.length;
			pivotRows[i] = [];
			for(j = 0; j < item[0].members.length; j++) {
				pivotRows[i][j] = item[0].members[j].label;
			}

			rowCounter[i] = 0;
		}

		$scope.pivotTableData = [];

		for(i = 0; i < numCols; i++) {
			$scope.pivotTableData[i] = {};
			for (j = 0; j < numRows; j++) {
				$scope.pivotTableData[i][j] = '';
			}
		}

		for(i = 0; i < numRows; i++) {
			$scope.pivotTableData[numCols - 1][i] = $scope.pbData.viewData.rows[i].name;
		}

		for(i = 0; i < totalColCount; i++) {

			for(j = 0; j < numCols; j++) {
				$scope.pivotTableData[j][i + numRows] = pivotCols[j][colCounter[j]];
			}

			colCounter[numCols - 1]++;
			for(j = numCols - 1; j >= 0; j--) {
				if(colCounter[j] === pivotCols[j].length) {
					colCounter[j] = 0;
					colCounter[j - 1]++;
				}
			}
		}

		for(i = 0; i < totalRowCount; i++) {
			$scope.pivotTableData[i + numCols] = {};

			for(j = 0; j < numRows; j++) {
				$scope.pivotTableData[i + numCols][j] = pivotRows[j][rowCounter[j]];
			}

			rowCounter[numRows - 1]++;
			for(j = numRows - 1; j >= 0; j--) {
				if(rowCounter[j] === pivotRows[j].length) {
					rowCounter[j] = 0;
					rowCounter[j - 1]++;
				}
			}
		}

		// $scope.spread.sheet.setDataSource($scope.pivotTableData);

		$scope.spread.updateSheet($scope.pivotTableData, numCols, numRows, totalColCount, totalRowCount);
		$scope.heightChanged();


		// $scope.spread.sheet.addSpan(0,0,numCols,numRows);
		// $scope.spread.sheet.setFrozenRowCount(numCols);
		// $scope.spread.sheet.setFrozenColumnCount(numRows);
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

			// remove the draft view if one exists
			if($scope.draftView) {
				var draftId;

				_.each($scope.viewsList, function(listItem) {
					if(listItem.name.substring(0, 8) === 'Draft - ') {
						draftId = listItem.id;
					}
				});

				$scope.deleteView($scope.cubeId, draftId);
				$scope.draftView = false;
			}

			$scope.views.currentView = view;
			$scope.viewData = view;
			$scope.viewName = view.name;
			$scope.setUpAddedLevels(view);
			$scope.loadDimensions(cubeId).then(function() {
				$scope.addedFilters = PivotIntermediatesService.getAddedFilters($scope.viewData.filters, $scope.dimensions);
				_.each($scope.dimensions, function(_dimension) {
					_dimension.catVal = PivotIntermediatesService.getCategorizeValues(_dimension, $scope.addedFilters[_dimension.label]);
				});
			});
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
		// might need to set filter ids to zero
		return PivotViewService.updateView(view, cubeId).then(function(response) {
			return response;
		});
	};

	// rename the view
	$scope.renameView = function(cubeId, view) {
		PivotViewService.renameView(view.id, cubeId, view.name);
	};

	// create a new view
	$scope.createView = function(cubeId, view) {
		var i;

		// remove conflicting elements from the view
		view.id = null;
		for(i = 0; i < view.filters.length; i++) {
			view.filters[i].id = null;
		}

		PivotViewService.createView(view, cubeId).then(function(view) {
			$scope.viewData = view;
			$scope.viewName = view.name;
			$scope.setUpAddedLevels(view);
			$scope.viewsList.unshift(view);
			$scope.addedFilters = PivotIntermediatesService.getAddedFilters($scope.viewData.filters, $scope.dimensions);
		});
	};

	// create an initial empty view when there is no view in the cube
	var loadCube = function(cubeId, label) {
		var dimensionsPromise = $scope.loadDimensions(cubeId);
		PivotViewService.getViewsList(cubeId).then(function(list) {
			$scope.viewsList = list;
			if(list.length < 1) {
				// create an empty default view
				createInitialView(cubeId, label, dimensionsPromise);
			} else {
				// load default view
				var view = list[0];
				_.each(list, function(item) {
					if(item.isDefault) {
						view = item;
					}
				});
				$scope.loadView(cubeId, view.id);
			}
		});
	};

	var createInitialView = function(cubeId, label, dimensionsPromise) {
		dimensionsPromise.then(function(dimensions) {
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
			$scope.addedFilters = PivotIntermediatesService.getAddedFilters($scope.viewData.filters, $scope.dimensions);
			$scope.createView(cubeId, newView);
		});
	};

	// load applicable dimensions
	$scope.loadDimensions = function(cubeId) {
		return CubeService.getMeta(cubeId).then(function(dimensions) {
			// get all members of all dimensions and build the dimensions tree
			var i, j, k, count = 0, timeIndex, promises = [];

			_.each(dimensions, function(_dimension, _index) {
				_.each(_dimension.members, function(_member) {
					if(!_member.leafLevel) {
						promises.push(CubeService.getViewByMembers(cubeId, _dimension.id, _member.levelId));
						if(_dimension.type === 'TimeDimension') {
							timeIndex = _index;
						}
					}
				});
			});

			return $q.all(promises).then(function(response) {
				var timeAdded = false, lastMembers;

				_.each(dimensions, function(_dimension) {
					_.each(_dimension.members, function(_member) {
						if(!_member.leafLevel) {
							_member.members = response[count++].members;
						} else {
							_.each(lastMembers, function(_lastMember) {
								_member.members = _member.members.concat(_lastMember.members);
							});
						}
						lastMembers = _member.members;
					});
				});

				$scope.dimensions = dimensions;
				$scope.membersList = PivotIntermediatesService.generateMembersList($scope.dimensions);
			});
		});
	};

	// set up added levels
	$scope.setUpAddedLevels = function(view) {
		var i;
		$scope.added = {};

		for(i = 0; i < view.columns.length; i++) {
			$scope.added[view.columns[i].level.label] = true;
		}
		for(i = 0; i < view.rows.length; i++) {
			$scope.added[view.rows[i].level.label] = true;
		}
	};

	$scope.test = function(label) {
		console.log(label);
	};

	init();
}]).controller('pivotTableCtrl', ['$scope', 'pbData',
    function ($scope, pbData) {
        $scope.data = pbData.tableValues;
    }
]);
