'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ChooseDimensionsCtrl
 * @description
 * # ChooseDimensionsCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
    .controller('ChooseDimensionsCtrl', ['$scope', 'EVENTS', function($scope, EVENTS) {
        var scenarioTemplateId,
        init = function() {
            $scope.selectedTime = $scope.timeGranularity ? $scope.timeGranularity : '';
            buildDimensions($scope.dimensions, $scope.kpisList);
            if (checkIfInitial($scope.dimensions) && checkIfInitial($scope.kpisList)) {
                addSelectedValue($scope.kpiDimensions);
                addSelectedValue($scope.standardDimensions);
            }
        },
        checkIfInitial = function(dimensions) {
            var initial = true;
            _.each(dimensions, function(dimension) {
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
        buildDimensions = function(dimensions, kpisList) {
            // filter to get time dimensions
            $scope.timeDimension = _.find(dimensions, function(dimension) { return dimension.type === 'TimeDimension' });
            $scope.times = _.pluck($scope.timeDimension.members, 'label');
            // filter to get kpi dimensions
            $scope.kpiDimensions = kpisList;
            // filter to get standard dimensions
            $scope.standardDimensions = _.filter(dimensions, function(dimension) { return dimension.type === 'StandardDimension' });
        };

        $scope.filtersModalCallback = function(newFilterData) {
            console.log('newFilterData', newFilterData);
        };

		$scope.$on(EVENTS.flipbookAdvance, function() {
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
