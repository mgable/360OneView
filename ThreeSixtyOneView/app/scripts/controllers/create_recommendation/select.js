'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationSelectCtrl', ['$scope', 'EVENTS', 'PivotMetaService', 'DialogService',
function ($scope, EVENTS, PivotMetaService, DialogService) {
	var init = function init() {
	};

	$scope.filtersModal = function(category) {
		var filtersModalCallback = function(newFilterData) {
			$scope.addedFilters = newFilterData;
			$scope.viewData.filters = PivotMetaService.updateFilters($scope.spendCube, newFilterData, $scope.membersList, $scope.viewData.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure(newFilterData, $scope.spendDimensions, $scope.viewData);
		};

		DialogService.filtersModal(category, $scope.addedFilters, $scope.viewData.rows.concat($scope.viewData.columns), $scope.spendDimensions, filtersModalCallback);
	};

	$scope.$on(EVENTS.dimensionsReady, function(event, spendDimensions) {
		$scope.viewData = PivotMetaService.formEmptyView(spendDimensions, {label: 'Recommendation'});
		$scope.addedFilters = PivotMetaService.getAddedFilters($scope.viewData.filters, spendDimensions);
		$scope.membersList = PivotMetaService.generateMembersList(spendDimensions);
		$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, spendDimensions, $scope.viewData);
	});

	init();
}]);
