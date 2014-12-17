'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'PivotViewService', 'CubeService', function($scope, PivotViewService, CubeService){
    		$scope.viewData = [];
    		$scope.menuList = [];
    		PivotViewService.getView(15).then(function(view) {
				$scope.viewData = view.rows.concat(view.columns);
				$scope.added = {};
				angular.forEach($scope.viewData, function(val) {
					$scope.added[val.level.label] = true;
				});
			});

			CubeService.getMeta().then(function(response) {
				$scope.menuList = response;
			});
    	

		$scope.deleteItem = function(index) {
			$scope.added[$scope.viewData[index].level.label] = false;
			$scope.viewData.splice(index, 1);
		}

		$scope.addItem = function(item) {
			$scope.viewData.push(item);
			$scope.added[item.level.label] = true;
		}

		$scope.replaceItem = function(selected, priorLabel) {
			$scope.added[priorLabel] = false;
			$scope.added[selected.level.label] = true;
			var match = _.find($scope.viewData, function(item) { return item.level.label == priorLabel });
			if (match) {
	            match.dimension = selected.dimension;
	            match.hierarchy = selected.hierarchy;
	            match.level = selected.level;
	        }
		}
    }]);