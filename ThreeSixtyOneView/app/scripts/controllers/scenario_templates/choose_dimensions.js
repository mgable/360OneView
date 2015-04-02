'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ChooseDimensionsCtrl
 * @description
 * # ChooseDimensionsCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
    .controller('ChooseDimensionsCtrl', ['$scope', 'MetaDataService', 'DimensionService', 'EVENTS', 'CONFIG', function($scope, MetaDataService, DimensionService, EVENTS, CONFIG) {
        var init = function() {
            $scope.times = CONFIG.view.ScenarioTemplates.times;
            $scope.selectedTime = $scope.times[0];

            getDimensions('spend', 'TOUCHPOINT', [$scope.currentType.label]);
            getDimensions('kpi', 'OUTCOME', ['simulation', undefined, undefined, false, false]);
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

		$scope.$on(EVENTS.moveForward, function() {

            var cubes = [],
                filteredTimeDimension,
                filteredSpendDimensions,
                filteredKpiDimensions;

            filteredTimeDimension = DimensionService.switchTimeDimension($scope.spendTimeDimension, $scope.selectedTime);
            filteredSpendDimensions = _.union(DimensionService.getSelectedDimensions($scope.spendDimensions), filteredTimeDimension);
            filteredKpiDimensions = _.union(DimensionService.getSelectedDimensions($scope.spendDimensions), filteredTimeDimension);
            cubes.push([filteredSpendDimensions, filteredKpiDimensions]);
            console.log('cubes: ', cubes);
		});

		init();

	}]);
