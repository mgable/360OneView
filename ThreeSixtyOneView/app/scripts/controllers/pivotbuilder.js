'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('PivotBuilderCtrl', ['$scope', '$rootScope', 'EVENTS', '$timeout', '$filter', 'pbData', 'ptData', 'PivotViewService', 'Views', 'DialogService', function ($scope, $rootScope, EVENTS, $timeout, $filter, pbData, ptData, PivotViewService, Views, DialogService) {

	var init = function() {
		$scope.pbShow = false;
		$scope.pbData = angular.copy(pbData);
		$scope.draftView = false;

		// Rest APIs
		$scope.viewName = Views.currentView.name;
		$scope.viewsList = Views.views;
		// console.log(PivotViewService.createView({name: "View from JS", isDefault: false, rows: [{dimension: {id: 1}, hierarchy: {id: -1}, level: {id: 2}}], columns: [{dimension: {id: 2}, hierarchy: {id: -1}, level: {id: 2}}], filters: []}));

		$scope.saveAs = false;

		$scope.notifMsg = false;

		$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];

		$scope.add = {selected: ""};
		$scope.added = {};
		$scope.addPopUp = {columns: false, rows: false};

		angular.forEach($scope.pbData.viewData.columns, function(val) {
			$scope.added[val.name] = true;
		});
		angular.forEach($scope.pbData.viewData.rows, function(val) {
			$scope.added[val.name] = true;
		});

		$scope.selectedFilter = {cat: ''};
		$scope.addedFilter = {};
		$scope.filterSearch = {label: ''};

		copyFilter();

		$scope.dragOptions = {
			itemMoved: function() {
				// console.log(event);
				if(!$scope.draftView) {
					$scope.draftView = true;
					$scope.viewName += ' - Draft';
				}
				$scope.applyView();
			},
			orderChanged: function() {
				// console.log(event);
				if(!$scope.draftView) {
					$scope.draftView = true;
					$scope.viewName += ' - Draft';
				}
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

	// delete an item from column/row
	$scope.deleteItem =  function(itemName, dim) {
		var itemInd = -1;
		for(var i = 0, n = $scope.pbData.viewData[dim].length; i < n; i++) {
			if($scope.pbData.viewData[dim][i].name === itemName) {
				itemInd = i;
				break;
			}
		}

		if(itemInd > -1) {
			$scope.pbData.viewData[dim].splice(itemInd, 1);
			$scope.added[itemName] = false;

			if(!$scope.draftView) {
				$scope.draftView = true;
				$scope.viewName += ' - Draft';
			}
			$scope.applyView();
		}
	};

	// check for changes in the pivot builder data
	$scope.changeMade = function() {
		return !angular.equals($scope.pbData, pbData);
	};

	// add item to row/column
	$scope.addItem = function(item, category) {
		var val = {category: category, name: item};

		if($scope.add.replaceItem > -1) {
			$scope.added[$scope.pbData.viewData[$scope.add.selected][$scope.add.replaceItem].name] = false;
			$scope.pbData.viewData[$scope.add.selected].splice($scope.add.replaceItem, 1, val);
		} else {
			$scope.pbData.viewData[$scope.add.selected].push(val);
		}

		$scope.added[item] = true;

		$scope.addPopUp[$scope.add.selected] = !$scope.addPopUp[$scope.add.selected];

		if(!$scope.draftView) {
			$scope.draftView = true;
			$scope.viewName += ' - Draft';
		}
		$scope.applyView();
	};

	// set up the add row/column pop-up location
	$scope.popUpLocSet = function($event) {
		var top = $event.target.offsetTop - (document.body.scrollTop || window.pageYOffset || 0),
			left = $event.target.offsetLeft;
		$scope.popUpLoc = {top: top, left: left - 150};
	};

	// display/hide add/replace items pop up
	$scope.itemModifyPopUp = function(pivotBuilderItem, replaceIndex, $event) {
		$scope.add.replaceItem = replaceIndex;
		$scope.addPopUp[pivotBuilderItem.other] = false;
		$scope.addPopUp[pivotBuilderItem.name] = !$scope.addPopUp[pivotBuilderItem.name];
		$scope.add.selected = pivotBuilderItem.name;
		$scope.popUpLocSet($event);
	};

	// open/dismiss filters selection modal
	$scope.filtersModal = function(category) {
		$scope.selectedFilter.cat = category;

		var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl', {selFil: $scope.selectedFilter.selFil, cat: $scope.selectedFilter.cat, addedFilter: $scope.addedFilter, pbData: $scope.pbData}, {windowSize: 'lg', windowClass: 'filtersSelectionModal'});
		
		dialog.result.then(function(data) {
			$scope.pbData.viewData.filters = data;
			copyFilter();

			if(!$scope.draftView) {
				$scope.draftView = true;
				$scope.viewName += ' - Draft';
			}
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
			$scope.viewName = Views.currentView.name;
			$scope.draftView = false;
		}

		$scope.applyView();
	};

	// save the changes in the current view
	$scope.saveView = function() {
		if($scope.changeMade()) {
			pbData = angular.copy($scope.pbData);

			if($scope.draftView) {
				$scope.viewName = Views.currentView.name;
			}
			$scope.notify('Saved!');
			$scope.draftView = false;
		}
	};

	// start save as process
	$scope.startSaveAs = function() {
		$scope.saveAsName = $scope.viewName;
		$scope.saveAs = true;
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
		if(save) {
			$scope.viewName = $scope.saveAsName;
			$scope.draftView = false;
			// $scope.saveView();

			$scope.notify('Saved!');
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

	$scope.showTable = function(){
		$scope.filterSection = false;
		$scope.heightChanged();
	};

	$scope.showFilters = function(){
		$scope.filterSection = true;
		$scope.heightChanged();
	}

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
