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
		$scope.viewData[element].push(item);
		$scope.added[item.level.label] = true;

		setDraftViewName();
		$scope.applyView();
	};

	$scope.replaceItem = function(selected, priorLabel, element) {
		$scope.added[priorLabel] = false;
		$scope.added[selected.level.label] = true;
		var match = _.find($scope.viewData[element], function(item) { return item.level.label == priorLabel });
		if (match) {
            match.dimension = selected.dimension;
            match.hierarchy = selected.hierarchy;
            match.level = selected.level;
        }

		setDraftViewName();
		$scope.applyView();
	}

	// open/dismiss filters selection modal
	$scope.filtersModal = function(category) {
		$scope.selectedFilter.cat = category;

		var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl', {selFil: $scope.selectedFilter.selFil, cat: $scope.selectedFilter.cat, addedFilter: $scope.addedFilter, pbData: $scope.pbData}, {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

		dialog.result.then(function(data) {
			$scope.pbData.viewData.filters = data;
			copyFilter();

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

		for(i = 0; i < pbData.itemsList[index].members.length; i++) {
			result = countValues(pbData.itemsList[index].members[i]);
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
		});
	};

	// save the view
	$scope.updateView = function(view) {
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

	// get all dimensions members
	$scope.getViewByMembers = function() {
		var i, j, promise, promises = [];
		$scope.membersList = [];

		for(i = 0; i < $scope.dimensions.length; i++) {
			$scope.membersList[i] = {};
			$scope.membersList[i].label = $scope.dimensions[i].label;
			$scope.membersList[i].id = $scope.dimensions[i].id;
			$scope.membersList[i].members = [];

			for(j = 0; j < $scope.dimensions[i].levels.length; j++) {
				$scope.membersList[i].members[j] = {};
				$scope.membersList[i].members[j].label = $scope.dimensions[i].levels[j].level.label;
				$scope.membersList[i].members[j].id = $scope.dimensions[i].levels[j].hierarchy.id;
				$scope.membersList[i].members[j].members = [];

				promise = CubeService.getViewByMembers($scope.membersList[i].id, $scope.membersList[i].members[j].id);
				promises.push(promise);
			}
		}

		// console.log($scope.dimensions);
		// console.log($scope.membersList);
		$q.all(promises).then(function(response) {
			// console.log(response);
		});
	};

	init();
}]).controller('pivotTableCtrl', ['$scope', 'pbData',
    function ($scope, pbData) {
        $scope.data = pbData.tableValues;
    }
]);
