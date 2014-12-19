'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'PivotViewService', 'CubeService', '$interval', function($scope, PivotViewService, CubeService, $interval){
		$scope.viewData = [];
		$scope.dimensions = [];
		$scope.added = {};
		$scope.exportObj = {prepareProgress:0, readyForDownload:false, exportClicked: false};

		PivotViewService.getView(18).then(function(view) {
			$scope.viewData = view.rows.concat(view.columns);
			angular.forEach($scope.viewData, function(val) {
				$scope.added[val.level.label] = true;
			});
		});

		CubeService.getMeta().then(function(response) {
			$scope.dimensions = response;
		});
    	
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
			var stopTime = $interval(function(){
				if ($scope.exportObj.prepareProgress == 100) {
					$interval.cancel(stopTime);
					$scope.exportObj.readyForDownload = true;
				} else {
					$scope.exportObj.prepareProgress++;
				}
			}, 100);
		}
    }]);