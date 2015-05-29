'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationSelectCtrl', ['$scope', '$q', 'EVENTS', 'PivotMetaService', 'DialogService', 'ManageScenariosService', 'ManageAnalysisViewsService', 'ReportsService',
function ($scope, $q, EVENTS, PivotMetaService, DialogService, ManageScenariosService, ManageAnalysisViewsService, ReportsService) {
	var baseScenario,
		spendCubeId,
		spendElement,
		spendDefaultView,

		init = function init() {
			$scope.totalBudget = 0;
		},
		getAnalysisElement = function getAnalysisElement(baseScenario, spendCubeId) {
			return ManageScenariosService.getAnalysisElementByScenarioAndCube(baseScenario.id, spendCubeId).then(function(analysisElement) {
				spendElement = analysisElement;
				return spendElement;
			});
		},
		getDefaultView = function getDefaultView(spendCubeId) {
			return ManageAnalysisViewsService.getViewsList(spendCubeId).then(function(views) {
				spendDefaultView = undefined;

				views.forEach(function(view) {
					if(view.isDefault) {
						spendDefaultView = view;
					}
				});

				if(!spendDefaultView) {
					spendDefaultView = views[0];
				}

				return spendDefaultView;
			});
		},
		getTotalSpend = function getTotalSpend(baseScenario, spendCubeId) {
			var promises = [];
			promises.push(getAnalysisElement(baseScenario, spendCubeId));
			promises.push(getDefaultView(spendCubeId));

			$q.all(promises).then(function(responses) {
				ReportsService.getSummary(responses[0].id, responses[1].id).then(function(spendSummary) {
					$scope.totalBudget = spendSummary[0].SPEND.value;
				});
			});

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

		baseScenario = $scope.getBaseScenario(),
		spendCubeId = $scope.getSpendCubeId();
		getTotalSpend(baseScenario, spendCubeId);
	});

	init();
}]);
