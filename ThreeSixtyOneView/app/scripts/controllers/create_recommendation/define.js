'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationDefineCtrl', ['$scope', 'EVENTS', 'DialogService', 'ManageAnalysisViewsService', 'PivotMetaService',
function ($scope, EVENTS, DialogService, ManageAnalysisViewsService, PivotMetaService) {
	var spendView,
		outcomeCubeId,
		outcomeDimensions,
		outcomeSpecificDimensions,
		outcomeView,
		membersList,
		isSpendViewLoaded = false,
		isOutcomeDimensionsLoaded = false,
		init = function init() {
			$scope.categorizedValue = [];
		},
		createOutcomeView = function createOutcomeView(_spendView, _outcomeCubeId, _outcomeDimensions) {
			PivotMetaService.createEmptyView(_outcomeDimensions, {id: _outcomeCubeId, label: 'Recommendation ' + Date.now()}, _spendView.id).then(function(_outcomeView) {
				outcomeView = _outcomeView;

				$scope.addedFilters = PivotMetaService.getAddedFilters(_outcomeView.filters, _outcomeDimensions);
				membersList = PivotMetaService.generateMembersList(_outcomeDimensions);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, _outcomeDimensions, _outcomeView);
			});
		};

	$scope.selectKpi = function(kpi) {
		$scope.newRecommendation.goal.id = kpi.id;
		$scope.newRecommendation.goal.name = kpi.name;
		$scope.newRecommendation.goal.label = kpi.label;
	};

	$scope.getOutcomeDimensions = function() {
		return outcomeDimensions;
	};

	$scope.isOutcomeDimensionVisible = function(dimension) {
		if(!outcomeSpecificDimensions) {
			return false;
		}
		return outcomeSpecificDimensions.map(function(_dimension) {return _dimension.id}).indexOf(dimension.id) > -1;
	};

	$scope.filtersModal = function(category) {
		var filtersModalCallback = function(newFilterData) {
			$scope.addedFilters = newFilterData;
			outcomeView.filters = PivotMetaService.updateFilters(outcomeDimensions, newFilterData, membersList, outcomeView.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure(newFilterData, outcomeDimensions, outcomeView);
		};

		DialogService.filtersModal(category, $scope.addedFilters, outcomeView.rows.concat(outcomeView.columns), outcomeSpecificDimensions, filtersModalCallback);
	};

	$scope.$on(EVENTS.outcomeDimensionsReady, function(event, _outcomeCubeId, _outcomeDimensions, _outcomeSpecificDimensions) {
		// only for strategy scenarios
		if($scope.getBaseScenario().template.type !== 'Strategy') {
			return;
		}

		outcomeCubeId = _outcomeCubeId;
		outcomeDimensions = _outcomeDimensions;
		outcomeSpecificDimensions = _outcomeSpecificDimensions;

		isOutcomeDimensionsLoaded = true;
		if(isSpendViewLoaded) {
			createOutcomeView(spendView, _outcomeCubeId, _outcomeDimensions);
		}
	});

	$scope.$on(EVENTS.spendViewCreated, function(event, _spendView) {
		// only for strategy scenarios
		if($scope.getBaseScenario().template.type !== 'Strategy') {
			return;
		}

		// get the spend view created in the select controller
		spendView = _spendView;

		isSpendViewLoaded = true;
		if(isOutcomeDimensionsLoaded) {
			createOutcomeView(_spendView, outcomeCubeId, outcomeDimensions);
		}
	});

	init();
}]);
