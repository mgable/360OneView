'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ScenarioTemplatesScenarioTemplatesViewsCtrl
 * @description
 * # ScenarioTemplatesScenarioTemplatesViewsCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesViewsCtrl', ['$scope', 'MetaDataService', 'PivotMetaService', 'DialogService', 'dimensionsData', function($scope, MetaDataService, PivotMetaService, DialogService, dimensionsData) {
		var init = function() {
			$scope.template = { name: '', description: '', type: 'Action' };
			$scope.granularities = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];

			// render spend dimensions cards
			var spendCubeParams = $scope.template.type,
				spendCubeName = 'TOUCHPOINT',
				spendCubeType = 'spend';
			getDimensions(spendCubeType, spendCubeName, spendCubeParams);
		},
		getDimensions = function(cubeType, cubeName, cubeParams) {
			var getCubeId = function(cubeName, cubeParams) {
				return MetaDataService
							.getCubes(cubeParams)
							.then(function(cubes) {
								$scope[cubeType+'Cubes'] = cubes;
								return cubes.length !== 0 ? _.find(cubes, function(v) { return v.name === cubeName }).id : 1;
							});
			},
			buildDimensions = function(cubeId) {
				return MetaDataService
							.buildDimensionsTree(cubeId)
							.then(function(dimension) {
								$scope[cubeType+'Dimensions'] = dimension;
								return dimension;
	    					});
			},
			addSelectedValue = function(dimension) {
				_.each(dimension, function(v, k) {
					_.each(v.members, function(v1) {
						v1.isSelected = v1.isSelected || true;
					});
				});
				$scope[cubeType+'Dimensions'] = dimension;
				return dimension;
			};

			getCubeId(cubeName, cubeParams)
				.then(buildDimensions)
				.then(addSelectedValue);
		},
		getFilteredDimensions = function(dimension) {
			return _.filter(angular.copy(dimension), function(v) {
				v.members = _.filter(v.members, function(v1) {
					return v1.isSelected === true;
				});
				return v.isSelected === true;
			});
		};
		init();

		$scope.getFilterArray = function(dimension) {
			var dimensionLength = dimension.members.length,
				filterArray = _.pluck(_.filter(dimension.members, function(dimension) { return dimension.isSelected === true; }), 'label');
			return (filterArray.length === dimensionLength) ? 'All' : filterArray.join();
		};
		$scope.filtersModal = function(category) {
			var filteredDimensions = getFilteredDimensions($scope.spendDimensions);
			$scope.addedFilters = PivotMetaService.addAllFilters(filteredDimensions);
			var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
				{dimension: _.find(filteredDimensions, function(v) { return category.id === v.id;}), addedFilters: $scope.addedFilters, viewData: {}, dimensions: filteredDimensions},
				{windowSize: 'lg', windowClass: 'filters-modal'});

			dialog.result.then(function(data) {
			});
		};
		$scope.kpiDimensionsList = dimensionsData.kpiDimensionsList;
	}]).factory('dimensionsData', function() {
		var dimensionsData = {
			kpiDimensionsList: [{
				id: 1,
				label: "KPIs",
				children: [
					{ id: 1, label: "Revenue", isSelected: true, isLocked: true },
					{ id: 2, label: "Sales", isSelected: false, isLocked: false },
					{ id: 3, label: "Total Incentives", isSelected: true, isLocked: false },
					{ id: 4, label: "KPIs 4", isSelected: true, isLocked: true },
					{ id: 5, label: "KPIs 5", isSelected: true, isLocked: false },
					{ id: 6, label: "KPIs 6", isSelected: false, isLocked: false },
					{ id: 7, label: "KPIs 7", isSelected: false, isLocked: false },
					{ id: 8, label: "KPIs 8", isSelected: true, isLocked: false }
				]
			}]
		};
		return dimensionsData;
	});
