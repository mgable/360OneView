'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioCalcCtrl
* @description
* # scenarioCalcCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioCalcCtrl', ['$scope', '$interval', '$timeout', 'AnalyticCalculationsService', 'Calculate', 'submitCalculate', 'Scenario', 'CONFIG', '$location', '$rootScope', '$state',
    function ($scope, $interval, $timeout, AnalyticCalculationsService, Calculate, submitCalculate, Scenario, CONFIG, $location, $rootScope, $state) {

    var stepLen = CONFIG.view.ScenarioCalculate.statusLen,
        stepValue = 100 / stepLen,
        NOT_CALCULATED = "not calculated",
        FAILED = "FAILED",
        SUCCESS = "SUCCESSFUL",
        IN_PROGRESS = "in progress",

        // init the progress
        init = function() {
            $scope.progressValue     = 0;
            $scope.step              = 0;
            $scope.errorMsg          = "";
            getCalcStatusData(Calculate);
            if($scope.scenarioState === IN_PROGRESS) {
                $scope.runProgress();
            } else if ($scope.scenarioState === SUCCESS) {
                $state.go("Scenario.results");
            }
            angular.element('.Scenario').css('height', 'auto');
        },

        // get the current index for status
        getCurrentStepIndex = function(_data) {
            if ($scope.scenarioState === SUCCESS) {
                return _data.runningStates.length;
            } else {
                return _.indexOf(_.pluck(_data.runningStates, 'completed'), false);
            }
        },

        trimString = function(str) {
            str = str.trim();
        },

        getCalcStatusData = function() {
            AnalyticCalculationsService.get(Scenario.id).then(function(data) {
                $scope.calcStatesData = transformStatusData(data);
                $scope.runningStates  = $scope.calcStatesData.runningStates;
                $scope.currentState   = $scope.calcStatesData.currentState;
                $scope.step           = getCurrentStepIndex($scope.calcStatesData);
                console.info('GET CALC DATA: ', $scope.calcStatesData);
                updateCalcStatusData($scope.currentState);
            });
        },

        updateCalcStatusData = function(_currentState) {
            if ($scope.scenarioState === SUCCESS) {
                $scope.progressValue = 100;
                $state.go("Scenario.results");
            } else if ($scope.scenarioState === FAILED) {
                $scope.stopProgress();
                console.log();
                $scope.errorMsg = $scope.calcStatesData.additionalInfo.message;
                $scope.progressValue = stepValue * $scope.step;
            } else {
                $scope.progressValue = stepValue * $scope.step;
            }
        },

        transformStatusData = function(_data) {
            angular.forEach(_data.runningStates, function(value, key) {
                value.id = key + 1;
                trimString(value.name);
                trimString(value.label);
            });
            trimString(_data.currentState.name);
            trimString(_data.currentState.label);
            return _data;
        };


    // scope functions
    $scope.runProgress = function() {
        $scope.stopTime = $interval(function(){
            getCalcStatusData($scope.calcStatesData);
        }, CONFIG.view.ScenarioCalculate.timerInterval);
    }

    $scope.stopProgress = function() {
        $interval.cancel($scope.stopTime);
        $scope.stopTime = null;
    };

    $scope.resetProgress = function() {
        $scope.scenarioState = NOT_CALCULATED;
        AnalyticCalculationsService.post(Scenario.id).then(function(data) {
            $scope.scenarioState = IN_PROGRESS;
            init();
        });
    };

    $scope.returnToEdit = function() {
        $scope.stopProgress();
        $state.go("Scenario.edit");
    };

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        var currentPath = next,
            re = /calculate$/;
        if (currentPath.search(re) === -1) {
            $scope.stopProgress();
        }
    });

    // fire off init function
    init();

}]);