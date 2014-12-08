'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('PivotBuilderCtrl', function ($scope, $rootScope, EVENTS, $timeout, $filter, pbData, ptData, Views, DialogService) {

	console.info("Views");
	console.info(Views);

	var init = function() {
		$scope.pbShow = false;
		$scope.pbData = angular.copy(pbData);
		$scope.viewName = pbData.viewData.name;
		$scope.draftView = false;

		$scope.viewApplied = true;

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

	// create the temporary filter object from the view data
	var copyFilter = function() {
		angular.forEach($scope.pbData.viewData.filters, function(val) {
			$scope.addedFilter[val.name] = {};
			angular.forEach(val.items, function(subval) {
				$scope.addedFilter[val.name][subval] = true;
			});
		});
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
			$scope.viewName = pbData.viewData.name;
			$scope.draftView = false;
		}

		$scope.applyView();
	};

	// save the changes in the current view
	$scope.saveView = function() {
		if($scope.changeMade()) {
			pbData = angular.copy($scope.pbData);

			if($scope.draftView) {
				$scope.viewName = pbData.viewData.name;
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


		$scope.viewApplied = true;
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
});
