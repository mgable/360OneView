'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'pbData', function($scope, pbData){
    	$scope.viewData = pbData.viewData;
    	$scope.menuList = pbData.itemsList;
    	console.log($scope.menuList);
    	console.log('$scope.menuList');
		$scope.deleteItem = function(itemName) {
			console.info(itemName);
		}
    }]);