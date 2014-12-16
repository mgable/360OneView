'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'pbData', function($scope, pbData){
    	$scope.viewData = pbData.viewData.rows.concat(pbData.viewData.columns);
    	$scope.menuList = pbData.itemsList;
    	
    	$scope.added = {};
		angular.forEach($scope.viewData, function(val) {
			$scope.added[val.name] = true;
		});

		$scope.deleteItem = function(itemName) {
			var match = _.find($scope.viewData, function(item) { return item.name == itemName });
			if (match) {
				$scope.viewData = _.without($scope.viewData, _.findWhere($scope.viewData, match));
	            $scope.added[itemName] = false;
	        }
		}

		$scope.addItem = function(item, category) {
			$scope.viewData.push({category: category, name: item});
			$scope.added[item] = true;
		}

		$scope.replaceItem = function(priorLabel, newCategory, newLabel) {
			$scope.added[priorLabel] = false;
			$scope.added[newLabel] = true;
			var match = _.find($scope.viewData, function(item) { return item.name == priorLabel });
			if (match) {
	            match.category = newCategory;
	            match.name = newLabel
	        }
		}
    }]);