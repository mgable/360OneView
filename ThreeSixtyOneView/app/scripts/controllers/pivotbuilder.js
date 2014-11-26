'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('PivotBuilderCtrl', function ($scope, $rootScope, EVENTS, $timeout, $filter, pbData, ptData, Views) {

	console.info("Views");
	console.info(Views);

	var init = function() {
		$scope.pbShow = false;
		$scope.pbData = angular.copy(pbData);
		$scope.viewName = pbData.viewData.name;
		$scope.draftView = false;

		$scope.viewApplied = true;

		$scope.saveAs = false;
		$scope.alertOpacity = 0;

		$scope.notifMsg = false;

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
		$scope.toAddFilter = {};
		$scope.addedFilter = {};
		$scope.filterCollapse = {};
		$scope.filterSearch = {label: ''};

		copyFilter();

		$scope.undoList = [];
		$scope.undoPerformed = true;
		$scope.$watch('pbData.viewData', function(newVal, oldVal) {
			if($scope.undoPerformed) {
				$scope.undoPerformed = false;
			} else {
				$scope.undoList.push(oldVal);
				$scope.viewApplied = false;
			}
		}, true);

		$scope.dragOptions = {
			itemMoved: function(event) {
				// console.log(event);
				if(!$scope.draftView) {
					$scope.draftView = true;
					$scope.viewName += " - Draft";
				}
				$scope.applyView();
			},
			orderChanged: function(event) {
				// console.log(event);
				if(!$scope.draftView) {
					$scope.draftView = true;
					$scope.viewName += " - Draft";
				}
				$scop
				$scope.applyView();
			},
			dragStart: function(event) {
				// console.log(event);
			},
			containment: '#dragDropArea'
		};

		$scope.identity = angular.identity();
	};

	// delete an item from column/row
	$scope.delItem =  function(itemName, dim) {
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

			if($scope.changeMade()) {
				$scope.viewName += " - Draft";
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

		if(!$scope.changeMade()) {
			$scope.viewName += " - Draft";
		}
		$scope.applyView();
	};

	// set up the add row/column pop-up location
	$scope.popUpLocSet = function($event) {
		var top = $event.target.offsetTop - (document.body.scrollTop || window.pageYOffset || 0),
			left = $event.target.offsetLeft;
		console.log(left);
		$scope.popUpLoc = {top: top, left: left};
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

	// make the temporary changes in the filters
	$scope.changeFilter = function() {
		angular.forEach($scope.pbData.viewData.filters, function(val) {
			val.items = [];
			angular.forEach($scope.addedFilter[val.name], function(subval, subkey) {
				if(subval) {
					val.items.push(subkey);
				}
			});
		});
	};

	// cancel the made changes to the filter
	$scope.cancelChangeFilter = function() {
		$scope.filterSearch = {label: ''};
		$scope.filterCollapse = {};
		copyFilter();
	};

	// calculate the count of items in each filter based on the category or all
	$scope.filterCount = function(obj, cat, fltr) {
		var count = 0,
			filterLowerCase = angular.lowercase(fltr);

		if(!cat) {
			angular.forEach(obj, function(val, key) {
				if(val && (key.toLowerCase().indexOf(filterLowerCase) > -1)) {
					count++;
				}
			});
		} else {
			angular.forEach(obj, function(val, key) {
				for(var i = 0; i < cat.length; i++) {
					if (cat[i].label.indexOf(key) > -1 && (key.toLowerCase().indexOf(filterLowerCase) > -1) && val) {
						count++;
					}
				}
			});
		}
		return count;
	};

	// select/deselect all values in a view considering the search value
	$scope.allFilters = function(fltr) {
		var value = false;

		if($scope.filterCount($scope.addedFilter[$scope.selectedFilter.cat.label], false, fltr) < $scope.totalFilterCount($scope.selectedFilter.cat.members[$scope.selectedFilter.cat.members.length - 1].members, fltr)) {
			value = true;
		} else {
			value = false;
		}

		angular.forEach($scope.selectedFilter.cat.subitems[$scope.selectedFilter.cat.subitems.length - 1].subsubitems[0].values, function(val) {
			if(val.toLowerCase().indexOf(angular.lowercase(fltr)) > -1) {
				$scope.addedFilter[$scope.selectedFilter.cat.label][val] = value;
			}
		});
	};

	// calculate total items in a view considering the search value
	$scope.totalFilterCount = function(items, fltr) {
		var filteredItems = $filter('filter')(items, fltr);

		if(!!filteredItems) {
			return filteredItems.length;
		}
		return 0;
	};

	// select all filter values in a category
	$scope.allCategoryFilters = function(values, fltr) {
		var containsAll = true,
			current = [];

		for(var key in $scope.addedFilter[$scope.selectedFilter.cat.label]) {
			if($scope.addedFilter[$scope.selectedFilter.cat.label][key] && (angular.lowercase(key).indexOf(angular.lowercase(fltr)) > -1)) {
				current.push(key);
			}
		}

		var filterValues = $filter('filter')(values, fltr);

		for(var i = 0, n = filterValues.length; i < n; i++) {
			if(current.indexOf(filterValues[i].label) < 0) {
				containsAll = false;
				break;
			}
		}

		if(containsAll) {
			for(i = 0, n = filterValues.length; i < n; i++) {
				$scope.addedFilter[$scope.selectedFilter.cat.label][filterValues[i].label] = false;
			}
		} else {
			for(i = 0, n = filterValues.length; i < n; i++) {
				$scope.addedFilter[$scope.selectedFilter.cat.label][filterValues[i].label] = true;
			}
		}
	};

	// expand the filter categories after typing in the search fields
	$scope.expandCategories = function(cat, search) {
		if(search.values === '') {
			return false;
		}

		var results = $filter('filter')(cat, search, false);
		for(var i = 0, n = results.length; i < n; i++) {
			$scope.filterCollapse[results[i].label] = true;
		}
	};

	// choose the view based on added items in the column/row
	$scope.chooseViewBy = function(items) {
		for(var i = 0; i < items.length; i++) {
			for(var j = 0; j < $scope.pbData.viewData.columns.length; j++) {
				if(items[i].label === $scope.pbData.viewData.columns[j].name) {
					$scope.searchFilters(items[i], $scope.filterSearch);
					return items[i];
				}
			}

			for(j = 0; j < $scope.pbData.viewData.rows.length; j++) {
				if(items[i].label === $scope.pbData.viewData.rows[j].name) {
					$scope.searchFilters(items[i], $scope.filterSearch);
					return items[i];
				}
			}
		}

		$scope.searchFilters(items[0], $scope.filterSearch);
		return items[0];
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
			var j, k, tempResult;

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
		$scope.applyView();
	};

	// close the slider (pivot table view builder)
	$scope.closeSlider = function() {
		if($scope.viewApplied) {
			$scope.pbShow = false;
			$scope.undoList = [];
		} else {
			if($scope.alertOpacity > 0) {
				$scope.resetView();
				$scope.viewApplied = true;
				$scope.pbShow = false;
				$scope.alertOpacity = 0;
				$scope.undoList = [];
			} else {
				$scope.alertOpacity = 1;
			}
		}
	};

	// save the changes in the current view
	$scope.saveView = function() {
		if($scope.changeMade()) {
			pbData = angular.copy($scope.pbData);
			$scope.viewName = pbData.viewData.name;
			$scope.notify('Saved!');
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
			$scope.cancelSaveAs();
		}
	};

	// finish save as process
	$scope.finishSaveAs = function(save) {
		if(save) {
			$scope.viewName = $scope.saveAsName;
			$scope.saveView();

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


		$scope.viewApplied = true;
	};

	// undo one change at a time
	$scope.undoViewChange = function() {
		if($scope.undoList.length === 0) {
			return false;
		}

		$scope.pbData.viewData = $scope.undoList.pop();

		$scope.added = [];

		angular.forEach($scope.pbData.viewData.columns, function(val) {
			$scope.added[val.name] = true;
		});
		angular.forEach($scope.pbData.viewData.rows, function(val) {
			$scope.added[val.name] = true;
		});

		$scope.undoPerformed = true;
		$scope.viewApplied = false;
	};

	// search filter values
	$scope.searchFilters = function(obj, search) {
		if(!obj) {
			return null;
		}

		var output;

		var treeSearch = function(tree, searchLabel) {
			var output = {
				label: tree.label
			};

			if(tree.members.length > 0) {
				for(var i = 0; i < tree.members.length; i++) {
					var results = treeSearch(tree.members[i], searchLabel);
					if(results && results.members) {
						if(!output.members) {
							output.members = [];
						}
						output.members.push(results);
					}
				}
			} else {
				if(angular.lowercase(tree.label).indexOf(angular.lowercase(searchLabel)) > -1) {
					return tree;
				} else {
					return null;
				}
			}
			return output;
		};

		output = treeSearch(obj, search.label);

		$scope.searchResults = output;
	};

	// handle select/deselect of visible/invisible filter search values
	$scope.selectFilters = function(category, visible, add) {
		var i = 0,
			val;

		var getFilters = function(list) {
			var output = [],
				i = 0;

			if(list.members.length > 0) {
				for(i = 0; i < list.members.length; i++) {
					output = output.concat(getFilters(list.members[i]));
				}
			} else {
				return [list.label];
			}

			return output;
		};

		var list = getFilters($scope.searchResults);

		if(visible) {
			for(i = 0; i < list.length; i++) {
				$scope.addedFilter[category][list[i]] = add;
			}
		} else {
			for(val in $scope.addedFilter[category]) {
				if($scope.addedFilter[category][val] && list.indexOf(val) === -1) {
					$scope.addedFilter[category][val] = add;
				}
			}
		}
	};

	$scope.heightChanged = function() {

		$timeout(function() {
			$scope.pivotBuilderHeight = angular.element.find('#pivotBuilder')[0].offsetHeight;
			$rootScope.$broadcast(EVENTS.heightChanged, $scope.pivotBuilderHeight);
        }, 400);

	};

	init();
}).controller('pivotTableCtrl', ['$scope', 'pbData',
    function ($scope, pbData) {
        $scope.data = pbData.tableValues;
    }
]).factory('pbData', function () {
	return {
		viewsList: [
			{name: 'Joe\'s View',id: '1'},
			{name: 'Fiesta 2015',id: '2'},
			{name: 'Region by nameplate 2013',id: '3'},
			{name: 'Behrooz\'s View',id: '4'}
		],
		itemsList: [
			{
				label: 'Touchpoint',
				members: [
					{
						label: 'National/Local Spend',
						members: [
							{
								label: 'National',
								members: [
									{
										label: 'National Magazine Brand',
										members: []
									},{
										label: 'National Magazine Nameplate',
										members: []
									},{
										label: 'National Newspaper Brand',
										members: []
									},{
										label: 'National Newspaper Nameplate',
										members: []
									},{
										label: 'National TV Cable Brand',
										members: []
									},{
										label: 'National TV Cable Nameplate',
										members: []
									},{
										label: 'National TV Network Brand',
										members: []
									},{
										label: 'National TV Network Nameplate',
										members: []
									}
								]
							},{
								label: 'Local',
								members: [
									{
										label: 'Local Newspaper Brand',
										members: []
									},{
										label: 'Local Online Display Brand',
										members: []
									},{
										label: 'Local OOH Brand',
										members: []
									},{
										label: 'Local Paid Search Brand',
										members: []
									},{
										label: 'Local Radio Brand',
										members: []
									},{
										label: 'Local Sponsorship Brand',
										members: []
									},{
										label: 'Local TV Brand',
										members: []
									},{
										label: 'Local Newspaper Nameplate',
										members: []
									},{
										label: 'Local Online Display Nameplate',
										members: []
									},{
										label: 'Local OOH Nameplate',
										members: []
									},{
										label: 'Local Radio Nameplate',
										members: []
									},{
										label: 'Local TV Nameplate',
										members: []
									}
								]
							}
						]
					},{
						label: 'Brand/Nameplate Spend',
						members: [
							{
								label: 'Brand',
								members: [
									{
										label: 'National Magazine Brand',
										members: []
									},{
										label: 'Local Newspaper Brand',
										members: []
									},{
										label: 'National Newspaper Brand',
										members: []
									},{
										label: 'Local Online Display Brand',
										members: []
									},{
										label: 'Local OOH Brand',
										members: []
									},{
										label: 'Local Paid Search Brand',
										members: []
									},{
										label: 'Local Radio Brand',
										members: []
									},{
										label: 'Local Sponsorship Brand',
										members: []
									},{
										label: 'National TV Cable Brand',
										members: []
									},{
										label: 'Local TV Brand',
										members: []
									},{
										label: 'National TV Network Brand',
										members: []
									}
								]
							},{
								label: 'Nameplate',
								members: [
									{
										label: 'National Magazine Nameplate',
										members: []
									},{
										label: 'National Newspaper Nameplate',
										members: []
									},{
										label: 'National TV Cable Nameplate',
										members: []
									},{
										label: 'National TV Network Nameplate',
										members: []
									},{
										label: 'Local Newspaper Nameplate',
										members: []
									},{
										label: 'Local Online Display Nameplate',
										members: []
									},{
										label: 'Local OOH Nameplate',
										members: []
									},{
										label: 'Local Radio Nameplate',
										members: []
									},{
										label: 'Local TV Nameplate',
										members: []
									}
								]
							}
						]
					},{
						label: 'Channel',
						members: [
							{
								label: 'Magazine', members: [
									{
										label: 'National Magazine Brand',
										members: []
									},{
										label: 'National Magazine Nameplate',
										members: []
									}
								]
							},{
								label: 'Newspaper',
								members: [
									{
										label: 'Local Newspaper Brand',
										members: []
									},{
										label: 'National Newspaper Brand',
										members: []
									},{
										label: 'National Newspaper Nameplate',
										members: []
									},{
										label: 'Local Newspaper Nameplate',
										members: []
									}
								]
							},{
								label: 'Online',
								members: [
									{
										label: 'Local Online Display Brand',
										members: []
									},{
										label: 'Local Online Display Nameplate',
										members: []
									}
								]
							},{
								label: 'OOH',
								members: [
									{
										label: 'Local OOH Brand',
										members: []
									},{
										label: 'Local OOH Nameplate',
										members: []
									}
								]
							},{
								label: 'Paid',
								members: [
									{
										label: 'Local Paid Search Brand',
										members: []
									}
								]
							},{
								label: 'Radio',
								members: [
									{
										label: 'Local Radio Brand',
										members: []
									},{
										label: 'Local Radio Nameplate',
										members: []
									}
								]
							},{
								label: 'Sponsorship',
								members: [
									{
										label: 'Local Sponsorship Brand',
										members: []
									}
								]
							},{
								label: 'TV',
								members: [
									{
										label: 'National TV Cable Brand',
										members: []
									},{
										label: 'National TV Cable Nameplate',
										members: []
									},{
										label: 'Local TV Brand',
										members: []
									},{
										label: 'National TV Network Brand',
										members: []
									},{
										label: 'National TV Network Nameplate',
										members: []
									},{
										label: 'Local TV Nameplate',
										members: []
									}
								]
							}
						]
					},{
						label: 'Leaf Touchpoints',
						members: [
							{
								label: 'National Magazine Brand',
								members: []
							},{
								label: 'National Magazine Nameplate',
								members: []
							},{
								label: 'Local Newspaper Brand',
								members: []
							},{
								label: 'National Newspaper Brand',
								members: []
							},{
								label: 'National Newspaper Nameplate',
								members: []
							},{
								label: 'Local Online Display Brand',
								members: []
							},{
								label: 'Local OOH Brand',
								members: []
							},{
								label: 'Local Paid Search Brand',
								members: []
							},{
								label: 'Local Radio Brand',
								members: []
							},{
								label: 'Local Sponsorship Brand',
								members: []
							},{
								label: 'National TV Cable Brand',
								members: []
							},{
								label: 'National TV Cable Nameplate',
								members: []
							},{
								label: 'Local TV Brand',
								members: []
							},{
								label: 'National TV Network Brand',
								members: []
							},{
								label: 'National TV Network Nameplate',
								members: []
							},{
								label: 'Local Newspaper Nameplate',
								members: []
							},{
								label: 'Local Online Display Nameplate',
								members: []
							},{
								label: 'Local OOH Nameplate',
								members: []
							},{
								label: 'Local Radio Nameplate',
								members: []
							},{
								label: 'Local TV Nameplate',
								members: []
							}
						]
					}
				]
			},{
				label: 'Nameplate',
				members: [
					{
						label: 'Nameplate Groups',
						members: [
							{
								label: 'Car',
								members: [
									{
										label: 'Focus',
										members: []
									},{
										label: 'Taurus',
										members: []
									},{
										label: 'Mustang',
										members: []
									},{
										label: 'Fiesta',
										members: []
									},{
										label: 'Fusion',
										members: []
									}
								]
							},{
								label: 'Truck',
								members: [
									{
										label: 'F-Series',
										members: []
									},{
										label: 'E-Series',
										members: []
									},{
										label: 'Transit',
										members: []
									}
								]
							},{
								label: 'Utility',
								members: [
									{
										label:'Escape',
										members: []
									},{
										label:'Expedition',
										members: []
									},{
										label:'Explorer',
										members: []
									},{
										label:'Edge',
										members: []
									},{
										label:'Flex',
										members: []
									}
								]
							},{
								label: 'Brand',
								members: [
									{
										label: 'Brand',
										members: []
									}
								]
							}
						]
					},{
						label: 'Nameplates',
						members: [
							{
								label: 'Focus',
								members: []
							},{
								label: 'Taurus',
								members: []
							},{
								label: 'Mustang',
								members: []
							},{
								label: 'Fiesta',
								members: []
							},{
								label: 'Fusion',
								members: []
							},{
								label: 'F-Series',
								members: []
							},{
								label: 'E-Series',
								members: []
							},{
								label: 'Transit',
								members: []
							},{
								label: 'Escape',
								members: []
							},{
								label: 'Expedition',
								members: []
							},{
								label: 'Explorer',
								members: []
							},{
								label: 'Edge',
								members: []
							},{
								label: 'Flex',
								members: []
							},{
								label: 'Brand',
								members: []
							}
						]
					}
				]
			},{
				label: 'Region',
				members: [
					{
						label: 'Region',
						members: [
							{
								label: 'Southeast',
								members: [
									{
										label: 'Atlanta',
										members: []
									},{
										label: 'Miami',
										members: []
									},{
										label: 'Charlotte',
										members: []
									},{
										label: 'Orlando',
										members: []
									}
								]
							},{
								label: 'West',
								members: [
									{
										label: 'Denver',
										members: []
									},{
										label: 'Los Angeles',
										members: []
									},{
										label: 'Seattle',
										members: []
									},{
										label: 'Phoenix',
										members: []
									},{
										label: 'San Francisco',
										members: []
									}
								]
							},{
								label: 'Central',
								members: [
									{
										label: 'Kansas City',
										members: []
									},{
										label: 'Memphis',
										members: []
									},{
										label: 'Houston',
										members: []
									},{
										label: 'Dallas',
										members: []
									}
								]
							},{
								label: 'Great Lakes',
								members: [
									{
										label: 'Chicago',
										members: []
									},{
										label: 'Pittsburgh',
										members: []
									},{
										label: 'Cincinnati',
										members: []
									},{
										label: 'Detroit',
										members: []
									},{
										label: 'Twin Cities',
										members: []
									}
								]
							},{
								label: 'Northeast',
								members: [
									{
										label: 'Washington',
										members: []
									},{
										label: 'New York',
										members: []
									},{
										label: 'Boston',
										members: []
									},{
										label: 'Philadelphia',
										members: []
									}
								]
							},{
								label: 'National',
								members: [
									{
										label: 'National',
										members: []
									}
								]
							}
						]
					},{
						label: 'City',
						members: [
							{
								label: 'Atlanta',
								members: []
							},{
								label: 'Miami',
								members: []
							},{
								label: 'Charlotte',
								members: []
							},{
								label: 'Orlando',
								members: []
							},{
								label: 'Denver',
								members: []
							},{
								label: 'Los Angeles',
								members: []
							},{
								label: 'Seattle',
								members: []
							},{
								label: 'Phoenix',
								members: []
							},{
								label: 'San Francisco',
								members: []
							},{
								label: 'Kansas City',
								members: []
							},{
								label: 'Memphis',
								members: []
							},{
								label: 'Houston',
								members: []
							},{
								label: 'Dallas',
								members: []
							},{
								label: 'Chicago',
								members: []
							},{
								label: 'Pittsburgh',
								members: []
							},{
								label: 'Cincinnati',
								members: []
							},{
								label: 'Detroit',
								members: []
							},{
								label: 'Twin Cities',
								members: []
							},{
								label: 'Washington',
								members: []
							},{
								label: 'New York',
								members: []
							},{
								label: 'Boston',
								members: []
							},{
								label: 'Philadelphia',
								members: []
							},{
								label: 'National',
								members: []
							}
						]
					}
				]
			},{
				label: 'Time',
				members: [
					{
						label: 'Years',
						members: [
							{
								label: '2013',
								members: [
									{
										label: 'Q1 2013',
										members: [
											{
												label: 'January 2013',
												members: []
											},{
												label: 'February 2013',
												members: []
											},{
												label: 'March 2013',
												members: []
											}
										]
									},{
										label: 'Q2 2013',
										members: [
											{
												label: 'April 2013',
												members: []
											},{
												label: 'May 2013',
												members: []
											},{
												label: 'June 2013',
												members: []
											}
										]
									},{
										label: 'Q3 2013',
										members: [
											{
												label: 'July 2013',
												members: []
											},{
												label: 'August 2013',
												members: []
											},{
												label: 'September 2013',
												members: []
											}
										]
									},{
										label: 'Q4 2013',
										members: [
											{
												label: 'October 2013',
												members: []
											},{
												label: 'November 2013',
												members: []
											},{
												label: 'December 2013',
												members: []
											}
										]
									}
								]
							},{
								label: '2014',
								members: [
									{
										label: 'Q1 2014',
										members: [
											{
												label: 'January 2014',
												members: []
											},{
												label: 'February 2014',
												members: []
											},{
												label: 'March 2014',
												members: []
											}
										]
									},{
										label: 'Q2 2014',
										members: [
											{
												label: 'April 2014',
												members: []
											},{
												label: 'May 2014',
												members: []
											},{
												label: 'June 2014',
												members: []
											}
										]
									},{
										label: 'Q3 2014',
										members: [
											{
												label: 'July 2014',
												members: []
											},{
												label: 'August 2014',
												members: []
											},{
												label: 'September 2014',
												members: []
											}
										]
									},{
										label: 'Q4 2014',
										members: [
											{
												label: 'October 2014',
												members: []
											},{
												label: 'November 2014',
												members: []
											},{
												label: 'December 2014',
												members: []
											}
										]
									}
								]
							}
						]
					},{
						label: 'Quarters',
						members: [
							{
								label: 'Q1 2013',
								members: [
									{
										label: 'January 2013',
										members: []
									},{
										label: 'February 2013',
										members: []
									},{
										label: 'March 2013',
										members: []
									}
								]
							},{
								label: 'Q2 2013',
								members: [
									{
										label: 'April 2013',
										members: []
									},{
										label: 'May 2013',
										members: []
									},{
										label: 'June 2013',
										members: []
									}
								]
							},{
								label: 'Q3 2013',
								members: [
									{
										label: 'July 2013',
										members: []
									},{
										label: 'August 2013',
										members: []
									},{
										label: 'September 2013',
										members: []
									}
								]
							},{
								label: 'Q4 2013',
								members: [
									{
										label: 'October 2013',
										members: []
									},{
										label: 'November 2013',
										members: []
									},{
										label: 'December 2013',
										members: []
									}
								]
							},{
								label: 'Q1 2014',
								members: [
									{
										label: 'January 2014',
										members: []
									},{
										label: 'February 2014',
										members: []
									},{
										label: 'March 2014',
										members: []
									}
								]
							},{
								label: 'Q2 2014',
								members: [
									{
										label: 'April 2014',
										members: []
									},{
										label: 'May 2014',
										members: []
									},{
										label: 'June 2014',
										members: []
									}
								]
							},{
								label: 'Q3 2014',
								members: [
									{
										label: 'July 2014',
										members: []
									},{
										label: 'August 2014',
										members: []
									},{
										label: 'September 2014',
										members: []
									}
								]
							},{
								label: 'Q4 2014',
								members: [
									{
										label: 'October 2014',
										members: []
									},{
										label: 'November 2014',
										members: []
									},{
										label: 'December 2014',
										members: []
									}
								]
							}
						]
					},{
						label: 'Months',
						members: [
							{
								label: 'January 2013',
								members: []
							},{
								label: 'February 2013',
								members: []
							},{
								label: 'March 2013',
								members: []
							},{
								label: 'April 2013',
								members: []
							},{
								label: 'May 2013',
								members: []
							},{
								label: 'June 2013',
								members: []
							},{
								label: 'July 2013',
								members: []
							},{
								label: 'August 2013',
								members: []
							},{
								label: 'September 2013',
								members: []
							},{
								label: 'October 2013',
								members: []
							},{
								label: 'November 2013',
								members: []
							},{
								label: 'December 2013',
								members: []
							},{
								label: 'January 2014',
								members: []
							},{
								label: 'February 2014',
								members: []
							},{
								label: 'March 2014',
								members: []
							},{
								label: 'April 2014',
								members: []
							},{
								label: 'May 2014',
								members: []
							},{
								label: 'June 2014',
								members: []
							},{
								label: 'July 2014',
								members: []
							},{
								label: 'August 2014',
								members: []
							},{
								label: 'September 2014',
								members: []
							},{
								label: 'October 2014',
								members: []
							},{
								label: 'November 2014',
								members: []
							},{
								label: 'December 2014',
								members: []
							}
						]
					}
				]
			}
		],
		viewData: {
			id: '4',
			name: 'Behrooz\'s View',
			columns: [{category: 'Nameplate', name: 'Nameplate Groups'}, {category: 'Touchpoint', name: 'Channel'}],
			rows: [{category: 'Time', name: 'Years'}, {category: 'Region', name: 'City'}],
			filters: [
				{name: 'Touchpoint', items: ['National Magazine Brand','National Magazine Nameplate','Local Newspaper Brand','National Newspaper Brand','National Newspaper Nameplate','Local Online Display Brand','Local OOH Brand','Local Paid Search Brand','Local Radio Brand','Local Sponsorship Brand','National TV Cable Brand','National TV Cable Nameplate','Local TV Brand','National TV Network Brand','National TV Network Nameplate','Local Newspaper Nameplate','Local Online Display Nameplate','Local OOH Nameplate','Local Radio Nameplate','Local TV Nameplate']},
				{name: 'Nameplate', items: ['Focus','Taurus','Mustang','Fiesta','Fusion','F-Series','E-Series','Transit','Escape','Expedition','Explorer','Edge','Flex','Brand']},
				{name: 'Region', items: ['Atlanta','Miami','Charlotte','Orlando','Denver','Los Angeles','Seattle','Phoenix','San Francisco','Kansas City','Memphis','Houston','Dallas','Chicago','Pittsburgh','Cincinnati','Detroit','Twin Cities','Washington','New York','Boston','Philadelphia','National']},
				{name: 'Time', items: ['February 2013', 'March 2013', 'April 2013', 'May 2013', 'June 2013', 'July 2013', 'August 2013', 'September 2013', 'October 2013', 'November 2013', 'December 2013','January 2014', 'February 2014', 'March 2014', 'April 2014', 'May 2014', 'June 2014', 'July 2014', 'August 2014', 'September 2014', 'October 2014', 'November 2014', 'December 2014']},
				{name: 'KPI', items: []}
				]
			}
	};
}).factory('ptData', function() {
    return {
        "data": [{
            "0": "",
            "1": "",
            "2": "Car",
            "3": "Car",
            "4": "Car",
            "5": "Car",
            "6": "Car",
            "7": "Car",
            "8": "Car",
            "9": "Car",
            "10": "Truck",
            "11": "Truck",
            "12": "Truck",
            "13": "Truck",
            "14": "Truck",
            "15": "Truck",
            "16": "Truck",
            "17": "Truck",
            "18": "Utility",
            "19": "Utility",
            "20": "Utility",
            "21": "Utility",
            "22": "Utility",
            "23": "Utility",
            "24": "Utility",
            "25": "Utility",
            "26": "Brand",
            "27": "Brand",
            "28": "Brand",
            "29": "Brand",
            "30": "Brand",
            "31": "Brand",
            "32": "Brand",
            "33": "Brand"
        }, {
            "0": "Years",
            "1": "City",
            "2": "Magazine",
            "3": "Newspaper",
            "4": "Online",
            "5": "OOH",
            "6": "Paid",
            "7": "Radio",
            "8": "Sponsorship",
            "9": "TV",
            "10": "Magazine",
            "11": "Newspaper",
            "12": "Online",
            "13": "OOH",
            "14": "Paid",
            "15": "Radio",
            "16": "Sponsorship",
            "17": "TV",
            "18": "Magazine",
            "19": "Newspaper",
            "20": "Online",
            "21": "OOH",
            "22": "Paid",
            "23": "Radio",
            "24": "Sponsorship",
            "25": "TV",
            "26": "Magazine",
            "27": "Newspaper",
            "28": "Online",
            "29": "OOH",
            "30": "Paid",
            "31": "Radio",
            "32": "Sponsorship",
            "33": "TV"
        }, {
            "0": "2013",
            "1": "Atlanta"
        }, {
            "0": "2013",
            "1": "Miami"
        }, {
            "0": "2013",
            "1": "Charlotte"
        }, {
            "0": "2013",
            "1": "Orlando"
        }, {
            "0": "2013",
            "1": "Denver"
        }, {
            "0": "2013",
            "1": "Los Angeles"
        }, {
            "0": "2013",
            "1": "Seattle"
        }, {
            "0": "2013",
            "1": "Phoenix"
        }, {
            "0": "2013",
            "1": "San Francisco"
        }, {
            "0": "2013",
            "1": "Kansas City"
        }, {
            "0": "2013",
            "1": "Memphis"
        }, {
            "0": "2013",
            "1": "Houston"
        }, {
            "0": "2013",
            "1": "Dallas"
        }, {
            "0": "2013",
            "1": "Chicago"
        }, {
            "0": "2013",
            "1": "Pittsburgh"
        }, {
            "0": "2013",
            "1": "Cincinnati"
        }, {
            "0": "2013",
            "1": "Detroit"
        }, {
            "0": "2013",
            "1": "Twin Cities"
        }, {
            "0": "2013",
            "1": "Washington"
        }, {
            "0": "2013",
            "1": "New York"
        }, {
            "0": "2013",
            "1": "Boston"
        }, {
            "0": "2013",
            "1": "Philadelphia"
        }, {
            "0": "2013",
            "1": "National"
        }, {
            "0": "2014",
            "1": "Atlanta"
        }, {
            "0": "2014",
            "1": "Miami"
        }, {
            "0": "2014",
            "1": "Charlotte"
        }, {
            "0": "2014",
            "1": "Orlando"
        }, {
            "0": "2014",
            "1": "Denver"
        }, {
            "0": "2014",
            "1": "Los Angeles"
        }, {
            "0": "2014",
            "1": "Seattle"
        }, {
            "0": "2014",
            "1": "Phoenix"
        }, {
            "0": "2014",
            "1": "San Francisco"
        }, {
            "0": "2014",
            "1": "Kansas City"
        }, {
            "0": "2014",
            "1": "Memphis"
        }, {
            "0": "2014",
            "1": "Houston"
        }, {
            "0": "2014",
            "1": "Dallas"
        }, {
            "0": "2014",
            "1": "Chicago"
        }, {
            "0": "2014",
            "1": "Pittsburgh"
        }, {
            "0": "2014",
            "1": "Cincinnati"
        }, {
            "0": "2014",
            "1": "Detroit"
        }, {
            "0": "2014",
            "1": "Twin Cities"
        }, {
            "0": "2014",
            "1": "Washington"
        }, {
            "0": "2014",
            "1": "New York"
        }, {
            "0": "2014",
            "1": "Boston"
        }, {
            "0": "2014",
            "1": "Philadelphia"
        }, {
            "0": "2014",
            "1": "National"
        }]
    };
}).filter('objToArr', function() {
	return function(obj) {
		var results = [];
		angular.forEach(obj, function(val, key) {
			if(val) {
				results.push(key);
			}
		});
		return results;
	};
}).filter('treeLeafFilter', function() {
	var treeSearch = function(tree, searchLabel) {
		var output = {label: tree.label};
		if(tree.members.length > 0) {
			for(var i = 0; i < tree.members.length; i++) {
				var results = treeSearch(tree.members[i], searchLabel);
				if(results && results.members) {
					if(!output.members) {
						output.members = [];
					}
					output.members.push(results);
				}
			}
		} else {
			if(angular.lowercase(tree.label).indexOf(angular.lowercase(searchLabel)) > -1) {
				return tree;
			} else {
				return null;
			}
		}
		return output;
	};

	return function(obj, search) {
		var output = [];

		if(!obj) {
			return output;
		}

		for(var i = 0; i < obj.length; i++) {
			var node = obj[i].members.length === 0;
			var found = treeSearch(obj[i], search.label);
			// if(node) {
			// 	if(!found) {
			// 		output.push(found);
			// 	}
			// } else {
			// 	if(found.members) {
			// 		output.push(found);
			// 	}
			// }
			console.log(i);
			if(found && found.members) {
				output.push(found);
			}
		}
		return output;
	};
}).directive('filters', function($compile) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			collection: '=',
			filters: '=',
			category: '='
		},
		template: '<div class="pbFilterList"><div class="ng-hide"><label><input type="checkbox" ng-click="toggleItems(collection)" indeterminate="checkedItems(collection).checked/checkedItems(collection).total"> Select All <span>({{checkedItems(collection).checked}}/{{checkedItems(collection).total}})</span></label><div class="pbFilterValCol2"><i class="fa fa-sort-alpha-asc pull-right" ng-hide="sortReverse" ng-click="sortReverse = !sortReverse"></i><i class="fa fa-sort-alpha-desc pull-right" ng-show="sortReverse" ng-click="sortReverse = !sortReverse"></i></div></div><member ng-repeat="member in collection.members | orderBy:\'label\':sortReverse" member="member" filters="filters" category="category" searchFilter="searchFilter" sortOrder="sortReverse"></member></div>',
		// template: '<div><div>{{searchFilter}}<input type="text" class="form-control" ng-model="searchFilter.label"></div><div><label><input type="checkbox" ng-click="toggleItems(collection)" indeterminate="checkedItems(collection).checked/checkedItems(collection).total"> Select All <span>({{checkedItems(collection).checked}}/{{checkedItems(collection).total}})</span></label></div><collection collection="collection.members" filters="filters" category="category" searchFilter="searchFilter"></collection></div>',
		link: function(scope, element, attrs) {
			scope.toggleItems = function(member) {
				var checkedItems = scope.checkedItems(member);

				if(checkedItems.checked < checkedItems.total) {
					modifyItems(member, true);
				} else {
					modifyItems(member, false);
				}
			};

			scope.checkedItems = function(member) {
				var output = {checked: 0, total: 0};

				if(!member) {
					return output;
				}

				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						var tempOutput = scope.checkedItems(member.members[i]);
						output.checked += tempOutput.checked;
						output.total += tempOutput.total;
					}
				} else {
					var searchText = scope.searchFilter.label ? scope.searchFilter.label : '';
					if(angular.lowercase(member.label).indexOf(searchText) > -1) {
						output.total++;
						if(!!scope.filters[scope.category.label][member.label]) {
							output.checked++;
						}
					}
				}

				return output;
			};

			var modifyItems = function(member, add) {
				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						modifyItems(member.members[i], add);
					}
				} else {
					var searchText = scope.searchFilter.label ? scope.searchFilter.label : '';
					if(angular.lowercase(member.label).indexOf(searchText) > -1) {
						scope.filters[scope.category.label][member.label] = add;
					}
				}
			};

			scope.searchFilter = {label: ''};
		}
	};
}).directive('collection', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			collection: '=',
			filters: '=',
			category: '=',
			searchFilter: '=',
			sortOrder: '='
		},
		template: '<div class="pbFilterCollection"><member ng-repeat="member in collection | orderBy:\'label\':false" member="member" filters="filters" category="category" searchFilter="searchFilter" sortOrder="sortOrder"></member></div>'
	};
}).directive('member', function($compile) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			member: '=',
			filters: '=',
			category: '=',
			searchFilter: '=',
			sortOrder: '='
		},
		template: '<div ng-class="{pbFilterListCategory: member.members.length > 0, pbFilterListValue: member.members.length === 0}"><i class="fa fa-chevron-down clickable ng-hide" ng-click="" ng-if="member.members.length > 0"></i> <label ng-class="{blue: checkedItems(member).checked/checkedItems(member).total === 1, bold: checkedItems(member).checked/checkedItems(member).total === 1}"><input type="checkbox" class="ng-hide" ng-click="toggleItems(member)" indeterminate="checkedItems(member).checked/checkedItems(member).total"><i class="fa fa-check-circle" ng-show="checkedItems(member).checked/checkedItems(member).total === 1"></i><i class="fa fa-circle-o" ng-show="checkedItems(member).checked/checkedItems(member).total === 0"></i><i class="fa fa-minus-circle" ng-show="checkedItems(member).checked/checkedItems(member).total % 1 > 0"></i> <span>{{member.label}}</span> <span ng-if="member.members.length > 0">({{checkedItems(member).checked}}/{{checkedItems(member).total}})</span></label></div>',
		link: function(scope, element, attrs) {
			scope.toggleItems = function(member) {
				var checkedItems = scope.checkedItems(member);

				if(checkedItems.checked < checkedItems.total) {
					modifyItems(member, true);
				} else {
					modifyItems(member, false);
				}
			};

			scope.checkedItems = function(member) {
				var output = {checked: 0, total: 0};

				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						var tempOutput = scope.checkedItems(member.members[i]);
						output.checked += tempOutput.checked;
						output.total += tempOutput.total;
					}
				} else {
					output.total++;
					if(!!scope.filters[scope.category.label][member.label]) {
						output.checked++;
					}
				}

				return output;
			};

			var modifyItems = function(member, add) {
				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						modifyItems(member.members[i], add);
					}
				} else {
					scope.filters[scope.category.label][member.label] = add;
				}
			};

			scope.numCheckedItems = scope.checkedItems(scope.member);

			if(scope.member.members.length > 0) {
				$compile('<collection collection="member.members" filters="filters" category="category" searchFilter="searchFilter" sortOrder="sortOrder"></collection>')(scope, function(cloned, scope) {
					element.after(cloned);
				});
			}
		}
	};
});
