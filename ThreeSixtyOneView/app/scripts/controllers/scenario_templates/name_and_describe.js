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

        $scope.$watch("template.name", function(){
            if ($scope.template.name && $scope.template.name.length > 0 && $scope.dimensionsIsLoaded){
                $scope.$emit(EVENTS.flipbookAllowAdvance, true);
            } else {
                $scope.$emit(EVENTS.flipbookAllowAdvance, false);
            }
        });

    	$scope.$on(EVENTS.flipbookAdvance, function() {
			$scope.createDraftTemplate();
		});

        $scope.$on(EVENTS.dimensionsIsLoaded, function() {
             if ($scope.template.name && $scope.template.name.length > 0){
                $scope.$emit(EVENTS.flipbookAllowAdvance, true);
            } 
        });
    }]);
