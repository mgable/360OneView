'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('draggableDimension', function() {
        return {
            templateUrl: function(elem, attrs) {
                return "views/directives/" + attrs.template + ".tpl.html";
            },
            restrict: "AE",
            replace: true,
            controller: function($scope, $element, $attrs) {
                var init = function() {
                    $scope.show = false;
                    $scope.addDimension = $attrs['template'] === 'add_dimension_button' ? true : false;
                };

                $scope.selected = function(label) {
                     return $scope.$parent.added[label];
                };

                $scope.selectDimension = function(selected, prioLabel) {
                    if($scope.addDimension) {
                        $scope.$parent.addItem(selected, $attrs.rowOrCol);
                    } else {
                        $scope.$parent.replaceItem(selected, prioLabel, $attrs.rowOrCol);
                    }
                    $scope.show = false;
                };

                $scope.toggleMenu = function() {
                    $scope.show = !$scope.show;
                };

                $scope.delete = function(index) {
                    $scope.$parent.deleteItem(index, $attrs.rowOrCol);
                };

                init();
            }
        };
    });