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
            buildDimensions($scope.dimensionsList, $scope.kpisList);
        },
        buildDimensions = function(dimensionsList, kpisList) {

            var addSelectedValue = function(dimensions) {
                _.each(dimensions, function(dimension) {
                    dimension.isSelected = dimension.isSelected || true;
                    var childrenList = dimension.members ? dimension.members : dimension.attributes;
                    _.each(childrenList, function(children) {
                        children.isSelected = children.isSelected || true;
                    });
                });
                return dimensions;
            };

            // filter to get time dimensions
            $scope.timeDimension = _.find(dimensionsList, function(dimension) { return dimension.type === 'TimeDimension' });
            $scope.times = _.pluck($scope.timeDimension.attributes, 'label');

            // filter to get kpi dimension
            $scope.kpiDimensions = kpisList;
            addSelectedValue($scope.kpiDimensions);

            $scope.standardDimensions = _.filter(dimensionsList, function(dimension) { return dimension.type === 'StandardDimension' });
            addSelectedValue($scope.standardDimensions);

        };

		$scope.$on(EVENTS.flipbookAdvance, function() {

            $scope.setTimeGranularity($scope.selectedTime);
            $scope.setDimensionsLabel($scope.standardDimensions, 'standard');
            $scope.setDimensionsLabel($scope.kpiDimensions, 'kpi');

            var cubes = {
                time: DimensionService.getSelectedTimeDimension($scope.timeDimension, $scope.selectedTime) || {},
                standard: DimensionService.getSelectedDimensions($scope.standardDimensions) || [],
                kpi: DimensionService.getSelectedDimensions($scope.kpiDimensions) || []
            };
            console.info('cubes: ', cubes);

		});

        $scope.$watch("selectedTime", function(){
            if ($scope.selectedTime){
                $scope.$emit(EVENTS.flipbookAllowAdvance, true);
            } else {
                $scope.$emit(EVENTS.flipbookAllowAdvance, false);
            }
        });

		init();

	}]);
