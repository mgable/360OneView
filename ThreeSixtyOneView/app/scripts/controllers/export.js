'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'Views', function($scope, Views){
    	$scope.Views = Views;
		console.info("Views");
		console.info($scope.Views);

		$scope.deleteItem = function(itemName, dim) {
			console.info(itemName);
			console.info(dim);
		}
    }]);