'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ScenarioTemplatesScenarioTemplatesViewsCtrl
 * @description
 * # ScenarioTemplatesScenarioTemplatesViewsCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
    .controller('ScenarioTemplatesViewsCtrl', ['$scope', function($scope) {
        $scope.done = function(){
        	console.info("done!!!!!");
        };
    }]);
