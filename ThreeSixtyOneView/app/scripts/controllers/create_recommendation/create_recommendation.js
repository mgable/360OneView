'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
	.controller('CreateRecommendationCtrl', function ($scope) {
		$scope.isRecommendTypeStrategy = false;

		$scope.assumptions = [
			{field: "Macroeconomics", label: "Corp Macroeconomics"},
			{field: "Pricing", label: "Corp Pricing"},
			{field: "Competition", label: "Corp Competition"},
			{field: "Cost Assumption", label: "Corp Cost Assumption"},
		];
	});
