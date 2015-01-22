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
        scenarioId = 5,
        // scenarioId = $scope.scenario.id,

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
                trimString(value.name);
                trimString(value.label);
            });
            trimString(_data.currentState.name);
            trimString(_data.currentState.label);
            return _data;
        },

        // return the step of current state
        getCurrentStepIndex = function(_data) {
            if ($scope.currentState.name === "SUCCESSFUL") {
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
                if ($scope.currentState.name === "SUCCESSFUL") {
                    $scope.stopProgress();
                    $scope.progressValue = 100;
                    $timeout(function() {
                        $scope.toggleSuccess(true);
                    }, 2000);
                } else if ($scope.currentState.name === 'FAILED') {
                    $scope.stopProgress();
                    $scope.success = false;
                    $scope.progressValue = stepValue * $scope.step;
                } else {
                    $scope.progressValue = stepValue * $scope.step;
                }
            });
        },

        trimString = function(str) {
            str = str.trim();
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
        $scope.toggleCalculation(false);
        // ScenarioCalculateService.post($scope.scenario.id);
        init();
        $scope.toggleCalculation(true);
    };

    // $scope.getErrorMsg = function() {
    //     var errorMsg = ScenarioCalculate.additionalInfo.message ? ScenarioCalculate.additionalInfo.message : '';
    //     return errorMsg;
    // }

    $scope.returnToEdit = function() {
        $scope.stopProgress();
        $scope.toggleSuccess(false);
        $scope.toggleCalculation(false);
        $scope.location = "/edit";
    };

    // fire off functions
    init();

}]);