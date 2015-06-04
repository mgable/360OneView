'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationDefineCtrl', ['$scope', 'EVENTS', 'DialogService',
function ($scope, EVENTS, DialogService) {
	var init = function init() {
		};

	$scope.selectKpi = function(kpi) {
		$scope.newRecommendation.goal.id = kpi.id;
		$scope.newRecommendation.goal.name = kpi.name;
		$scope.newRecommendation.goal.label = kpi.label;
	};

	$scope.filtersModal = function(category) {
		var filtersModalCallback = function(newFilterData) {
			$scope.addedFilters = newFilterData;
			$scope.viewData.filters = PivotMetaService.updateFilters(spendDimensions, newFilterData, $scope.membersList, $scope.viewData.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure(newFilterData, spendDimensions, $scope.viewData);
		};

		DialogService.filtersModal(category, $scope.addedFilters, $scope.viewData.rows.concat($scope.viewData.columns), $scope.spendDimensions, filtersModalCallback);
	};

	$scope.$on(EVENTS.outcomeDimensionsReady, function(event, outcomeDimensions) {
		// create temp view or related by view
		// use the view for filter on kpi specific dimensions
		// only for strategy scenarios
		console.log(outcomeDimensions);
	});

	init();
}]);
