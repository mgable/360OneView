'use strict';

angular.module('ThreeSixtyOneView')
	.controller('FilterSelectionCtrl', ["$scope", "$window", "$rootScope", "$modalInstance", "$controller", "data", "CONFIG", "PivotMetaService",
	function($scope, $window, $rootScope, $modalInstance, $controller, data, CONFIG, PivotMetaService) {
		angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG, data: data}));

		var init = function() {
			$scope.selectedFilter = {};
			$scope.selectedFilter.dimension = data.dimension;
			$scope.addedFilter = data.addedFilters;
			$scope.e2e = data.e2e;

			$scope.isListMultiLevel = false;
			$scope.categorizedValue = [];
			$scope.filterSearch = {label: ''};
			$scope.emptyFiltersList = [];
			$scope.noFilterSelected = false;
			$scope.selectedDimensionIndex = 0;

			_.each(data.dimensions, function(dimension, index) {
				$scope.categorizeValuesCount(index, $scope.addedFilter[dimension.label]);
				if($scope.selectedFilter.dimension.label === dimension.label) {
					$scope.selectedDimensionIndex = index;
				}
			});

			$scope.chooseFilter($scope.selectedFilter.dimension, $scope.selectedDimensionIndex, false);
		},
		dimensions = data.dimensions,
		viewData = data.viewData,
		// choose the view based on added levels in the column/row
		chooseViewBy = function(levels, index) {
			var levelIndex = angular.isNumber(index) ? index : 0;
			if(!angular.isNumber(index)) {
				_.each(levels, function(level, index) {
					_.each(viewData, function(item) {
						if(level.label === item.level.label) {
							levelIndex = index;
						}
					});
				});
			}
			$scope.searchFilters(levels[levelIndex], $scope.filterSearch);
			return levels[levelIndex];
		};

		// open the filters modal for the selected filter
		$scope.chooseFilter = function(dimension, dimensionIndex, levelIndex) {
			if(angular.isNumber(levelIndex)) {
				$scope.selectedFilter.level = chooseViewBy(dimension.members, levelIndex);
			} else {
				$scope.selectedDimensionIndex = dimensionIndex;

				$scope.filterSearch.label = '';
				$scope.selectedFilter.dimension = dimension;
				$scope.selectedFilter.level = chooseViewBy(dimension.members, false);
			}
		};

		// choose a filter based on the passed name
		$scope.chooseFilterByName = function(name) {
			_.each(dimensions, function(dimension, index) {
				if(dimension.label === name) {
					$scope.chooseFilter(dimension, index, false);
				}
			});
		};

		// cancel the made changes to the filter
		$scope.cancel = function() {
			$scope.filterCollapse = {};
			$modalInstance.dismiss('canceled');
		};

		// search filter values
		$scope.searchFilters = function(obj, search) {
			if(!obj) {
				return null;
			}

			var searchResults = {},
				treeSearch = function(tree, searchLabel, initial) {
				var output = null;

				if(angular.lowercase(tree.label).indexOf(angular.lowercase(searchLabel)) > -1 && !initial && !tree.na) {
					return tree;
				}

				if(tree.members.length > 0 && !tree.na) {
					for(var i = 0; i < tree.members.length; i++) {
						var results = treeSearch(tree.members[i], searchLabel, false);
						if(!!results && !!results.members) {
							if(!output) {
								output = {
									label: tree.label,
									members: []
								};
							}
							output.members.push(results);
						}
					}
				} else {
					if(angular.lowercase(tree.label).indexOf(angular.lowercase(searchLabel)) > -1 && !tree.na) {
						return tree;
					} else {
						return null;
					}
				}

				return output;
			};

			searchResults = treeSearch(obj, search.label, true);

			$scope.searchResults = searchResults;
			$scope.countFilters(searchResults, $scope.addedFilter);
		};

		// count number of selected and total filters
		$scope.countFilters = function(object, _addedFilter) {
			var output = {
				selected: 0,
				total: 0
			};

			if(!object) {
				$scope.filterCount = output;
				return output;
			}
			var treeCount = function(tree) {
				var output = {
					selected: 0,
					total: 0
				};

				if(tree.members.length > 0) {
					for(var i = 0; i < tree.members.length; i++) {
						var results = treeCount(tree.members[i]);
						output.selected += results.selected;
						output.total += results.total;
					}
				} else {
					if(_addedFilter[$scope.selectedFilter.dimension.label][tree.id + ',' + tree.label]) {
						output.selected++;
					}
					output.total++;
				}
				return output;
			};

			output = treeCount(object);

			$scope.filterCount = output;
			return output;
		};

		// handle select/deselect of visible/invisible filter search values
		$scope.selectFilters = function(category, visible, add) {
			var item;

			var getFilters = function(list) {
				var output = [];

				if(list.members.length > 0) {
					_.each(list.members, function(member) {
						output = output.concat(getFilters(member));
					});
				} else {
					return [list.id + ',' + list.label];
				}

				return output;
			};

			var list = getFilters($scope.searchResults);

			if(visible) {
				_.each(list, function(item) {
					$scope.addedFilter[category][item] = add;
				});
			} else {
				for(item in $scope.addedFilter[category]) {
					if($scope.addedFilter[category][item] && list.indexOf(item) === -1) {
						$scope.addedFilter[category][item] = add;
					}
				}
			}
			$scope.categorizeValuesCount($scope.selectedDimensionIndex, $scope.addedFilter[category]);
		};

		// make the temporary changes in the filters
		$scope.submit = function() {
			$modalInstance.close($scope.addedFilter);
		};

		$scope.categorizeValuesCount = function(_index, addedFilter) {
			var index, output = PivotMetaService.getCategorizeValues(dimensions[_index], addedFilter);
			$scope.categorizedValue[_index] = output;

			// add empty category to the empty items list and show error
			if(output.selected === 0) {
				index = $scope.emptyFiltersList.indexOf(dimensions[_index].label);
				if(index < 0) {
					$scope.emptyFiltersList.push(dimensions[_index].label);
				}
				$scope.noFilterSelected = true;
			}
			// check if any item is selected from an empty list, remove it
			if($scope.noFilterSelected && output.selected > 0) {
				index = $scope.emptyFiltersList.indexOf(dimensions[_index].label);
				if(index > -1) {
					$scope.emptyFiltersList.splice(index, 1);
					if($scope.emptyFiltersList.length < 1) {
						$scope.noFilterSelected = false;
					}
				}
			}

			$scope.countFilters($scope.searchResults, $scope.addedFilter);
			return output;
		};

		$scope.getDimensions = function() {
			return dimensions;
		};

		$scope.allFiltersSelected = function(filterValues) {
			return filterValues.selected < filterValues.total;
		};

		$scope.getValuesList = function(filterValues) {
			if(!!filterValues) {
				return filterValues.label.join(', ');
			}
			return '';
		};

		$scope.getEmptyFiltersList = function() {
			return $scope.emptyFiltersList;
		};

		$scope.isDimensionSignleMembered = function(dimension) {
			return dimension.members.length === 1;
		};

		$scope.multiLevelList = function(status) {
			if(typeof status !== 'undefined') {
				$scope.isListMultiLevel = status;
			}

			return $scope.isListMultiLevel;
		};

		init();
	}]);