'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationSelectCtrl', ['$scope', '$rootScope', '$q', 'EVENTS', 'PivotMetaService', 'DialogService', 'ManageScenariosService', 'ManageAnalysisViewsService', 'ReportsService',
function ($scope, $rootScope, $q, EVENTS, PivotMetaService, DialogService, ManageScenariosService, ManageAnalysisViewsService, ReportsService) {
	var baseScenario,
		spendCubeId,
		spendDimensions,
		spendElement,
		spendDefaultView,

		init = function init() {
			$scope.totalBudget = 0;
			$scope.viewData = {};
		},
		deleteSpendView = function deleteSpendView(viewId, spendCubeId, spendDimensions) {
			return ManageAnalysisViewsService.deleteView(viewId, spendCubeId).then(function() {
				$scope.viewData = {};
				return setUpSpendView(spendDimensions, spendCubeId);
			});
		},
		setUpSpendView = function setUpSpendView(spendDimensions, spendCubeId) {
			return PivotMetaService.createEmptyView(spendDimensions, {id: spendCubeId, label: 'Recommendation ' + Date.now()}).then(function(view) {
				$scope.viewData = view;
				// set the view in the parent controller for removal upon cancellation of the create recommendation workflow
				$scope.setSpendView(view);

				$scope.addedFilters = PivotMetaService.getAddedFilters($scope.viewData.filters, spendDimensions);
				$scope.membersList = PivotMetaService.generateMembersList(spendDimensions);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, spendDimensions, $scope.viewData);
				
				// broadcast the spend view to kpi (define) controller to create the related by view there
				$rootScope.$broadcast(EVENTS.spendViewCreated, view);
				return view;
			});
		},
		getAnalysisElement = function getAnalysisElement(baseScenario, spendCubeId) {
			return ManageScenariosService.getAnalysisElementByScenarioAndCube(baseScenario.id, spendCubeId).then(function(analysisElement) {
				spendElement = analysisElement;
				return spendElement;
			});
		},
		getTotalSpend = function getTotalSpend(baseScenario, spendCubeId, spendDimensions) {
			var promises = [];

			promises.push(getAnalysisElement(baseScenario, spendCubeId));
			// if viewData.id exists, first remove the old view and then create a new one (in case base scenario is changed)
			if($scope.viewData.id) {
				promises.push(deleteSpendView($scope.viewData.id, spendCubeId, spendDimensions));
			} else {
				promises.push(setUpSpendView(spendDimensions, spendCubeId));
			}

			$q.all(promises).then(function(responses) {
				updateTotalSpend(responses[0].id, responses[1].id);
			});
		},
		updateTotalSpend = function updateTotalSpend(analysisElementId, spendViewId) {
			ReportsService.getSummary(analysisElementId, spendViewId).then(function(spendSummary) {
				$scope.totalBudget = spendSummary[0].Spend ? spendSummary[0].Spend.value : spendSummary[0].SPEND.value;
			});
		};
	$scope.getSpendDimensions = function() {
		return spendDimensions;
	};

	$scope.filtersModal = function(category) {
		var filtersModalCallback = function(newFilterData) {
			$scope.addedFilters = newFilterData;
			$scope.viewData.filters = PivotMetaService.updateFilters(spendDimensions, newFilterData, $scope.membersList, $scope.viewData.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure(newFilterData, spendDimensions, $scope.viewData);
			PivotMetaService.updateView(spendCubeId, $scope.viewData).then(function(view) {
				updateTotalSpend(spendElement.id, $scope.viewData.id);
			});
		};

		DialogService.filtersModal(category, $scope.addedFilters, $scope.viewData.rows.concat($scope.viewData.columns), $scope.spendDimensions, filtersModalCallback);
	};

	$scope.$on(EVENTS.dimensionsReady, function(event, dimensions) {
		spendDimensions = dimensions;
		baseScenario = $scope.getBaseScenario(),
		spendCubeId = $scope.getSpendCubeId();

		getTotalSpend(baseScenario, spendCubeId, dimensions);
	});

	init();
}]);
