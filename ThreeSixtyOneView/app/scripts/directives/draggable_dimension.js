'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('draggableDimension', function() {
        return {
            templateUrl: 'views/directives/draggable_dimension.tpl.html',
            restrict: "AE",
            replace: true,
            scope: {
                name: '=',
                delete: '&clickClose',
                menu: '=',
                rowOrCol: '='
            },
            link: function(scope, elem, attrs) {
                elem.on('click', '.fa-remove', function() {
                    $(this).parents('.pbItem').remove();
                    scope.delete();
                });
            },
            controller: function($scope) {
                $scope.show = false;
                $scope.selected = function(label) {
                     return $scope.$parent.added[label];
                };

                $scope.selectDimension = function(selected) {
                    $scope.$parent.replaceItem(selected, $scope.name, $scope.rowOrCol);
                    $scope.show = false;
                }

                $scope.toggleMenu = function() {
                    $scope.show = !$scope.show;
                }
            }
        };
    })
    .directive('addDimensionBtn', function() {
        return {
            templateUrl: 'views/directives/add_dimension_button.tpl.html',
            restrict: "AE",
            replace: true,
            scope: {
                menu: '=',
                rowOrCol: '='
            },
            controller: function($scope) {
                $scope.show = false;
                $scope.selected = function(label) {
                     return $scope.$parent.added[label];
                }

                $scope.selectDimension = function(selected) {
                    $scope.$parent.addItem(selected, $scope.rowOrCol);
                    $scope.show = false;
                }

                $scope.toggleMenu = function() {
                    $scope.show = !$scope.show;
                }
            }
        };
    });