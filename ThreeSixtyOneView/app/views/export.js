'use strict';

angular.module('ThreeSixtyOneView')
    .controller("exportCtrl", ["$scope", 'pbData', function($scope, pbData){
    	$scope.pbData = pbData;
		console.info("pbData");
		console.info($scope.pbData);
    }]);