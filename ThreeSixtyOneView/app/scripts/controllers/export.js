'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'PivotViewService', 'CubeService', '$interval', 'DialogService', function($scope, PivotViewService, CubeService, $interval, DialogService){
		$scope.viewData = [];
		$scope.filters = [];
		$scope.dimensions = [];
		$scope.added = {};
		$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false};
		$scope.stopTime;
		//copy from pb
		$scope.addedFilters = {};
		$scope.selectedFilter = {cat: ''};

		PivotViewService.getView(18).then(function(view) {
			$scope.viewData = view.rows.concat(view.columns);
			$scope.filters = view.filters;
			angular.forEach($scope.viewData, function(val) {
				$scope.added[val.level.label] = true;
			});
		});

		CubeService.getMeta().then(function(response) {
			$scope.dimensions = response;
		});

		var timer = $interval(function(){
			if ($scope.filters.length && $scope.dimensions.length) {
				$scope.addedFilters = $scope.loadFilters();
				$interval.cancel(timer);
			}
		}, 10);
    	
		$scope.deleteItem = function(index) {
			$scope.added[$scope.viewData[index].level.label] = false;
			$scope.viewData.splice(index, 1);
		}

		$scope.addItem = function(item) {
			var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
			$scope.viewData.push(newItem);
			$scope.added[item.label] = true;
		}

		$scope.replaceItem = function(selected, priorLabel) {
			$scope.added[priorLabel] = false;
			$scope.added[selected.label] = true;
			var match = _.find($scope.viewData, function(item) { return item.level.label.toUpperCase() == priorLabel.toUpperCase() });
			if (match) {
				var newItem = {dimension:{id:selected.dimensionId},hierarchy:{id:-1},level:{id:selected.levelId, label:selected.label}};
	            var index = _.indexOf($scope.viewData, match);
	            $scope.viewData.splice(index, 1, newItem);
	        }
		}

		$scope.prepareFile = function() {
			$scope.exportObj.exportClicked = true;
			$scope.stopTime = $interval(function(){
				if ($scope.exportObj.prepareProgress == 100) {
					$interval.cancel($scope.stopTime);
					$scope.exportObj.readyForDownload = true;
				} else {
					$scope.exportObj.prepareProgress++;
				}
			}, 100);
		}

		$scope.collapseTab = function() {

		}

		$scope.initStatus = function() {
			$interval.cancel($scope.stopTime);
			$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false};
		}

		$scope.filtersModal = function(category) {
			$scope.selectedFilter.cat = category;

			var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl', {selFil: $scope.selectedFilter.selFil, cat: $scope.selectedFilter.cat, addedFilters: $scope.addedFilters, viewData: $scope.viewData, dimensions: $scope.dimensions, categorizeValues: $scope.categorizeValues}, {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

			dialog.result.then(function(data) {
				$scope.addedFilters = data;

				$scope.updateFilters();
				//$scope.saveDraftView();
			});
		};

		//copy from pivot build
		$scope.loadFilters = function() {
			var i, j, dimensionIndex, addedFilters = {};
			
			var findTree = function(_label, _dimension, _add) {
				var i, add, output = {};

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

			for(i = 0; i < $scope.filters.length; i++) {
				addedFilters[$scope.filters[i].scope.dimension.label] = {};
				addedFilters[$scope.filters[i].scope.dimension.label].scope = $scope.filters[i].scope;

				for(j = 0; j < $scope.dimensions.length; j++) {
					if($scope.filters[i].scope.dimension.id === $scope.dimensions[j].id) {
						dimensionIndex = j;
						break;
					}
				}

				if($scope.filters[i].value.specification.type === 'All') {
					angular.extend(addedFilters[$scope.filters[i].scope.dimension.label], findTree($scope.filters[i].scope.level.label, $scope.dimensions[dimensionIndex], false));
				} else {
					for(j = 0; j < $scope.filters[i].value.specification.members.length; j++) {
						angular.extend(addedFilters[$scope.filters[i].scope.dimension.label], findTree($scope.filters[i].value.specification.members[j].label, $scope.dimensions[dimensionIndex], false));
					}
				}
			}

			return addedFilters;
		};

		$scope.filtersModal = function(category) {
			$scope.selectedFilter.cat = category;

			var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl', {selFil: $scope.selectedFilter.selFil, cat: $scope.selectedFilter.cat, addedFilters: $scope.addedFilters, viewData: $scope.viewData, dimensions: $scope.dimensions, categorizeValues: $scope.categorizeValues}, {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

			dialog.result.then(function(data) {
				$scope.addedFilters = data;

				$scope.updateFilters();
				//$scope.saveDraftView();
				//$scope.applyView();
			});
		};

		$scope.updateFilters = function() {
			var i, j, filters = [], newFilter, values = {}, dimensionId;

			for(i = 0; i < $scope.dimensions.length; i++) {
				dimensionId = $scope.dimensions[i].id;

				newFilter = {};
				newFilter.scope = $scope.addedFilters[$scope.dimensions[i].label].scope;
				newFilter.id = $scope.viewData.filters[i].id;
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

			$scope.viewData.filters = filters;
		};

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
    }]);