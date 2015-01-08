'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioCalcCtrl
* @description
* # scenarioCalcCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioCalcCtrl', ['$scope', '$interval', function ($scope, $interval) {

    var stepValue = 100 / 8;

    var init = function() {
        angular.element('.Scenario').css('height', 'auto');
        $scope.progressCompleted = false;
        $scope.progressValue = 0;
        $scope.step = 1;
        $scope.timer;
        $scope.runProgress();
    };

    $scope.runProgress = function() {
        $scope.timer = $interval(function(){
            if ($scope.progressValue === 100) {
                $scope.progreeCompleted = true;
            } else {
                $scope.progressValue += stepValue;
                $scope.step += 1;
            }
        }, 1000);
    }

    init();

}]);