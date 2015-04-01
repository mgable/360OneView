'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ChooseDimensionsCtrl
 * @description
 * # ChooseDimensionsCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
	.controller('ChooseDimensionsCtrl', ['$scope', 'MetaDataService', 'DimensionService', 'EVENTS', function($scope, MetaDataService, DimensionService, EVENTS) {
		var init = function() {
			$scope.template = { name: '', description: '', type: 'Action' };
			$scope.times = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];
			$scope.selectedTime = 'Weekly';

			// render spend dimensions cards
			var spendCubeParams = [$scope.template.type],
				spendCubeName = 'TOUCHPOINT',
				spendCubeType = 'spend';
			getDimensions(spendCubeType, spendCubeName, spendCubeParams);

			// render kpi dimension card
			var kpiCubeParams = ['simulation', undefined, undefined, false, false],
				kpiCubeName = 'OUTCOME',
				kpiCubeType = 'kpi';
			getDimensions(kpiCubeType, kpiCubeName, kpiCubeParams);
		},
		getDimensions = function(cubeType, cubeName, cubeParams) {
			var getCubeId = function(cubeName, cubeParams) {
				return MetaDataService
					.getCubes.apply(this, cubeParams)
					.then(function(cubes) {
						$scope[cubeType+'Cubes'] = cubes;
						return cubes.length !== 0 ? _.find(cubes, function(v) { return v.name === cubeName }).id : 1;
					});
			},
			buildDimensions = function(cubeId) {
				return MetaDataService
					.buildDimensionsTree(cubeId)
					.then(function(dimension) {
						$scope[cubeType+'TimeDimension'] = _.find(dimension, function(v) { return v.label === 'TIME' });
						dimension = _.reject(dimension, function(v) { return v.label === 'TIME' });
						$scope[cubeType+'Dimensions'] = dimension;
						return dimension;
					});
			},
			addSelectedValue = function(dimension) {
				_.each(dimension, function(v, k) {
					v.isSelected = v.isSelected || true;
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
		};

		$scope.$watch('[spendDimensions, kpiDimensions, selectedTime]', function (newValue, oldValue) {
			$scope.spendDimensionList = DimensionService.generateDimensionsLabels(newValue[0]);
			$scope.kpiDimensionList = DimensionService.generateDimensionsLabels(newValue[1]);
			$scope.timeDimensionList = '(' + _.pluck(DimensionService.switchTimeDimension($scope.spendTimeDimension, newValue[2]), 'label').join() + ')';
		}, true);

		$scope.$on(EVENTS.moveForward, function() {
			console.log('ChooseDimensionsCtrl');
		});

		init();


	}]);