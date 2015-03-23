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
				getCubeAndBuildDimensions(spendCubeType, spendCubeName, spendCubeParams);
			// render kpi dimensions cards
			// var kpiCubeParams = ['simulation', null, undefined, undefined, false].join(),
			// 	kpiCubeName = 'OUTCOME',
			// 	kpiCubeType = 'kpi';
			// 	getCubeAndBuildDimensions(kpiCubeType, kpiCubeName, kpiCubeParams);
		},
		getCubeAndBuildDimensions = function(cubeType, cubeName, cubeParams) {
			MetaDataService.getCubes(cubeParams).then(function(cubes) {
				var cubeId = _.find(cubes, function(v) { return v.name === cubeName }).id;
				MetaDataService.buildDimensionsTree(cubeId).then(function(dimension) {
					$scope[cubeType + 'DimensionsList'] = getFirstLevelDimesnsion(dimension);
        		});
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
			return dimensionsList;
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
