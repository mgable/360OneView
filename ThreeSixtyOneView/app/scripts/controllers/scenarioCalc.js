'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp.controller:scenarioCalcCtrl
* @description
* # scenarioCalcCtrl
* Controller of the threeSixtOneViewApp
*/
angular.module('ThreeSixtyOneView').controller('scenarioCalcCtrl', ['$scope', '$interval', 'ScenarioCalculate', function ($scope, $interval, ScenarioCalculate) {

    // private varibles and functions
    var stepLen   = ScenarioCalculate.runningStates.length,
        stepValue = 100 / stepLen,

        // init the progress
        init = function() {
            angular.element('.Scenario').css('height', 'auto');
            $scope.progressCompleted = false;
            $scope.progressValue     = 0;
            $scope.step              = 0;
            $scope.success           = true;
            $scope.timer;
            $scope.runProgress();
        },

        // transform and clean up statues data
        prepareStatesData = function(_data) {
            angular.forEach(_data.runningStates, function(value, key) {
                value.id = key + 1;
                var trimText = capitalize(value.name.trim().replace(/_/g, " "));
                value.name = trimText;
                value.label = trimText;
            });
            _data.currentState = _data.runningStates[0];
            console.log('INITIAL DATA: ', _data);
            return _data;
        },

        // capitalize a string
        capitalize = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        // update the states during calculation
        updateStates = function(_step, _data) {
            angular.forEach(_data.runningStates, function(value, key) {
                if(key <= _step && !value.completed) {
                    value.completed = true;
                }
            });
            _data.currentState = _data.runningStates[_step];
            console.log('STEP' + parseInt(_step+1) + ' UPDATE DATA: ', _data);
        },

        // reset the states
        resetStates = function(_data) {
            angular.forEach(_data.runningStates, function(value, key) {
                value.completed = false;
            });
            _data.currentState = _data.runningStates[0];
            console.log('INITIAL DATA: ', _data);
        },

        // interrupt states when errors occur
        interruptStates = function(_step, _data) {
            console.log('STEP' + parseInt(_step) + ' ERROR DATA: ', _data);
        };

    // scope variables
    $scope.calcStatesData = prepareStatesData(ScenarioCalculate);
    $scope.runningStates = $scope.calcStatesData.runningStates;

    // scope functions
    $scope.runProgress = function() {
        $scope.stopProgress();
        $scope.timer = $interval(function(){
            if ($scope.progressValue === 100) {
                $scope.progressCompleted = true;
            } else {
                updateStates($scope.step, $scope.calcStatesData);
                $scope.step += 1;
                $scope.progressValue += stepValue;
            }
        }, 1000);
    }

    $scope.stopProgress = function() {
      $interval.cancel($scope.timer);
    };

    $scope.resetProgress = function() {
        $scope.progressCompleted = false;
        $scope.progressValue     = 0;
        $scope.step              = 0;
        $scope.success           = true;
        resetStates($scope.calcStatesData);
        $scope.runProgress();
    }

    $scope.interruptProgress = function() {
        $scope.stopProgress();
        $scope.success = false;
        interruptStates($scope.step, $scope.calcStatesData);
    }

    // fire off functions
    init();

}]);