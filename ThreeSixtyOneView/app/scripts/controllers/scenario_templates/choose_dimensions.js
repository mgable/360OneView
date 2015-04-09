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
            scenarioTemplateId = _.find($scope.scenarioTemplates, function(template) {  return template.type === $scope.currentType.label; }).id
            getDimensions('spend', 'Marketing Plan', ['simulation', scenarioTemplateId, undefined, false, true]);
            getDimensions('kpi', 'KPI', ['simulation', scenarioTemplateId, undefined, false, false]);
        },
        getDimensions = function(cubeType, cubeName, cubeParams) {
            var getCubeId = function(cubeName, cubeParams) {
                return MetaDataService
                    .getCubes.apply(this, cubeParams)
                    .then(function(cubes) {
                        $scope[cubeType + 'Cubes'] = cubes;
                        return _.find(cubes, function(cube) { return cube['label'].indexOf(cubeName) !== -1 }).id;
                    });
            },
            buildDimensions = function(cubeId) {
                return MetaDataService
                    .buildDimensionsTree(cubeId)
                    .then(function(dimensions) {
                        $scope.timeDimension = _.find(dimensions, function(dimension) { return dimension.type === 'TimeDimension' });
                        $scope.times = _.pluck($scope.timeDimension.members, 'label');

                        var newDimension = _.reject(dimensions, function(dimension) { return dimension.label === 'TIME' });
                        $scope[cubeType + 'Dimensions'] = newDimension;
                        return newDimension;
                    });
            },
            addSelectedValue = function(dimensions) {
                _.each(dimensions, function(dimension) {
                    dimension.isSelected = dimension.isSelected || true;
                    _.each(dimension.members, function(member) {
                        member.isSelected = member.isSelected || true;
                    });
                });
                $scope[cubeType + 'Dimensions'] = dimensions;
                return dimensions;
            };

			getCubeId(cubeName, cubeParams)
				.then(buildDimensions)
				.then(addSelectedValue);
		};

		$scope.$on(EVENTS.moveForward, function() {

            $scope.setTimeGranularity($scope.selectedTime);
            $scope.setDimensionsLabel($scope.spendDimensions, 'spend');
            $scope.setDimensionsLabel($scope.kpiDimensions, 'kpi');

            var cubes = {
                time: DimensionService.getSelectedTimeDimension($scope.timeDimension, $scope.selectedTime) || {},
                spend: DimensionService.getSelectedDimensions($scope.spendDimensions) || [],
                kpi: DimensionService.getSelectedDimensions($scope.kpiDimensions) || []
            };
            console.info('cubes: ', cubes);

		});

        $scope.$watch("selectedTime", function(){
            if ($scope.selectedTime){
                $scope.$emit(EVENTS.scenarioTemplatesAdvance, true);
            } else {
                $scope.$emit(EVENTS.scenarioTemplatesAdvance, false);
            }
        });

		init();

	}]);
