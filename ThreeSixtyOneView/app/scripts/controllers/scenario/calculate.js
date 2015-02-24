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
        calcStatesData = {},
        runningStates = {},
        currentState = {},
        stopTimer = {},

        // init function
        init = function() {
            getCalcStatesData();
            if(AnalyticCalculationsService.isInProgress($scope.scenarioState.message)) {
                $scope.progressValue = 0;
                $scope.step = 0;
                $scope.errorMsg = "";
                runProgress();
            } else if (AnalyticCalculationsService.isSuccess($scope.scenarioState.message)) {
                $state.go("Scenario.results");
            }
        },
        // get the current index for status
        getCurrentStateIndex = function(_data) {
            if (AnalyticCalculationsService.isSuccess($scope.scenarioState.message)) {
                return CONFIG.view.ScenarioCalculate.stateLength;
            } else {
                return _.indexOf(_.pluck(_data.runningStates, 'completed'), false);
            }
        },
        // initiate the model
        getCalcStatesData = function() {
            AnalyticCalculationsService.get(Scenario.id).then(function(data) {
                calcStatesData = data;
                runningStates = calcStatesData.runningStates;
                var currentState = AnalyticCalculationsService.getScenarioState(calcStatesData.currentState),
                    setState;
                _.each(scenarioStates, function(v, k) {
                    if (v.message === currentState.message) { setState = k; }
                });
                $scope.setState(setState);
                $scope.step = getCurrentStateIndex(calcStatesData);
                $scope.progressValue = stepValue * $scope.step;
                getCurrentStateTitle();
                getProgressbarType();
                runningStates = addIcons(runningStates);
                updateCalcStatesData();
            });
        },
        // update states data
        updateCalcStatesData = function(_data) {
            if (AnalyticCalculationsService.isSuccess($scope.scenarioState.message)) {
                $state.go("Scenario.results");
            } else if (AnalyticCalculationsService.isFailed($scope.scenarioState.message)) {
                stopProgress();
                $scope.errorMsg = calcStatesData.additionalInfo.message;
            }
        },
        // start the progress
        runProgress = function() {
            stopTimer = $interval(function(){
                getCalcStatesData();
            }, CONFIG.view.ScenarioCalculate.timerInterval);
        },
        // stop the progress
        stopProgress = function() {
            $interval.cancel(stopTimer);
            stopTimer = null;
        },
        // change progressbar color based on states
        getProgressbarType = function() {
            var type = AnalyticCalculationsService.isFailed($scope.scenarioState.message) ? 'danger' : 'success';
            $scope.progressbarType = type;
        },
        // add icons to state list
        addIcons = function(data) {
            _.each(data, function(v, k) {
                if (k === $scope.step) {
                    if ($scope.scenarioState.message === 'FAILED') {
                        v.iconType = 'failed';
                        v.iconText = 'Error';
                    } else if ($scope.scenarioState.message === 'in_progress') {
                        v.iconType = 'in_progress';
                        v.iconText = '';
                    }
                } else if (k < $scope.step) {
                    v.iconType = 'check';
                    v.iconText = '';
                }
            });
            return data;
        },
        // get the current state title
        getCurrentStateTitle = function() {
            $scope.currentStateTitle = _.find(scenarioStates, function(v){
                return v.message === $scope.scenarioState.message;
            });
        };

    // get states data
    $scope.getStates = function() {
        return runningStates;
    };
    // reset the progress
    $scope.retry = function() {
        stopProgress();
        $scope.setState('NOT_CALCULATED');
        AnalyticCalculationsService.post(Scenario.id).then(function() {
            $scope.setState('IN_PROGRESS');
            init();
        });
    };
    // go to the edit page
    $scope.gotoEdit = function() {
        stopProgress();
        $scope.setState('NOT_CALCULATED');
        $state.go("Scenario.edit");
    };
    // style complated state
    $scope.styleState = function(index) {
        return $scope.step >= index ? true : false;
    }
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