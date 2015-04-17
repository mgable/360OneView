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
            $scope.selectedTime = $scope.timeGranularity ? $scope.timeGranularity : '';
            buildDimensions($scope.dimensionsList, $scope.kpisList);
            if (checkIfInitial($scope.dimensionsList) && checkIfInitial($scope.kpisList)) {
                addSelectedValue($scope.kpiDimensions);
                addSelectedValue($scope.standardDimensions);
            }
        },
        checkIfInitial = function(dimensionsList) {
            var initial = true;
            _.each(dimensionsList, function(dimension) {
                if (dimension.isSelected !== undefined) {
                    initial = false;
                }
            });
            return initial;
        },
        addSelectedValue = function(dimensions) {
            _.each(dimensions, function(dimension) {
                dimension.isSelected = dimension.isSelected || true;
                var childrenList = dimension.members ? dimension.members : dimension.attributes;
                _.each(childrenList, function(children) {
                    children.isSelected = children.isSelected || true;
                });
            });
            return dimensions;
        },
        buildDimensions = function(dimensionsList, kpisList) {
            // filter to get time dimensions
            $scope.timeDimension = _.find(dimensionsList, function(dimension) { return dimension.type === 'TimeDimension' });
            $scope.times = _.pluck($scope.timeDimension.attributes, 'label');
            // filter to get kpi dimensions
            $scope.kpiDimensions = kpisList;
            // filter to get standard dimensions
            $scope.standardDimensions = _.filter(dimensionsList, function(dimension) { return dimension.type === 'StandardDimension' });
        };

		$scope.$on(EVENTS.flipbookAdvance, function() {
            $scope.setTimeGranularity($scope.selectedTime);
            $scope.setDimensionsLabel($scope.standardDimensions, 'standard');
            $scope.setDimensionsLabel($scope.kpiDimensions, 'kpi');
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
