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
                    $scope.addDimension = $attrs.template === 'add_dimension_button' ? true : false;
                }, added = !!$attrs.addedValues ? $attrs.addedValues : false;

                $scope.isSelected = function(label) {
                     return added ? $scope[added][label] : $scope.$parent.added[label];
                };

                $scope.selectDimension = function(selected, prioLabel) {
                    if($scope.addDimension) {
                        $scope.$parent.addItem(selected, $attrs.rowOrCol);
                    } else {
                        $scope.$parent.replaceItem(selected, prioLabel, $attrs.rowOrCol);
                    }
                };

                $scope.delete = function(index) {
                    $scope.$parent.deleteItem(index, $attrs.rowOrCol);
                };

                init();
            }
        };
    });