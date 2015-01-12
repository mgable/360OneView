'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('draggableDimension', function() {
        return {
            templateUrl: 'views/directives/draggable_dimension.tpl.html',
            restrict: "AE",
            replace: true,
            controller: function($scope, $element, $attrs) {
                $scope.show = false;
                $scope.selected = function(label) {
                     return $scope.$parent.added[label];
                };

                $scope.selectDimension = function(selected, prioLabel) {
                    $scope.$parent.replaceItem(selected, prioLabel, $attrs.rowOrCol);
                    $scope.show = false;
                };

                $scope.toggleMenu = function() {
                    $scope.show = !$scope.show;
                };

                $scope.delete = function(index) {
                    $scope.$parent.deleteItem(index, $attrs.rowOrCol);
                };
            }
        };
    })
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