'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioCalcCtrl
* @description
* # scenarioCalcCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioCalcCtrl', ['$scope', '$interval', '$timeout', 'ScenarioCalculateService', 'ScenarioCalculate', 'CONFIG', function ($scope, $interval, $timeout, ScenarioCalculateService, ScenarioCalculate, CONFIG) {

    // private varibles and functions
    var stepLen = ScenarioCalculate.runningStates.length,
        stepValue = 100 / stepLen,
        scenarioId = 6,

        // init the progress
        init = function() {
            angular.element('.Scenario').css('height', 'auto');
            $scope.progressValue     = 0;
            $scope.step              = 0;
            $scope.success           = true;
            checkStateData();
            $scope.runProgress();
        },

        // transform and clean up states data
        prepareStatesData = function(_data) {
            angular.forEach(_data.runningStates, function(value, key) {
                value.id = key + 1;
                var trimText = capitalize(value.name.trim().replace(/_/g, " "));
                value.name = trimText;
                value.label = trimText;
            });

            var trimText = capitalize(_data.currentState.name.trim().replace(/_/g, " "));
            _data.currentState.name = trimText;
            _data.currentState.label = trimText;
            return _data;
        },

        // capitalize a string
        capitalize = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        // return the step of current state
        getCurrentStepIndex = function(_data) {
            if (_data.currentState.completed) {
                return _data.runningStates.length;
            } else {
                return _.indexOf(_.pluck(_data.runningStates, 'completed'), false);
            }
        },

        checkStateData = function() {
            ScenarioCalculateService.get(scenarioId).then(function(data) {
                $scope.calcStatesData = prepareStatesData(data);
                $scope.runningStates  = $scope.calcStatesData.runningStates;
                $scope.currentState   = $scope.calcStatesData.currentState;
                $scope.step           = getCurrentStepIndex($scope.calcStatesData);
                if ($scope.currentState.completed) {
                    $scope.stopProgress();
                    $scope.progressValue = 100;
                    $timeout(function() {
                        $scope.toggleSuccess(true);
                    }, 3000);
                } else {
                    $scope.progressValue = stepValue * $scope.step;
                    if($scope.currentState.name === 'Failed') {
                        $scope.stopProgress();
                        $scope.success = false;
                    }
                }
            });
        };

    // scope functions
    $scope.runProgress = function() {
        $scope.stopProgress();
        $scope.timer = $interval(function(){
            checkStateData();
        }, CONFIG.view.ScenarioCalculate.timerInterval);
    }

    $scope.stopProgress = function() {
        $interval.cancel($scope.timer);
    };

    $scope.resetProgress = function() {
        $scope.toggleSuccess(false);
        $scope.progressValue     = 0;
        $scope.step              = 0;
        $scope.success           = true;
        resetStates($scope.calcStatesData);
        $scope.runProgress();
    };

    $scope.returnToEdit = function() {
        $scope.stopProgress();
        $scope.location = "/edit";
    };

    // fire off functions
    init();

}]);