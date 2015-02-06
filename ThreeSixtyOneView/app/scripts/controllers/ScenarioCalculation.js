'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:ScenarioCalculationCtrl
* @description
* # ScenarioCalculationCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('ScenarioCalculationCtrl', ['$scope', '$interval', '$timeout', 'AnalyticCalculationsService', 'Calculate', 'submitCalculate', 'Scenario', 'CONFIG', '$location', '$rootScope', '$state',
    function ($scope, $interval, $timeout, AnalyticCalculationsService, Calculate, submitCalculate, Scenario, CONFIG, $location, $rootScope, $state) {

    var stepLength = CONFIG.view.ScenarioCalculate.stateLength,
        stepValue = 100 / stepLength,

        scenarioStates = CONFIG.application.models.ScenarioAnalytics.states,
        NOT_CALCULATED = scenarioStates.NOT_CALCULATED.message,
        FAILED = scenarioStates.FAILED.message,
        SUCCESS = scenarioStates.SUCCESS.message,
        IN_PROGRESS = scenarioStates.IN_PROGRESS.message,

        calcStatesData = {},
        currentState = {},
        stopTimer = {},

        // init function
        init = function() {
            $scope.progressValue = 0;
            $scope.step = 0;
            $scope.errorMsg = "";
            getCalcStatesData(Calculate);
            if($scope.scenarioState === IN_PROGRESS) {
                runProgress();
            } else if ($scope.scenarioState === SUCCESS) {
                $state.go("Scenario.results");
            }
            getProgressbarType();
            angular.element('.Scenario').css('height', 'auto');
        },
        // get the current index for status
        getCurrentStateIndex = function(_data) {
            if ($scope.scenarioState === SUCCESS) {
                return _data.runningStates.length;
            } else {
                return _.indexOf(_.pluck(_data.runningStates, 'completed'), false);
            }
        },
        // trim the strings
        trimString = function(str) {
            str = str.trim();
            return str;
        },
        // initiate the model
        getCalcStatesData = function() {
            AnalyticCalculationsService.get(Scenario.id).then(function(data) {
                getCurrentStateTitle();
                calcStatesData = transformStatesData(data);
                $scope.runningStates = calcStatesData.runningStates;
                currentState = calcStatesData.currentState;
                $scope.step = getCurrentStateIndex(calcStatesData);
                updateCalcStatesData(currentState);
            });
        },
        // update states data
        updateCalcStatesData = function() {
            if ($scope.scenarioState === SUCCESS) {
                $scope.progressValue = 100;
                $state.go("Scenario.results");
            } else if ($scope.scenarioState === FAILED) {
                stopProgress();
                $scope.errorMsg = calcStatesData.additionalInfo.message;
                $scope.progressValue = stepValue * $scope.step;
            } else {
                $scope.progressValue = stepValue * $scope.step;
            }
        },
        // transform states data
        transformStatesData = function(_data) {
            angular.forEach(_data.runningStates, function(value, index) {
                value.id = index + 1;
                value.name = trimString(value.name);
                value.name = trimString(value.label);
            });
            _data.currentState.name = trimString(_data.currentState.name);
            _data.currentState.label = trimString(_data.currentState.label);
            return _data;
        },
        // start the progress
        runProgress = function() {
            stopTimer = $interval(function(){
                getCalcStatesData(calcStatesData);
            }, CONFIG.view.ScenarioCalculate.timerInterval);
        },
        // stop the progress
        stopProgress = function() {
            $interval.cancel(stopTimer);
            stopTimer = null;
        },
        // change progressbar color based on states
        getProgressbarType = function() {
            var type = ($scope.scenarioState === FAILED) ? 'danger' : 'success';
            $scope.progressbarType = type;
        },
        // get the current state title
        getCurrentStateTitle = function() {
            $scope.currentStateTitle = _.find(scenarioStates, function(v){
                return v.message === $scope.scenarioState;
            });
        };

    // get states data
    $scope.getStates = function() {
        return $scope.runningStates;
    };
    // reset the progress
    $scope.resetProgress = function() {
        $scope.scenarioState = NOT_CALCULATED;
        AnalyticCalculationsService.post(Scenario.id).then(function() {
            $scope.scenarioState = IN_PROGRESS;
            getProgressbarType();
            init();
        });
    };
    // return to the editor page
    $scope.returnToEdit = function() {
        stopProgress();
        $state.go("Scenario.edit");
    };

    // whenever leave calculate page, stop progress
    $rootScope.$on('$locationChangeStart', function(event, newPath) {
        var currentPath = newPath,
            re = /calculate$/;
        if (!re.test(currentPath)) {
            stopProgress();
        }
    });

    // fire off init function
    init();

}]);