'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioCalcCtrl
* @description
* # scenarioCalcCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioCalcCtrl', ['$scope', '$interval', '$timeout', 'ScenarioCalculateService', 'ScenarioCalculate', 'CONFIG', '$location', '$rootScope',
    function ($scope, $interval, $timeout, ScenarioCalculateService, ScenarioCalculate, CONFIG, $location, $rootScope) {

    /**
    * private varibles and functions
    */
    var stepLen    = ScenarioCalculate.runningStates.length,  // the number of states for the calculation
        stepValue  = 100 / stepLen,                           // set the interval value for progress bar
        scenarioId = 5,                                       // get the scenario id for checking the calculation status
        // scenarioId = $scope.scenario.id,                   // get the scenario id for checking the calculation status

        // init the progress
        init = function() {
            $scope.progressValue     = 0;
            $scope.step              = 0;
            $scope.success           = true;
            $scope.errorMsg          = "";
            getCalcStatusData($scope.calcStatesData);
            $scope.runProgress();
        },

        // get the current index for status
        getCurrentStepIndex = function(_data) {
            if (isCalcSucceed(_data.currentState)) {
                return _data.runningStates.length;
            } else {
                return _.indexOf(_.pluck(_data.runningStates, 'completed'), false);
            }
        },

        trimString = function(str) {
            str = str.trim();
        },

        getCalcStatusData = function() {
            ScenarioCalculateService.get(scenarioId).then(function(data) {
                $scope.calcStatesData = transformStatusData(data);
                $scope.runningStates  = $scope.calcStatesData.runningStates;
                $scope.currentState   = $scope.calcStatesData.currentState;
                $scope.step           = getCurrentStepIndex($scope.calcStatesData);
                updateCalcStatusData($scope.currentState);
            });
        },

        updateCalcStatusData = function(_currentState) {
            if (isCalcSucceed(_currentState)) {
                $scope.stopProgress();
                $scope.progressValue = 100;
                $timeout(function() {
                    $scope.toggleSuccess(true);
                }, 2000);
            } else if (isCalcFailed(_currentState)) {
                $scope.stopProgress();
                $scope.success = false;
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
        },

        isCalcInProgrss = function(_currentState) {
            return _currentState.completed;
        },

        isCalcFailed = function(_currentState) {
            if (_currentState.name === 'FAILED') {
                return true;
            } else {
                return false;
            }
        },

        isCalcSucceed = function(_currentState) {
            if (_currentState.name === 'SUCCESSFUL') {
                return true;
            } else {
                return false;
            }
        };


    // scope functions
    $scope.runProgress = function() {
        $scope.stopProgress();
        $scope.timer = $interval(function(){
            getCalcStatusData($scope.calcStatesData);
        }, CONFIG.view.ScenarioCalculate.timerInterval);
    }

    $scope.stopProgress = function() {
        $interval.cancel($scope.timer);
    };

    $scope.resetProgress = function() {
        $scope.toggleCalculation(false);
        ScenarioCalculateService.post(5);
        init();
        $scope.toggleCalculation(true);
    };

    $scope.returnToEdit = function() {
        $scope.stopProgress();
        $scope.toggleSuccess(false);
        $scope.toggleCalculation(false);
        $scope.location = "/edit";
    };

    $rootScope.$on('$locationChangeStart', function() {
        var currentPath = $location.path(),
            re = /results$/;
        if(currentPath.search(re) !== -1) {
            $scope.runProgress();
        } else {
            $scope.stopProgress();
        }
    });

    // fire off functions
    init();

}]);