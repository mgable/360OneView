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
        var scenarioTemplateId,
        init = function() {
            scenarioTemplateId = _.find($scope.scenarioTemplates, function(v) {  return v.type === $scope.currentType.label; }).id
            getDimensions('spend', 'Marketing Plan', ['simulation', scenarioTemplateId, undefined, false, true]);
            getDimensions('kpi', 'KPI', ['simulation', scenarioTemplateId, undefined, false, false]);
        },
        getDimensions = function(cubeType, cubeName, cubeParams) {
            var getCubeId = function(cubeName, cubeParams) {
                return MetaDataService
                    .getCubes.apply(this, cubeParams)
                    .then(function(cubes) {
                        $scope[cubeType+'Cubes'] = cubes;
                        return _.find(cubes, function(v) { return v['label'].indexOf(cubeName) !== -1 }).id;
                    });
            },
            buildDimensions = function(cubeId) {
                return MetaDataService
                    .buildDimensionsTree(cubeId)
                    .then(function(dimension) {
                        $scope.timeDimension = _.find(dimension, function(v) { return v.type === 'TimeDimension' });
                        $scope.times = _.pluck($scope.timeDimension.members, 'label');

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

            $scope.setTimeGranularity($scope.selectedTime);
            $scope.setDimensionLabels($scope.spendDimensions, 'spend');
            $scope.setDimensionLabels($scope.kpiDimensions, 'kpi');
            $scope.timeDimension.members = _.filter($scope.timeDimension.members, function(v) { return v.label === $scope.selectedTime; });
            var cubes = {
                time: [$scope.timeDimension] || [],
                spend: DimensionService.getSelectedDimensions($scope.spendDimensions) || [],
                kpi: DimensionService.getSelectedDimensions($scope.kpiDimensions) || []
            };
            console.log('cubes: ', cubes);

		});

		init();

	}]);
