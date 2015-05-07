'use strict';

/**
* @ngdoc function
* @name ThreeSixtyOneView.controller:ScenarioCalculationCtrl
* @description
* # ScenarioCalculationCtrl
* Controller of the ThreeSixtyOneView
*/
angular.module('ThreeSixtyOneView').controller('ScenarioCalculationCtrl', ['$scope', 'AnalyticCalculationsService', 'CONFIG', '$state', 'ScenarioStatesService',
    function ($scope, AnalyticCalculationsService, CONFIG, $state, ScenarioStatesService) {

    var stepLength,
        stepValue,
        runningStates = {},
        scenarioId = $state.params.scenarioId,

        // init function
        init = function() {
            $scope.progressValue = 0;
            $scope.step = 0;
            $scope.errorMessage = "";
            ScenarioStatesService.startPull([scenarioId]);
        },
        // get the current index for status
        getCurrentStateIndex = function(_data) {
            if (AnalyticCalculationsService.isSuccess($scope.scenarioState.message)) {
                return stepLength;
            } else {
                var step = _.indexOf(_.pluck(_data.runningStates, 'completed'), false);
                return step === -1 ? 0 : step;
            }
        },
        // initiate the model
        getCalcStatesData = function(response) {
            if (_.isUndefined(stepLength)) {
                stepLength = response.runningStates.length;
                stepValue = 100 / stepLength;
            }

            runningStates = response.runningStates;
            $scope.updateCalculateState(response.currentState);

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
            $scope.currentStateTitle = _.find($scope.scenarioStates, function(v){
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
        AnalyticCalculationsService.post(scenarioId).then(function() {
            init();
        });
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

    $scope.$on('broadcastStates', function(event, response) {
        getCalcStatesData(response[0]);
        $scope.disableSimulateButton(false);
        if(AnalyticCalculationsService.isInProgress($scope.scenarioState.message)) {
            $scope.disableSimulateButton(true);
        } else if (AnalyticCalculationsService.isSuccess($scope.scenarioState.message)) {
            $state.go("Scenario.results");
        }
    });

    // fire off init function
    init();

}]);