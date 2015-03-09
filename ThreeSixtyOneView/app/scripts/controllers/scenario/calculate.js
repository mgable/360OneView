'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:ScenarioCalculationCtrl
* @description
* # ScenarioCalculationCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('ScenarioCalculationCtrl', ['$scope', '$interval', '$timeout', 'AnalyticCalculationsService', 'Status', 'Scenario', 'CONFIG', '$location', '$rootScope', '$state', 'EVENTS', 'ScenarioStatesService',
    function ($scope, $interval, $timeout, AnalyticCalculationsService, Status, Scenario, CONFIG, $location, $rootScope, $state, EVENTS, ScenarioStatesService) {

    var stepLength = CONFIG.view.ScenarioCalculate.stateLength,
        stepValue = 100 / stepLength,
        scenarioStates = CONFIG.application.models.ScenarioAnalytics.states,
        runningStates = {},
        currentState = {},

        // init function
        init = function() {
            // AnalyticCalculationsService.startCalculation(Status, Scenario.id).then(function() {
            //     ScenarioStatesService.startPull([Scenario.id]);
            // });
            ScenarioStatesService.startPull([Scenario.id]);
            $scope.$on('broadcastStates', function(event, response) {
                getCalcStatesData(response[0]);
                $scope.disableSimulateButton(false);
                if(AnalyticCalculationsService.isInProgress($scope.scenarioState.message)) {
                    $scope.progressValue = 0;
                    $scope.step = 0;
                    $scope.errorMessage = "";
                    $scope.disableSimulateButton(true);
                } else if (AnalyticCalculationsService.isSuccess($scope.scenarioState.message)) {
                    $state.go("Scenario.results");
                }
            });
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
        getCalcStatesData = function(response) {
            runningStates = response.runningStates;
            currentState = ScenarioStatesService.getScenarioState(response.currentState);
            var setState;
            _.each(scenarioStates, function(v, k) {
                if (v.message === currentState.message) { setState = k; }
            });
            $scope.setState(setState);
            $scope.step = getCurrentStateIndex(response);
            $scope.progressValue = stepValue * $scope.step;
            getCurrentStateTitle();
            getProgressbarType();
            runningStates = addIcons(runningStates);
            updateCalcStatesData(response);
        },
        // update states data
        updateCalcStatesData = function(response) {
            if (AnalyticCalculationsService.isSuccess($scope.scenarioState.message)) {
                $state.go("Scenario.results");
            } else if (AnalyticCalculationsService.isFailed($scope.scenarioState.message)) {
                ScenarioStatesService.stopPull();
                $scope.errorMessage = response.additionalInfo.message;
            }
        },
        // change progressbar color based on states
        getProgressbarType = function() {
            $scope.progressbarType = AnalyticCalculationsService.isFailed($scope.scenarioState.message) ? 'danger' : 'success';
        },
        // add icons to state list
        addIcons = function(data) {
            _.each(data, function(v, k) {
                if (k === $scope.step) {
                    if (AnalyticCalculationsService.isFailed($scope.scenarioState.message)) {
                        v.iconType = 'failed';
                        v.iconText = 'Error';
                    } else if (AnalyticCalculationsService.isInProgress($scope.scenarioState.message)) {
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
        ScenarioStatesService.stopPull();
        $scope.setState('IN_PROGRESS');
        init();
    };
    // go to the edit page
    $scope.gotoEdit = function() {
        ScenarioStatesService.stopPull();
        $state.go("Scenario.edit");
    };
    // style complated state
    $scope.styleState = function(index) {
        return $scope.step >= index ? true : false;
    };

    // fire off init function
    init();

}]);