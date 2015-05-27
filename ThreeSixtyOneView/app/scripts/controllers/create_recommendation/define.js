'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationDefineCtrl', ['$scope', function ($scope) {
	var init = function init() {
		};

	$scope.selectKpi = function(kpi) {
		$scope.newRecommendation.goal.id = kpi.id;
		$scope.newRecommendation.goal.name = kpi.name;
		$scope.newRecommendation.goal.label = kpi.label;
	};

	init();
}]);
