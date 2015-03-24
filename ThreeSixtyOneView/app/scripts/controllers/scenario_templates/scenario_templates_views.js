'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ScenarioTemplatesScenarioTemplatesViewsCtrl
 * @description
 * # ScenarioTemplatesScenarioTemplatesViewsCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesViewsCtrl', ['$scope', 'MetaDataService', 'PivotMetaService', 'dimensionsData', function($scope, MetaDataService, PivotMetaService, dimensionsData) {
		var init = function() {
			$scope.template = {
				name: '',
				description: '',
				type: 'Action'
			};

			// render spend dimensions cards
			var spendCubeParams = $scope.template.type,
				spendCubeName = 'TOUCHPOINT',
				spendCubeType = 'spend';
			getDimensionsList(spendCubeType, spendCubeName, spendCubeParams);

			// render kpi dimensions cards
			var kpiCubeParams = ['simulation', null, undefined, undefined, false].join(),
				kpiCubeName = 'OUTCOME',
				kpiCubeType = 'kpi';
			// getDimensionsList(kpiCubeType, kpiCubeName, kpiCubeParams);
		},
		getDimensionsList = function(cubeType, cubeName, cubeParams) {
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
			getFirstLevelDimesnsion = function(dimension) {
				var dimensionsList = [];
				_.each(dimension, function(v, k) {
					var dimension = {};
						dimension.id = v.id;
						dimension.label = v.label;
						dimension.isSelected = v.isSelected || true;
						dimension.children = [];
						_.each(v.members, function(v1) {
							v1.isSelected = v1.isSelected || true;
							dimension.children.push(_.pick(v1, 'id', 'label', 'isSelected'))
						});
						dimensionsList.push(dimension);
				});
				$scope[cubeType+'DimensionsList'] = dimensionsList;
				return dimensionsList;
			};

			getCubeId(cubeName, cubeParams)
				.then(buildDimensions)
				.then(getFirstLevelDimesnsion);

			$scope[cubeType+'Cubes'] = null;
			$scope[cubeType+'Dimensions'] = null;
			$scope[cubeType+'DimensionsList'] = null;
		};
		init();
		$scope.kpiDimensionsList = dimensionsData.kpiDimensionsList;
		$scope.getFilterArray = function(dimension) {
			var dimensionLength = dimension.children.length,
				filterArray = _.pluck(_.filter(dimension.children, function(dimension) { return dimension.isSelected === true; }), 'label');
			return (filterArray.length === dimensionLength) ? 'All' : filterArray.join();
		}
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
