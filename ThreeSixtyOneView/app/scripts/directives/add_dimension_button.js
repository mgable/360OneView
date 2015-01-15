'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('addDimensionBtn', function() {
        return {
            templateUrl: 'views/directives/add_dimension_button.tpl.html',
            restrict: "AE",
            replace: true,
            controller: function($scope, $element, $attrs) {
                $scope.show = false;
                $scope.selected = function(label) {
                     return $scope.$parent.added[label];
                };

                $scope.selectDimension = function(selected) {
                    $scope.$parent.addItem(selected, $attrs.rowOrCol);
                    $scope.show = false;
                };

                $scope.toggleMenu = function() {
                    $scope.show = !$scope.show;
                };
            }
        };
    });

    