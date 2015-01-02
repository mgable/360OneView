'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'PivotViewService', 'CubeService', '$interval', 'DialogService', 'PivotIntermediatesService', '$q',
    	function($scope, PivotViewService, CubeService, $interval, DialogService, PivotIntermediatesService, $q){

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
					//$scope.generateMembersList(dimensions);
				});
			});
		};

		// open/dismiss filters selection modal
		$scope.filtersModal = function(category) {
			var dialog = DialogService.openFilterSelection('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl', {cat: category, addedFilters: $scope.addedFilters, viewData: $scope.views.currentView, dimensions: $scope.dimensions}, {windowSize: 'lg', windowClass: 'filtersSelectionModal'});

			dialog.result.then(function(data) {
				$scope.addedFilters = data;

				//$scope.updateFilters();
			});
		};

		$scope.init = function() {
			$scope.viewData = $scope.views.currentView.rows.concat($scope.views.currentView.columns);
			$scope.dimensions = [];
			$scope.added = {};
			$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false};
			$scope.stopTime;

			$scope.filters = $scope.views.currentView.filters;
			angular.forEach($scope.viewData, function(val) {
				$scope.added[val.level.label] = true;
			});

			$scope.loadDimensions($scope.cubeId).then(function() {
				$scope.addedFilters = PivotIntermediatesService.getAddedFilters($scope.filters, $scope.dimensions);
				_.each($scope.dimensions, function(_dimension) {
					_dimension.catVal = PivotIntermediatesService.getCategorizeValues(_dimension, $scope.addedFilters[_dimension.label]);
				});
			});
		};
		$scope.init();

		$scope.initStatus = function() {
			$interval.cancel($scope.stopTime);
			$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false};
		}


    }]);