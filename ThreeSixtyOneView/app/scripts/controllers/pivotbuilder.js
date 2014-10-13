'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('PivotBuilderCtrl', function ($scope, $timeout, $filter, pbData) {
	var init = function() {
		$scope.pbShow = true;
		$scope.pbData = angular.copy(pbData);
		$scope.viewName = pbData.viewData.name;

		$scope.appliedView = JSON.stringify(angular.copy(pbData.viewData), null, '\t');
		$scope.viewApplied = true;

		$scope.saveAs = false;
		$scope.alertOpacity = 0;

		$scope.notifMsg = false;

		$scope.add = {selected: ""};
		$scope.added = {};
		$scope.toAdd = [];
		$scope.addChecked = {};
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
		$scope.filterSearch = {values: ''};

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

		// $scope.dragOptions = {
		// 	itemMoved: function(event) {
		// 		// console.log(event);
		// 	},
		// 	orderChanged: function(event) {
		// 		//console.log(event);
		// 	},
		// 	dragStart: function(event) {
		// 		// console.log(event);
		// 	}
		// 	// containment: '#dragDropArea'
		// };

		$scope.identity = angular.identity();
	};

	$scope.delItem =  function(itemName, dim) {
		var item = $scope.pbData.viewData[dim].filter(function(obj) {
			return obj.name === itemName;
		});
		var itemInd = $scope.pbData.viewData[dim].indexOf(item[0]);

		$scope.pbData.viewData[dim].splice(itemInd, 1);
		$scope.added[itemName] = false;

		$scope.applyView();
	};

	$scope.changeMade = function() {
		return !angular.equals($scope.pbData, pbData);
	};

	$scope.toggleToAdd = function(objAdd) {
		var objFound = $scope.toAdd.filter(function(obj) {
			return obj.name === objAdd.name;
		});

		if(objFound.length > 0) {
			$scope.toAdd.splice($scope.toAdd.indexOf(objFound[0]), 1);
		} else {
			$scope.toAdd.push(objAdd);
		}
	};

	$scope.addItem = function(item, category, outerIndex) {
		var val = {category: category, name: item};

		if($scope.add.replaceItem > -1) {
			$scope.added[$scope.pbData.viewData[$scope.add.selected][$scope.add.replaceItem].name] = false;
			$scope.pbData.viewData[$scope.add.selected].splice($scope.add.replaceItem, 1, val);
		} else {
			$scope.pbData.viewData[$scope.add.selected].push(val);
		}
		
		$scope.added[item] = true;

		$scope.addPopUp[$scope.add.selected] = !$scope.addPopUp[$scope.add.selected];

		$scope.toAdd = [];
		$scope.addChecked = {};

		$scope.applyView();
	};

	$scope.popUpLocSet = function($event) {
		var top = $event.target.offsetTop;
		var left = $event.target.offsetLeft;
		$scope.popUpLoc = {top: top, left: left};
	};

	$scope.cancelAddItem = function() {
		$scope.toAdd = [];
		$scope.addChecked = {};

		copyFilter();
	};

	var copyFilter = function() {
		angular.forEach($scope.pbData.viewData.filters, function(val) {
			$scope.addedFilter[val.name] = {};
			angular.forEach(val.items, function(subval) {
				$scope.addedFilter[val.name][subval] = true;
			});
		});
	};

	$scope.changeFilter = function() {
		angular.forEach($scope.pbData.viewData.filters, function(val) {
			val.items = [];
			angular.forEach($scope.addedFilter[val.name], function(subval, subkey) {
				subval ? val.items.push(subkey): null;
			});
		});
	};

	$scope.cancelChangeFilter = function() {
		$scope.selectedFilter.selFil = $scope.selectedFilter.cat.subitems[$scope.selectedFilter.cat.subitems.length - 1];
		$scope.filterSearch = {values: ''};
		$scope.filterCollapse = {};
		copyFilter();
	};

	$scope.filterCount = function(obj, cat, fltr) {
		var count = 0;

		var fltr = angular.lowercase(fltr);

		if(!cat) {
			angular.forEach(obj, function(val, key) {
				(val && (key.toLowerCase().indexOf(fltr) > -1)) ? count++ : null;
			});
		} else {
			angular.forEach(obj, function(val, key) {
				if (cat.indexOf(key) > -1 && (key.toLowerCase().indexOf(fltr) > -1) && val) {
					count++;
				}
			});
		}
		return count;
	};

	$scope.allFilters = function(fltr) {
		if($scope.filterCount($scope.addedFilter[$scope.selectedFilter.cat.name], false, fltr) < $scope.totalFilterCount($scope.selectedFilter.cat.subitems[$scope.selectedFilter.cat.subitems.length - 1].subsubitems[0].values, fltr)) {
			// $scope.addedFilter[$scope.selectedFilter.cat.name] = {};

			angular.forEach($scope.selectedFilter.cat.subitems[$scope.selectedFilter.cat.subitems.length - 1].subsubitems[0].values, function(val) {
				if(val.toLowerCase().indexOf(angular.lowercase(fltr)) > -1) {
					$scope.addedFilter[$scope.selectedFilter.cat.name][val] = true;
				}
			});
		} else {
			// $scope.addedFilter[$scope.selectedFilter.cat.name] = {};
			angular.forEach($scope.selectedFilter.cat.subitems[$scope.selectedFilter.cat.subitems.length - 1].subsubitems[0].values, function(val) {
				if(val.toLowerCase().indexOf(angular.lowercase(fltr)) > -1) {
					$scope.addedFilter[$scope.selectedFilter.cat.name][val] = false;
				}
			});
		}
	};

	$scope.totalFilterCount = function(items, fltr) {
		var filteredItems = $filter('filter')(items, fltr);
		if(!!filteredItems) {
			return filteredItems.length;
		}
		return 0;
	}

	$scope.allCategoryFilters = function(values, fltr) {
		var containsAll = true;
		var current = Object.keys($scope.addedFilter[$scope.selectedFilter.cat.name]).filter(function(value) {
			return $scope.addedFilter[$scope.selectedFilter.cat.name][value] && (angular.lowercase(value).indexOf(fltr) > -1);
		});

		var filterValues = $filter('filter')(values, fltr);

		for(var i = 0, n = filterValues.length; i < n; i++) {
			if(current.indexOf(filterValues[i]) < 0) {
				containsAll = false;
				break;
			}
		}

		if(containsAll) {
			for(i = 0, n = filterValues.length; i < n; i++) {
				$scope.addedFilter[$scope.selectedFilter.cat.name][filterValues[i]] = false;
			}
		} else {
			for(i = 0, n = filterValues.length; i < n; i++) {
				$scope.addedFilter[$scope.selectedFilter.cat.name][filterValues[i]] = true;
			}
		}
	};

	$scope.expandCategories = function(cat, search) {
		if(search.values === '') {
			return false;
		}

		var results = $filter('filter')(cat, search, false);
		for(var i = 0, n = results.length; i < n; i++) {
			$scope.filterCollapse[results[i].name] = true;
		}
	};

	$scope.resetView = function() {
		$scope.pbData = angular.copy(pbData);
	};

	$scope.closeSlider = function() {
		// if(angular.equals($scope.pbData, pbData)) {
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

	$scope.saveView = function() {
		if($scope.changeMade()) {
			pbData = angular.copy($scope.pbData);
		
			$scope.notify('Saved!');
		}
	};

	$scope.startSaveAs = function() {
		$scope.saveAsName = $scope.viewName;
		$scope.saveAs = true;
	};

	$scope.renameAction = function (event) {
		if(event.keyCode === 13) {
			$scope.finishSaveAs()
		} else if(event.keyCode === 27) {
			$scope.cancelSaveAs();
		}
	}

	$scope.finishSaveAs = function() {
		$scope.viewName = $scope.saveAsName;
		$scope.saveView();
		$scope.saveAs = false;

		$scope.notify('Saved!');
	};

	$scope.notify = function(msg) {
		$scope.titleMsg = msg;

		$scope.notifMsg = true;
		$timeout(function() {
			$scope.notifMsg = false;
		}, 3000);
	};

	$scope.cancelSaveAs = function() {
		$scope.saveAs = false;
	};

	$scope.applyView = function() {
		$scope.appliedView = JSON.stringify(angular.copy($scope.pbData.viewData), null, '\t');

		var numCols = $scope.pbData.viewData.columns.length;
		var numRows = $scope.pbData.viewData.rows.length;
		
		var totalColCount = 1;
		var pivotCols = [];
		var colCounter = [];

		for(var i = 0; i < numCols; i++) {
			var category = $scope.pbData.itemsList.filter(function(obj) {
					return obj.name === $scope.pbData.viewData.columns[i].category;
				});

			var item = category[0].subitems.filter(function(obj) {
				return obj.name === $scope.pbData.viewData.columns[i].name;
			});

			if(item[0].subsubitems.length === 1) {
				pivotCols[i] = item[0].subsubitems[0].values;
				totalColCount *= item[0].subsubitems[0].values.length;
			} else {
				totalColCount *= item[0].subsubitems.length;
				for(var j = 0; j < item[0].subsubitems.length; j++) {
					if(!angular.isArray(pivotCols[i])) pivotCols[i] = [];
					pivotCols[i][j] = item[0].subsubitems[j].name;
				}
			}

			colCounter[i] = 0;
		}

		var totalRowCount = 1;
		var pivotRows = [];
		var rowCounter = [];

		for(i = 0; i < numRows; i++) {
			var category = $scope.pbData.itemsList.filter(function(obj) {
					return obj.name === $scope.pbData.viewData.rows[i].category;
				});

			var item = category[0].subitems.filter(function(obj) {
				return obj.name === $scope.pbData.viewData.rows[i].name;
			});

			if(item[0].subsubitems.length === 1) {
				pivotRows[i] = item[0].subsubitems[0].values;
				totalRowCount *= item[0].subsubitems[0].values.length;
			} else {
				totalRowCount *= item[0].subsubitems.length;
				for(var j = 0; j < item[0].subsubitems.length; j++) {
					if(!angular.isArray(pivotRows[i])) pivotRows[i] = [];
					pivotRows[i][j] = item[0].subsubitems[j].name;
				}
			}

			rowCounter[i] = 0;
		}

		$scope.pivotTableData = [];

		for(i = 0; i < numCols; i++) {
			$scope.pivotTableData[i] = {};
			for (j = 0; j < numRows; j++) {
				$scope.pivotTableData[i][j] = '';
			};
		}

		for(i = 0; i < totalColCount; i++) {
			
			for(var j = 0; j < numCols; j++) {
				$scope.pivotTableData[j][i + numRows] = pivotCols[j][colCounter[j]];
			}

			colCounter[numCols - 1]++;
			for(j = numCols - 1; j >= 0; j--) {
				if(colCounter[j] == pivotCols[j].length) {
					colCounter[j] = 0;
					colCounter[j - 1]++;
				}
			}
		}

		for(i = 0; i < totalRowCount; i++) {
			$scope.pivotTableData[i + numCols] = {};

			for(var j = 0; j < numRows; j++) {
				$scope.pivotTableData[i + numCols][j] = pivotRows[j][rowCounter[j]];
			}

			rowCounter[numRows - 1]++;
			for(j = numRows - 1; j >= 0; j--) {
				if(rowCounter[j] == pivotRows[j].length) {
					rowCounter[j] = 0;
					rowCounter[j - 1]++;
				}
			}
		}

		$scope.spread.sheet.addSpan(0,0,numCols,numRows);
		$scope.spread.sheet.setFrozenRowCount(numCols);
		$scope.spread.sheet.setFrozenColumnCount(numRows);
		
		// var newData = angular.copy($scope.pivotTableData);
		// $scope.pivotTableData = newData;
		$scope.spread.sheet.setDataSource($scope.pivotTableData);

		$scope.viewApplied = true;
		console.log('Done!');
	};

	$scope.undoViewChange = function() {
		if($scope.undoList.length === 0) {
			return false;
		}

		$scope.pbData.viewData = $scope.undoList.pop();

		$scope.toAdd = [];
		$scope.addChecked = {};
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
			{name: 'Touchpoint', subitems: [
				{name: 'National/Local Spend', subsubitems: [
					{name: 'National', values: ['National Magazine Brand','National Magazine Nameplate','National Newspaper Brand','National Newspaper Nameplate','National TV Cable Brand','National TV Cable Nameplate','National TV Network Brand','National TV Network Nameplate']},
					{name: 'Local', values: ['Local Newspaper Brand','Local Online Display Brand','Local OOH Brand','Local Paid Search Brand','Local Radio Brand','Local Sponsorship Brand','Local TV Brand','Local Newspaper Nameplate','Local Online Display Nameplate','Local OOH Nameplate','Local Radio Nameplate','Local TV Nameplate']}
					]},
				{name: 'Brand/Nameplate Spend', subsubitems: [
					{name: 'Brand', values: ['National Magazine Brand','Local Newspaper Brand','National Newspaper Brand','Local Online Display Brand','Local OOH Brand','Local Paid Search Brand','Local Radio Brand','Local Sponsorship Brand','National TV Cable Brand','Local TV Brand','National TV Network Brand']},
					{name: 'Nameplate', values: ['National Magazine Nameplate','National Newspaper Nameplate','National TV Cable Nameplate','National TV Network Nameplate','Local Newspaper Nameplate','Local Online Display Nameplate','Local OOH Nameplate','Local Radio Nameplate','Local TV Nameplate']}
					]},
				{name: 'Channel', subsubitems: [
					{name: 'Magazine', values: ['National Magazine Brand','National Magazine Nameplate']},
					{name: 'Newspaper', values: ['Local Newspaper Brand','National Newspaper Brand','National Newspaper Nameplate','Local Newspaper Nameplate']},
					{name: 'Online', values: ['Local Online Display Brand','Local Online Display Nameplate']},
					{name: 'OOH', values: ['Local OOH Brand','Local OOH Nameplate']},
					{name: 'Paid', values: ['Local Paid Search Brand']},
					{name: 'Radio', values: ['Local Radio Brand','Local Radio Nameplate']},
					{name: 'Sponsorship', values: ['Local Sponsorship Brand']},
					{name: 'TV', values: ['National TV Cable Brand','National TV Cable Nameplate','Local TV Brand','National TV Network Brand','National TV Network Nameplate','Local TV Nameplate']}
					]},
				{name: 'Leaf Touchpoints', subsubitems: [
					{name: '', values: ['National Magazine Brand','National Magazine Nameplate','Local Newspaper Brand','National Newspaper Brand','National Newspaper Nameplate','Local Online Display Brand','Local OOH Brand','Local Paid Search Brand','Local Radio Brand','Local Sponsorship Brand','National TV Cable Brand','National TV Cable Nameplate','Local TV Brand','National TV Network Brand','National TV Network Nameplate','Local Newspaper Nameplate','Local Online Display Nameplate','Local OOH Nameplate','Local Radio Nameplate','Local TV Nameplate']}
					]}
				]},
			{name: 'Nameplate', subitems: [
				{name: 'Nameplate Groups', subsubitems: [
					{name: 'Car', values: ['Focus','Taurus','Mustang','Fiesta','Fusion']},
					{name: 'Truck', values: ['F-Series','E-Series','Transit']},
					{name: 'Utility', values: ['Escape','Expedition','Explorer','Edge','Flex']},
					{name: 'Brand', values: ['Brand']}
					]},
				{name: 'Nameplates', subsubitems: [
					{name: '', values: ['Focus','Taurus','Mustang','Fiesta','Fusion','F-Series','E-Series','Transit','Escape','Expedition','Explorer','Edge','Flex','Brand']}
					]}
				]},
			{name: 'Region', subitems: [
				{name: 'Region', subsubitems: [
					{name: 'Southeast', values: ['Atlanta','Miami','Charlotte','Orlando']},
					{name: 'West', values: ['Denver','Los Angeles','Seattle','Phoenix','San Francisco']},
					{name: 'Central', values: ['Kansas City','Memphis','Houston','Dallas']},
					{name: 'Great Lakes', values: ['Chicago','Pittsburgh','Cincinnati','Detroit', 'Twin Cities']},
					{name: 'Northeast', values: ['Washington','New York','Boston','Philadelphia']},
					{name: 'National', values: ['National']}
					]},
				{name: 'City', subsubitems: [
					{name: '', values: ['Atlanta','Miami','Charlotte','Orlando','Denver','Los Angeles','Seattle','Phoenix','San Francisco','Kansas City','Memphis','Houston','Dallas','Chicago','Pittsburgh','Cincinnati','Detroit','Twin Cities','Washington','New York','Boston','Philadelphia','National']}
					]}
				]},
			{name: 'Time', subitems: [
				{name: 'Years', subsubitems: [
					{name: '2013', values: ['January 2013', 'February 2013', 'March 2013', 'April 2013', 'May 2013', 'June 2013', 'July 2013', 'August 2013', 'September 2013', 'October 2013', 'November 2013', 'December 2013']},
					{name: '2014', values: ['January 2014', 'February 2014', 'March 2014', 'April 2014', 'May 2014', 'June 2014', 'July 2014', 'August 2014', 'September 2014', 'October 2014', 'November 2014', 'December 2014']}
					]},
				{name: 'Quarters', subsubitems: [
					{name: 'Q1 2013', values: ['January 2013', 'February 2013', 'March 2013']},
					{name: 'Q2 2013', values: ['April 2013', 'May 2013', 'June 2013']},
					{name: 'Q3 2013', values: ['July 2013', 'August 2013', 'September 2013']},
					{name: 'Q4 2013', values: ['October 2013', 'November 2013', 'December 2013']},
					{name: 'Q1 2014', values: ['January 2014', 'February 2014', 'March 2014']},
					{name: 'Q2 2014', values: ['April 2014', 'May 2014', 'June 2014']},
					{name: 'Q3 2014', values: ['July 2014', 'August 2014', 'September 2014']},
					{name: 'Q4 2014', values: ['October 2014', 'November 2014', 'December 2014']}
					]},
				{name: 'Months', subsubitems: [
					{name: '', values: ['January 2013', 'February 2013', 'March 2013', 'April 2013', 'May 2013', 'June 2013', 'July 2013', 'August 2013', 'September 2013', 'October 2013', 'November 2013', 'December 2013','January 2014', 'February 2014', 'March 2014', 'April 2014', 'May 2014', 'June 2014', 'July 2014', 'August 2014', 'September 2014', 'October 2014', 'November 2014', 'December 2014']}
					]}
				]}
			],
		viewData: {
			id: '4',
			name: 'Behrooz\'s View',
			columns: [{category: 'Time', name: 'Months'}],
			rows: [{category: 'Touchpoint', name: 'Leaf Touchpoints'}, {category: 'Touchpoint', name: 'Brand/Nameplate Spend'}],
			filters: [
				{name: 'Touchpoint', items: ['National Magazine Brand','National Magazine Nameplate','Local Newspaper Brand','National Newspaper Brand','National Newspaper Nameplate','Local Newspaper Nameplate']},
				{name: 'Nameplate', items: ['Mustang','Transit','Edge']},
				{name: 'Region', items: ['Denver','Los Angeles','Seattle','Phoenix','San Francisco']},
				{name: 'Time', items: ['March 2014']},
				{name: 'KPI', items: []}
				]
			}
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
});
