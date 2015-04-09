'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:NameAndDescribeCtrl
 * @description
 * # NameAndDescribeCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
    .controller('NameAndDescribeCtrl', ["$scope", "EVENTS", function($scope, EVENTS) {

    	$scope.$watch("template.description", function(){
    		if ($scope.template.description && $scope.template.description.length > 0){
    			$scope.$emit(EVENTS.flipbookAllowAdvance, true);
    		} else {
    			$scope.$emit(EVENTS.flipbookAllowAdvance, false);
    		}
    	});
    }]);
