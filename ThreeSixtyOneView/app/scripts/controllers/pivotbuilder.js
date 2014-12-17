'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('PivotBuilderCtrl', ['$scope', '$rootScope', 'EVENTS', '$timeout', '$q', 'pbData', 'ptData', 'PivotViewService', 'CubeService', 'DialogService', function ($scope, $rootScope, EVENTS, $timeout, $q, pbData, ptData, PivotViewService, CubeService, DialogService) {

	var init = function() {
		$scope.pbShow = false;
		$scope.pbData = angular.copy(pbData);
		$scope.draftView = false;

		// Rest APIs
		$scope.viewName = $scope.views.currentView.name;
		$scope.viewsList = $scope.views.views;
		$scope.loadView(15);
		$scope.loadDimensions();

		$scope.saveAs = false;
		$scope.rename = false;

		$scope.notifMsg = false;

		$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];

		$scope.add = {selected: ""};
		$scope.added = {};
		//$scope.addPopUp = {columns: false, rows: false};

		$scope.setUpAddedLevels($scope.views.currentView);

		$scope.selectedFilter = {cat: ''};
		$scope.addedFilter = {};
		$scope.addedFilters = {};
		$scope.filterSearch = {label: ''};

		copyFilter();

		$scope.dragOptions = {
			itemMoved: function() {
				// console.log(event);
				setDraftViewName()
				$scope.applyView();
			},
			orderChanged: function() {
				// console.log(event);
				setDraftViewName()
				$scope.applyView();
			},
			// dragStart: function(event) {
			// 	// console.log(event);
			// },
			containment: '#dragDropArea'
		};

		// $scope.identity = angular.identity();
	};

	// create the temporary filter object from the view data
	var copyFilter = function() {
		angular.forEach($scope.pbData.viewData.filters, function(val) {
			$scope.addedFilter[val.name] = {};
			angular.forEach(val.items, function(subval) {
				$scope.addedFilter[val.name][subval] = true;
			});
		});
	};

	function setDraftViewName() {
		if(!$scope.draftView) {
			$scope.draftView = true;
			$scope.viewName += ' - Draft';
		}
	}

	// create the temporary filter object from the view data
	$scope.loadFilters = function() {
		var i, j, dimensionIndex;
		$scope.addedFilters = {};

		var findTree = function(_label, _dimension, _add) {
			var i, j, add, output = {};

			add = _add || (_dimension.label === _label);

			for(i = 0; i < _dimension.members.length; i++) {
				output = angular.extend(output, findTree(_label, _dimension.members[i], add));
				// output = output.concat(findTree(_label, _dimension.members[i], add));
			}

			if(_dimension.members.length === 0 && add) {
				output[_dimension.label] = true;
			}

			return output;
		};

		for(i = 0; i < $scope.viewData.filters.length; i++) {
			$scope.addedFilters[$scope.viewData.filters[i].scope.dimension.label] = {};
			$scope.addedFilters[$scope.viewData.filters[i].scope.dimension.label]['scope'] = $scope.viewData.filters[i].scope;

			for(j = 0; j < $scope.dimensions.length; j++) {
				if($scope.viewData.filters[i].scope.dimension.id === $scope.dimensions[j].id) {
					dimensionIndex = j;
					break;
				}
			}

			if($scope.viewData.filters[i].value.specification.type === 'All') {
				angular.extend($scope.addedFilters[$scope.viewData.filters[i].scope.dimension.label], findTree($scope.viewData.filters[i].scope.level.label, $scope.dimensions[dimensionIndex], false));
			} else {
				for(j = 0; j < $scope.viewData.filters[i].value.specification.members.length; j++) {
					angular.extend($scope.addedFilters[$scope.viewData.filters[i].scope.dimension.label], findTree($scope.viewData.filters[i].value.specification.members[j].label, $scope.dimensions[dimensionIndex], false));
				}
			}
		}
	};

	// delete an item from column/row
	$scope.deleteItem =  function(index, element) {
		$scope.added[$scope.viewData[element][index].level.label] = false;
		$scope.viewData[element].splice(index, 1);

		$scope.applyView();
	};

	// check for changes in the pivot builder data
	$scope.changeMade = function() {
		return !angular.equals($scope.pbData, pbData);
	};

	// add item to row/column
	$scope.addItem = function(item, element) {
		var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
		$scope.viewData[element].push(newItem);
		$scope.added[item.level.label] = true;

		setDraftViewName();
		$scope.applyView();
	};

	$scope.replaceItem = function(selected, priorLabel, element) {
		$scope.added[priorLabel] = false;
		$scope.added[selected.level.label] = true;
		var match = _.find($scope.viewData[element], function(item) { return item.level.label == priorLabel });
		if (match) {
            match.dimension = angular.copy(selected.dimension);
            match.hierarchy = angular.copy(selected.hierarchy);
            match.level = angular.copy(selected.level);
        }

		setDraftViewName();
		$scope.applyView();
	}

	// open/dismiss filters selection modal
	$scope.filtersModal = function(category) {
		$scope.selectedFilter.cat = category;

		var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl', {selFil: $scope.selectedFilter.selFil, cat: $scope.selectedFilter.cat, addedFilters: $scope.addedFilters, viewData: $scope.viewData, dimensions: $scope.dimensions, categorizeValues: $scope.categorizeValues}, {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

		dialog.result.then(function(data) {
			$scope.addedFilters = data;

			setDraftViewName();
			$scope.applyView();
		});
	};

	// aggregate filter values based on categories
	$scope.categorizeValues = function(index, items) {
		var i, result;

		var countValues = function(category) {
			var output = {
				label: [],
				selected: 0,
				total: 0
			};
			var j, tempResult;

			if(category.members.length > 0) {
				for(j = 0; j < category.members.length; j++) {
					tempResult = countValues(category.members[j]);

					if(!tempResult) {
						return false;
					}

					if(tempResult.selected > 0 && tempResult.selected !== tempResult.total) {
						return false;
					} else if(tempResult.selected === tempResult.total) {
						output.label.push(category.members[j].label);
						output.selected++;
					}
					output.total++;
				}

			} else {
				if(items[category.label]) {
					output.selected = 1;
					output.label.push(category.label);
				}
				output.total = 1;
			}

			return output;
		};

		for(i = 0; i < $scope.dimensions[index].members.length; i++) {
			result = countValues($scope.dimensions[index].members[i]);

			if(!!result) {
				if(result.selected !== result.total) {
					return result;
				}
			}
		}
		return result;
	};

	// reset the view to the last saved state
	$scope.resetView = function() {
		$scope.pbData = angular.copy(pbData);
		$scope.notify('Changes discarded!');

		if($scope.draftView) {
			$scope.viewName = $scope.views.currentView.currentView.name;
			$scope.draftView = false;
		}

		$scope.applyView();
	};

	// save the changes in the current view
	$scope.saveView = function() {
		if($scope.changeMade()) {
			pbData = angular.copy($scope.pbData);

			if($scope.draftView) {
				$scope.viewName = $scope.views.currentView.currentView.name;
			}
			$scope.notify('Saved!');
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
					$scope.viewsList[i].name = $scope.saveAsName;
				}
			}

			$scope.renameView($scope.viewData);

			$scope.viewRecentViews = false;
			$scope.notify('Saved!');
		} else if (save && !$scope.rename) {
			$scope.viewData.name = $scope.saveAsName;
			$scope.viewData.id = null;
			$scope.createView($scope.viewData);
		}

		$scope.saveAs = false;
	};

	// display save/save as notifications on screen for a short time
	$scope.notify = function(msg) {
		$scope.titleMsg = msg;

		$scope.notifMsg = true;
		$timeout(function() {
			$scope.notifMsg = false;
		}, 3000);
	};

	// apply the changes in the pivot table
	$scope.applyView = function() {
		$scope.updateView($scope.viewData);

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
	$scope.loadView = function(viewId) {
		PivotViewService.getView(viewId).then(function(view) {
			$scope.viewData = view;
			$scope.viewName = view.name;
			$scope.setUpAddedLevels(view);
			if($scope.dimensions) {
				$scope.loadFilters();
			}
		});
	};

	// save the view
	$scope.updateView = function(view) {
		var i, j, filters = [], newFilter, values = {}, dimensionId;

		for(i = 0; i < $scope.dimensions.length; i++) {
			dimensionId = $scope.dimensions[i].id;

			newFilter = {};
			newFilter.scope = $scope.addedFilters[$scope.dimensions[i].label].scope;
			newFilter.id = i + 1;
			newFilter.value = {};
			newFilter.value.specification = {};

			values = $scope.categorizeValues(i, $scope.addedFilters[$scope.dimensions[i].label]);

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

		view.filters = filters;

		PivotViewService.updateView(view).then(function(response) {});
	};

	// rename the view
	$scope.renameView = function(view) {
		PivotViewService.renameView(view.id, view.name);
	};

	// create a new view
	$scope.createView = function(view) {
		PivotViewService.createView(view).then(function(view) {
			$scope.viewData = view;
			$scope.viewName = view.name;
			$scope.setUpAddedLevels(view);
			$scope.viewsList.push(view);
		});
	};

	// load applicable dimensions
	$scope.loadDimensions = function() {
		CubeService.getMeta().then(function(response) {
			$scope.dimensions = response;
			$scope.getViewByMembers();
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

	// get all members of all dimensions and build the dimensions tree
	$scope.getViewByMembers = function() {
		var i, j, k, count = 0, timeIndex, promise, promises = [];

		for(i = 0; i < $scope.dimensions.length; i++) {
			for(j = 0; j < $scope.dimensions[i].members.length; j++) {
				promise = CubeService.getViewByMembers($scope.dimensions[i].dimensionId, $scope.dimensions[i].members[j].levelId);
				promises.push(promise);
				if($scope.dimensions[i].type === 'TimeDimension') {
					timeIndex = i;
					break;
				}
			}
		}

		$q.all(promises).then(function(response) {
			for(i = 0; i < $scope.dimensions.length; i++) {
				for(j = 0; j < $scope.dimensions[i].members.length; j++) {
					$scope.dimensions[i].members[j].members = response[count].members;
					if($scope.dimensions[i].type === 'TimeDimension') {
						break;
					}
					count++;
				}
			}

			for(i = 1; i < $scope.dimensions[timeIndex].members.length; i++) {
				for(j = 0; j < $scope.dimensions[timeIndex].members[i - 1].members.length; j++) {
					for(k = 0; k < $scope.dimensions[timeIndex].members[i - 1].members[j].members.length; k++) {
						$scope.dimensions[timeIndex].members[i].members.push($scope.dimensions[timeIndex].members[i - 1].members[j].members[k]);
					}
				}
			}

			$scope.generateMembersList($scope.dimensions);
		});
	};

	// generate a flat list of all the members for the purpose of generating filters list
	$scope.generateMembersList = function(tree) {
		var i;
		$scope.membersList = [];

		var flattenTree = function(branch, _dimensionId, _hierarchyId, _levelId) {
			var j, newItem, hierarchyId, levelId;

			hierarchyId = _hierarchyId || branch.hierarchyId || null;
			levelId = _levelId || branch.levelId || null;

			newItem = {
				id: branch.id,
				dimensionId: _dimensionId,
				hierarchyId: hierarchyId,
				levelId: levelId
			};

			$scope.membersList[_dimensionId][branch.label] = newItem;

			for(j = 0; j < branch.members.length; j++) {
				flattenTree(branch.members[j], _dimensionId, hierarchyId, levelId);
			}
		};

		for(i = 0; i < tree.length; i++) {
			$scope.membersList[tree[i].dimensionId] = {};
			flattenTree(tree[i], tree[i].dimensionId, null, null);
		}

		$scope.loadFilters();
	};

	init();
}]).controller('pivotTableCtrl', ['$scope', 'pbData',
    function ($scope, pbData) {
        $scope.data = pbData.tableValues;
    }
]);
